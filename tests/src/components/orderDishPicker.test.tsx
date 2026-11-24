import "@testing-library/jest-dom";
import { configureStore } from "@reduxjs/toolkit";
import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import OrderDishPicker from "@/pages/orders/typeSelect";
import { getDishCatalog } from "@/services/dishes";
import orderCreate, {
  setCreateTableRDX,
} from "@/store/slices/create.order.slice";

const mockRouter = { isReady: true, push: jest.fn(), replace: jest.fn() };

jest.mock("next/router", () => ({ useRouter: () => mockRouter }));
jest.mock("@/pages/admin/components/protectPage", () => ({
  __esModule: true,
  default: ({ children }: React.PropsWithChildren) => children,
}));
jest.mock("@/services/dishes", () => ({ getDishCatalog: jest.fn() }));

it("searches without accents and changes only the quantity while retaining kitchen assignment", async () => {
  const dish = {
    name: "Café",
    price: 25,
    type: "bebidas",
    uuid: "cafe",
    kitchenType: "barra",
    isUniquePrice: true,
  };
  const taco = {
    name: "Taco",
    price: 30,
    type: "comida",
    uuid: "taco",
    isUniquePrice: true,
  };
  jest.mocked(getDishCatalog).mockResolvedValue([
    { id: "bebidas", value: "Bebidas", dishes: [dish] },
    { id: "comida", value: "Comida", dishes: [taco] },
  ]);
  const store = configureStore({ reducer: { orderCreate } });
  store.dispatch(setCreateTableRDX(2));
  render(
    <Provider store={store}>
      <OrderDishPicker />
    </Provider>,
  );

  await screen.findByRole("heading", { name: "Taco" });
  const category = screen.getByRole("combobox", { name: "Categoría" });
  fireEvent.change(category, { target: { value: "comida" } });
  expect(screen.queryByRole("heading", { name: "Café" })).not.toBeInTheDocument();
  fireEvent.change(category, { target: { value: "" } });
  fireEvent.change(screen.getByRole("searchbox"), {
    target: { value: "cafe" },
  });
  expect(
    screen.queryByRole("heading", { name: "Taco" }),
  ).not.toBeInTheDocument();

  const agregar = screen.getByRole("button", {
    name: "Agregar una unidad de Café",
  });
  fireEvent.click(agregar);
  fireEvent.click(agregar);
  expect(store.getState().orderCreate).toMatchObject({
    dishes: 2,
    dishesDescription: [{ ...dish, number: 2 }],
  });

  fireEvent.click(screen.getByRole("button", { name: "Revisar orden" }));
  expect(mockRouter.push).toHaveBeenCalledWith("/orders/finishOrder");
  fireEvent.click(
    screen.getByRole("button", { name: "Quitar una unidad de Café" }),
  );
  fireEvent.click(
    screen.getByRole("button", { name: "Quitar una unidad de Café" }),
  );
  expect(store.getState().orderCreate.dishesDescription).toEqual([]);
  expect(screen.getByRole("button", { name: "Revisar orden" })).toBeDisabled();
});
