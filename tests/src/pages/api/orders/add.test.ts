/** @jest-environment node */

import type { NextApiRequest, NextApiResponse } from "next";
import { runTransaction } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import { StatusEnum } from "@/enums/states.enum";
import handler from "@/pages/api/orders/add";
import { DEFAULT_TABLE_LLEVAR } from "@/utils/constants";
import { getActualDateDB } from "@/utils/formats";

jest.mock("@firebase/config", () => ({ realtimeDB: {} }));
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  signInAnonymously: jest.fn(),
}));
jest.mock("firebase/database", () => ({
  ref: jest.fn((_db, path) => path),
  runTransaction: jest.fn(),
}));
jest.mock("@/utils/formats", () => ({ getActualDateDB: jest.fn() }));

const day = "2026/11/23";
const nextDay = "2026/11/24";
const key = () => `${day}:${uuidv4()}`;
const mockTransaction = jest.mocked(runTransaction);
const mockDate = jest.mocked(getActualDateDB);

type Orders = Record<
  string,
  { status: StatusEnum; orderId: number; tableNumber?: number }
>;
let orders: Orders | null;
let confirm: () => Promise<void>;

const submit = (tableNumber: number, submissionKey: string) => {
  const req = {
    method: "POST",
    headers: { "idempotency-key": submissionKey },
    body: {
      name: "Cliente",
      tableNumber,
      waiter: "mesero",
      diners: 1,
      dishes: 1,
      dishesDescription: [{ name: "Taco" }],
    },
  } as unknown as NextApiRequest;
  const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
  const response = handler(req, res as unknown as NextApiResponse);
  return { ...res, response };
};

beforeEach(() => {
  jest.clearAllMocks();
  orders = null;
  confirm = async () => {};
  mockDate.mockReturnValue({
    fullDate: day,
    year: "2026",
    month: "11",
    day: "23",
  });
  mockTransaction.mockImplementation(async (_ref, update, options) => {
    expect(options?.applyLocally).toBe(false);
    // Model the cold cache and re-run the callback if another write wins.
    let previous: Orders | null = null;
    let next = update(previous) as Orders | null;
    await confirm();
    while (previous !== orders) {
      previous = orders;
      next = update(previous) as Orders | null;
      await confirm();
    }
    orders = next;
    return {
      committed: true,
      snapshot: { child: (uuid: string) => ({ exists: () => !!next?.[uuid] }) },
    } as Awaited<ReturnType<typeof runTransaction>>;
  });
});

it("returns the original UUID even for concurrent retries and after midnight", async () => {
  const submissionKey = key();
  const uuid = submissionKey.split(":")[1];
  const first = submit(3, submissionKey);
  const retry = submit(3, submissionKey);
  await Promise.all([first.response, retry.response]);
  mockDate.mockReturnValue({
    fullDate: nextDay,
    year: "2026",
    month: "11",
    day: "24",
  });
  const nextDayRetry = submit(3, submissionKey);
  await nextDayRetry.response;

  for (const result of [first, retry, nextDayRetry]) {
    expect(result.status).toHaveBeenCalledWith(201);
    expect(result.send).toHaveBeenCalledWith({ error: false, message: uuid });
  }
  expect(Object.keys(orders!)).toEqual([uuid]);
  expect(mockTransaction.mock.calls.at(-1)?.[0]).toEqual(
    expect.stringContaining(day),
  );
});

it("keeps one active order for simultaneous submissions to the same table", async () => {
  const first = submit(3, key());
  const second = submit(3, key());
  await Promise.all([first.response, second.response]);

  expect(
    [first.status.mock.calls[0][0], second.status.mock.calls[0][0]].sort(),
  ).toEqual([201, 202]);
  expect(Object.values(orders!)).toEqual([
    expect.objectContaining({ status: StatusEnum.SEND, tableNumber: 3 }),
  ]);
});

it("keeps identical takeaway orders separate and assigns distinct folios in parallel", async () => {
  orders = { legacy: { orderId: 7, status: StatusEnum.CLOSED } };
  const first = submit(DEFAULT_TABLE_LLEVAR, key());
  const second = submit(DEFAULT_TABLE_LLEVAR, key());
  await Promise.all([first.response, second.response]);

  expect(first.status).toHaveBeenCalledWith(201);
  expect(second.status).toHaveBeenCalledWith(201);
  expect(first.send.mock.calls[0][0].message).not.toBe(
    second.send.mock.calls[0][0].message,
  );
  expect(Object.values(orders!).map((order) => order.orderId)).toEqual([
    7, 8, 9,
  ]);
});

it("can reuse a table after its previous order closes", async () => {
  orders = {
    legacy: { orderId: 7, status: StatusEnum.CLOSED, tableNumber: 3 },
  };
  const result = submit(3, key());
  await result.response;
  expect(result.status).toHaveBeenCalledWith(201);
  expect(Object.keys(orders!)).toHaveLength(2);
});

it("waits for Firebase before sending a success response", async () => {
  let acknowledge!: () => void;
  const acknowledgement = new Promise<void>((resolve) => {
    acknowledge = resolve;
  });
  confirm = () => acknowledgement;
  const result = submit(3, key());

  await Promise.resolve();
  await Promise.resolve();
  expect(mockTransaction).toHaveBeenCalled();
  expect(result.send).not.toHaveBeenCalled();

  acknowledge();
  await result.response;
  expect(result.status).toHaveBeenCalledWith(201);
});

it("returns an error if Firebase rejects the write", async () => {
  const log = jest.spyOn(console, "error").mockImplementation(() => {});
  confirm = async () => {
    throw new Error("permission_denied");
  };
  try {
    const result = submit(3, key());
    await result.response;

    expect(result.status).toHaveBeenCalledWith(500);
    expect(result.send).toHaveBeenCalledWith(
      expect.objectContaining({ error: true }),
    );
    expect(orders).toBeNull();
  } finally {
    log.mockRestore();
  }
});
