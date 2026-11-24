/** @jest-environment node */

import { OrdersDishesStatus } from "@/enums/orders.enum";
import { StatusApplicationEnum, StatusEnum } from "@/enums/states.enum";
import { changeStatusRequestEditionForOrderId } from "@/pages/api/orders/controllers/updateOrder";
import handler from "@/pages/api/orders/update/[id]/v2/status";
import type { TResponseOrders } from "@/types/menu.types";
import { runTransaction } from "firebase/database";
import jwt from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";

jest.mock("@/pages/api/auth/controller/users", () => ({ SEED_OF_JWT: "test" }));
jest.mock("@/pages/api/orders/controllers/updateOrder", () => ({
  changeStatusRequestEditionForOrderId: jest.fn(),
}));
jest.mock("@firebase/config", () => ({ realtimeDB: {} }));
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  signInAnonymously: jest.fn(),
}));
jest.mock("firebase/database", () => ({
  ref: jest.fn(),
  runTransaction: jest.fn(),
}));

const id = uuidv4();
const dish = {
  name: "Taco",
  number: 1,
  price: 20,
  type: "comida",
  isUniquePrice: true,
};
const { SENT, IN_PREPARATION, FINISHED } = OrdersDishesStatus;
let order: TResponseOrders;

beforeEach(() => {
  jest.clearAllMocks();
  order = {
    uuid: id,
    status: StatusEnum.SEND,
    tableNumber: 1,
    name: "",
    dishes: 3,
    dishesDescription: [
      { ...dish, kitchenType: "barra", status: SENT },
      { ...dish, kitchenType: "plancha", status: SENT },
      { ...dish, status: SENT },
    ],
  };
  jest.mocked(runTransaction).mockImplementation(async (_ref, update) => {
    update(null);
    order = update(order) as TResponseOrders;
    return {
      committed: true,
      snapshot: {
        child: (field: "uuid" | "status") => ({ val: () => order[field] }),
      },
    } as unknown as Awaited<ReturnType<typeof runTransaction>>;
  });
});

async function put(
  kitchenType: string,
  expectedStatus: StatusEnum,
  type = "cocina",
  expectedAction?: "prepare" | "finish",
) {
  const token = jwt.sign({ type, kitchenType }, "test");
  const req = {
    method: "PUT",
    headers: { authorization: `Bearer ${token}` },
    query: { id },
    body: { expectedStatus, expectedAction, kitchenType: "plancha" },
  } as unknown as NextApiRequest;
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  await handler(req, res as unknown as NextApiResponse);
  return res.status.mock.calls[0][0];
}

const statuses = () => order.dishesDescription.map(({ status }) => status);

it("prepares and finishes only the signed-in kitchen's dishes and closes after the last kitchen", async () => {
  expect(await put("barra", StatusEnum.SEND)).toBe(200);
  expect(statuses()).toEqual([IN_PREPARATION, SENT, IN_PREPARATION]);
  expect(order.status).toBe(StatusEnum.IN_PROGRESS);
  expect(await put("plancha", StatusEnum.SEND)).toBe(409);
  expect(statuses()).toEqual([IN_PREPARATION, SENT, IN_PREPARATION]);

  expect(await put("barra", StatusEnum.IN_PROGRESS)).toBe(200);
  expect(statuses()).toEqual([FINISHED, SENT, FINISHED]);
  expect(order.status).toBe(StatusEnum.IN_PROGRESS);
  expect(changeStatusRequestEditionForOrderId).not.toHaveBeenCalled();

  expect(
    await put("plancha", StatusEnum.IN_PROGRESS, "cocina", "prepare"),
  ).toBe(200);
  expect(statuses()).toEqual([FINISHED, IN_PREPARATION, FINISHED]);
  expect(order.status).toBe(StatusEnum.IN_PROGRESS);
  expect(
    await put("plancha", StatusEnum.IN_PROGRESS, "cocina", "prepare"),
  ).toBe(409);
  expect(statuses()).toEqual([FINISHED, IN_PREPARATION, FINISHED]);
  expect(await put("plancha", StatusEnum.IN_PROGRESS, "cocina", "finish")).toBe(
    200,
  );
  expect(statuses()).toEqual([FINISHED, FINISHED, FINISHED]);
  expect(order.status).toBe(StatusEnum.ORDER_READY);
  expect(changeStatusRequestEditionForOrderId).toHaveBeenCalledWith(
    StatusApplicationEnum.CLOSE,
    id,
  );
});

it("only prepares newly sent or legacy active dishes in an edited order", async () => {
  order.status = StatusEnum.EDITED;
  order.dishesDescription = [
    { ...dish, kitchenType: "barra", status: OrdersDishesStatus.ACTIVE },
    { ...dish, kitchenType: "barra", status: IN_PREPARATION },
    { ...dish, kitchenType: "plancha", status: OrdersDishesStatus.READY },
  ];
  expect(await put("barra", StatusEnum.EDITED)).toBe(200);
  expect(statuses()).toEqual([
    IN_PREPARATION,
    IN_PREPARATION,
    OrdersDishesStatus.READY,
  ]);
  expect(order.status).toBe(StatusEnum.IN_PROGRESS);
});

it("rejects other user roles and kitchens without applicable dishes", async () => {
  expect(await put("barra", StatusEnum.SEND, "mesero")).toBe(403);
  expect(runTransaction).not.toHaveBeenCalled();

  order.dishesDescription = [{ ...dish, kitchenType: "plancha", status: SENT }];
  expect(await put("barra", StatusEnum.SEND)).toBe(409);
  expect(statuses()).toEqual([SENT]);
});

it("reserves a shared dish for the kitchen that started it", async () => {
  order.dishesDescription = [{ ...dish, status: SENT }];

  expect(await put("barra", StatusEnum.SEND, "cocina", "prepare")).toBe(200);
  expect(order.dishesDescription[0]).toMatchObject({
    status: IN_PREPARATION,
    preparingKitchen: "barra",
  });
  expect(await put("plancha", StatusEnum.IN_PROGRESS, "cocina", "finish")).toBe(
    409,
  );
  expect(statuses()).toEqual([IN_PREPARATION]);
  expect(await put("barra", StatusEnum.IN_PROGRESS, "cocina", "finish")).toBe(
    200,
  );
  expect(statuses()).toEqual([FINISHED]);
  expect(order.status).toBe(StatusEnum.ORDER_READY);
});
