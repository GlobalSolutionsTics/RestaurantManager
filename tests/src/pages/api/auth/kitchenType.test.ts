import {
  createUser,
  loginUsers,
  SEED_OF_JWT,
  updateUser,
} from "@/pages/api/auth/controller/users";
import type { IUsersResponse } from "@/pages/api/auth/controller/users";
import { getDoc, updateDoc } from "firebase/firestore";
import jwt from "jsonwebtoken";

jest.mock("@firebase/config", () => ({ firestore: {} }));
jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
}));

let users: IUsersResponse[];
const kitchenId = "26bcca54-da1a-451c-9e1c-e15b190a40c7";

beforeEach(() => {
  users = [];
  (getDoc as jest.Mock).mockImplementation(async () => ({
    exists: () => true,
    data: () => ({ data: users.map((user) => ({ ...user })) }),
  }));
  (updateDoc as jest.Mock).mockImplementation(async (_ref, { data }) => {
    users = data;
  });
});

it("persists the kitchen UUID and includes it in the login response and token", async () => {
  await createUser("Cocinero", "cocinero", "password", "cocina", kitchenId);
  expect(users[0].kitchenType).toBe(kitchenId);

  const login = await loginUsers("cocinero", "password");
  if (!login) throw new Error("El inicio de sesión falló.");

  expect(login.kitchenType).toBe(kitchenId);
  expect(jwt.verify(login.token, SEED_OF_JWT)).toMatchObject({
    kitchenType: kitchenId,
  });
});

it("supports legacy cooks and removes the assignment when the user changes roles", async () => {
  await createUser("Cocinero", "cocinero", "password", "cocina");
  expect(users[0]).not.toHaveProperty("kitchenType");
  expect(await loginUsers("cocinero", "password")).toMatchObject({
    type: "cocina",
  });

  await updateUser({ ...users[0], kitchenType: kitchenId });
  await updateUser({ ...users[0], type: "mesero" });
  expect(users[0]).not.toHaveProperty("kitchenType");
});
