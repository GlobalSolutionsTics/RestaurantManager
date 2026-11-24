import handler from "@/pages/api/menu/catalog";
import { getDocs } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";

jest.mock("@firebase/config", () => ({ firestore: {} }));
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
}));

it("returns registered categories with their dishes and keeps empty categories", async () => {
  const categories = [
    { id: "comida", value: "Comida" },
    { id: "bebidas", value: "Bebidas" },
  ];
  const dish = {
    uuid: "platillo",
    name: "Taco",
    kitchenType: "cocina",
    type: "comida",
    price: 20,
    isUniquePrice: true,
  };
  const documents = [
    { id: "categorias", data: () => ({ data: categories }) },
    { id: "comida", data: () => ({ data: [dish] }) },
  ];
  jest
    .mocked(getDocs)
    .mockResolvedValue({ docs: documents } as Awaited<
      ReturnType<typeof getDocs>
    >);
  const response = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  await handler(
    { method: "GET" } as NextApiRequest,
    response as unknown as NextApiResponse,
  );

  expect(response.status).toHaveBeenCalledWith(200);
  expect(response.json).toHaveBeenCalledWith({
    data: [
      { ...categories[0], dishes: [dish] },
      { ...categories[1], dishes: [] },
    ],
  });
});
