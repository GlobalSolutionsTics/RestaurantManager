/** @jest-environment node */

import type { NextApiRequest, NextApiResponse } from "next";
import { runTransaction } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import { OrdersDishesStatus } from "@/enums/orders.enum";
import { StatusEnum } from "@/enums/states.enum";
import add from "@/pages/api/orders/update/[id]/add";
import edit from "@/pages/api/orders/update/[id]/order";

jest.mock("jsonwebtoken", () => ({ verify: jest.fn() }));
jest.mock("@/pages/api/auth/controller/users", () => ({ SEED_OF_JWT: "test" }));
jest.mock("@firebase/config", () => ({ realtimeDB: {}, firestore: {} }));
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  signInAnonymously: jest.fn(),
}));
jest.mock("firebase/firestore", () => ({}));
jest.mock("firebase/database", () => ({
  ref: jest.fn((_db, path) => path),
  runTransaction: jest.fn(),
}));
jest.mock("@/utils/formats", () => ({
  getActualDateDB: () => ({ fullDate: "2026/11/23" }),
}));

const dish = {
  uuid: "menu-taco",
  name: "Taco",
  price: 20,
  number: 1,
  status: OrdersDishesStatus.ACTIVE,
};

type Order = {
  uuid: string;
  status: StatusEnum;
  dishesDescription: (typeof dish)[];
  dishAdditionIds?: Record<string, true>;
};

const first = uuidv4();
const second = uuidv4();
const orders = new Map<string, Order>();
let confirm: () => Promise<void>;

function request(
  endpoint: typeof add,
  orderId: string,
  modifications: Record<string, unknown>,
) {
  const req = {
    method: "PUT",
    headers: { authorization: "Bearer test" },
    query: { id: orderId },
    body: { modifications },
  } as unknown as NextApiRequest;
  const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
  const response = endpoint(req, res as unknown as NextApiResponse);
  return { ...res, response };
}

const mockTransaction = jest.mocked(runTransaction);
beforeEach(() => {
  jest.clearAllMocks();
  orders.clear();
  orders.set(first, {
    uuid: first,
    status: StatusEnum.SEND,
    dishesDescription: [dish],
  });
  orders.set(second, {
    uuid: second,
    status: StatusEnum.SEND,
    dishesDescription: [{ ...dish, name: "Otro taco" }],
  });
  confirm = async () => {};

  mockTransaction.mockImplementation(async (ref, update) => {
    const id = String(ref).split("/").at(-1)!;
    let previous: Order | null = null;
    let next = update(previous) as Order | null;
    await confirm();
    while (previous !== (orders.get(id) ?? null)) {
      previous = orders.get(id) ?? null;
      next = update(previous) as Order | null;
      await confirm();
    }
    if (next) orders.set(id, next);
    return {
      committed: true,
      snapshot: {
        child: () => ({
          child: (key: string) => ({
            exists: () => !!next?.dishAdditionIds?.[key],
          }),
        }),
      },
    } as unknown as Awaited<ReturnType<typeof runTransaction>>;
  });
});

it.each([add, edit])(
  "rejects a request whose draft belongs to another order",
  async (endpoint) => {
    const result = request(endpoint, first, {
      orderUUID: second,
      dishesDescription: [dish],
      originalDishes: [dish],
      submissionId: uuidv4(),
    });
    await result.response;
    expect(result.status).toHaveBeenCalledWith(400);
    expect(mockTransaction).not.toHaveBeenCalled();
  },
);

it("edits only the selected line when the same menu dish appears twice", async () => {
  const readyDish = { ...dish, status: OrdersDishesStatus.READY };
  const originalDishes = [readyDish, dish];
  orders.get(first)!.dishesDescription = originalDishes;
  const result = request(edit, first, {
    orderUUID: first,
    originalDishes,
    dishesDescription: [readyDish, { ...dish, number: 4 }],
  });
  await result.response;
  expect(result.status).toHaveBeenCalledWith(200);
  expect(orders.get(first)?.dishesDescription).toEqual([
    readyDish,
    { ...dish, number: 4 },
  ]);
  expect(orders.get(second)?.dishesDescription[0].name).toBe("Otro taco");
});

it("rejects an edit opened before another addition was confirmed", async () => {
  const addition = request(add, first, {
    orderUUID: first,
    submissionId: uuidv4(),
    dishesDescription: [dish],
  });
  await addition.response;
  const editResult = request(edit, first, {
    orderUUID: first,
    originalDishes: [dish],
    dishesDescription: [{ ...dish, number: 5 }],
  });
  await editResult.response;
  expect(editResult.status).toHaveBeenCalledWith(409);
  expect(orders.get(first)?.dishesDescription).toEqual([
    dish,
    { ...dish, status: OrdersDishesStatus.SENT },
  ]);
});

it("applies parallel retries once and keeps separate additions of the same dish", async () => {
  const modifications = {
    orderUUID: first,
    submissionId: uuidv4(),
    dishesDescription: [dish],
  };
  const responses = [
    request(add, first, modifications),
    request(add, first, modifications),
    request(add, first, { ...modifications, submissionId: uuidv4() }),
  ];
  await Promise.all(responses.map(({ response }) => response));
  responses.forEach(({ status }) => expect(status).toHaveBeenCalledWith(200));
  expect(orders.get(first)?.dishesDescription).toEqual([
    dish,
    ...Array.from({ length: 2 }, () => ({
      ...dish,
      status: OrdersDishesStatus.SENT,
    })),
  ]);
});

it("does not confirm an addition before Firebase acknowledges the write", async () => {
  let acknowledge!: () => void;
  const acknowledged = new Promise<void>((resolve) => {
    acknowledge = resolve;
  });
  confirm = () => acknowledged;
  const result = request(add, first, {
    orderUUID: first,
    submissionId: uuidv4(),
    dishesDescription: [dish],
  });
  await Promise.resolve();
  await Promise.resolve();
  expect(mockTransaction).toHaveBeenCalled();
  expect(result.send).not.toHaveBeenCalled();
  acknowledge();
  await result.response;
  expect(result.status).toHaveBeenCalledWith(200);
});
