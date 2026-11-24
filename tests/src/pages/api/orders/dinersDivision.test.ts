/** @jest-environment node */

import type { NextApiRequest, NextApiResponse } from "next";
import { runTransaction } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import handler from "@/pages/api/orders/update/[id]/diners-division";
import { getOrderDishKey } from "@/utils/groupOrderDishes";
import { StatusEnum } from "@/enums/states.enum";
import type { TResponseOrders } from "@/types/menu.types";

jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(() => ({ type: "mesero", uuid: "waiter-1" })),
}));
jest.mock("@/pages/api/auth/controller/users", () => ({ SEED_OF_JWT: "test" }));
jest.mock("@firebase/config", () => ({ realtimeDB: {} }));
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  signInAnonymously: jest.fn(),
}));
jest.mock("firebase/database", () => ({
  ref: jest.fn(),
  runTransaction: jest.fn(),
}));
jest.mock("@/utils/formats", () => ({
  getActualDateDB: () => ({ fullDate: "2026/11/23" }),
}));

const id = uuidv4();
const dish = {
  uuid: "taco",
  name: "Taco",
  number: 1,
  price: 27.15,
  type: "food",
  isUniquePrice: true,
};
const key = getOrderDishKey(dish);
let order: TResponseOrders;

beforeEach(() => {
  order = {
    uuid: id,
    waiter: "waiter-1",
    status: StatusEnum.SEND,
    name: "",
    tableNumber: 1,
    dishes: 3,
    dishesDescription: [dish, { ...dish, number: 2 }],
  };
  jest.mocked(runTransaction).mockImplementation(async (_ref, update) => {
    update(null);
    order = update(order) as TResponseOrders;
    return { committed: true } as Awaited<ReturnType<typeof runTransaction>>;
  });
});

async function put(body: unknown) {
  const req = {
    method: "PUT",
    headers: { authorization: "Bearer test" },
    query: { id },
    body,
  } as unknown as NextApiRequest;
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  await handler(req, res as unknown as NextApiResponse);
  return res;
}

it("stores a missing diner count and prices allocations using the current order", async () => {
  const originalDishes = order.dishesDescription;
  const result = await put({
    diners: 2,
    allocations: [
      { diner: 1, dishes: [{ key, number: 1 }], total: 1 },
      { diner: 2, dishes: [{ key, number: 2 }], total: 1 },
    ],
  });
  expect(result.status).toHaveBeenCalledWith(200);
  expect(order.diners).toBe(2);
  expect(order.dishesDescription).toBe(originalDishes);
  expect(order.dinersDivisionTotal).toEqual([
    { diner: 1, dishes: [dish], total: 27.15 },
    { diner: 2, dishes: [{ ...dish, number: 2 }], total: 54.3 },
  ]);
});

it("rejects assigning the same units to multiple diners", async () => {
  order.diners = 2;
  const previous = order;
  const result = await put({
    diners: 2,
    allocations: [
      { diner: 1, dishes: [{ key, number: 2 }] },
      { diner: 2, dishes: [{ key, number: 2 }] },
    ],
  });
  expect(result.status).toHaveBeenCalledWith(409);
  expect(order).toBe(previous);
});

it("rejects changing the count on an order with a registered diner count", async () => {
  order.diners = 2;
  const result = await put({ diners: 3, allocations: [] });
  expect(result.status).toHaveBeenCalledWith(409);
  expect(order.diners).toBe(2);
});

it("rejects an update for another waiter's order", async () => {
  order.waiter = "waiter-2";
  const result = await put({ diners: 2, allocations: [] });
  expect(result.status).toHaveBeenCalledWith(404);
  expect(order.dinersDivisionTotal).toBeUndefined();
});
