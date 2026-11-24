import "@testing-library/jest-dom";
import { useOrderForEditing } from "@/hooks/Orders/useOrderForEditing";
import AddOrderPage from "@/pages/orders/add/[id]";
import AdditionReviewPage from "@/pages/orders/add/[id]/send";
import { getDishCatalog } from "@/services/dishes";
import { sendApplicationOrderAdd } from "@/services/order";
import ordersDishes from "@/store/slices/orders.slice";
import { TOKEN_ID } from "@/utils/strings";
import { configureStore } from "@reduxjs/toolkit";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";

const mockRouter = {
  query: { id: "order-1" },
  push: jest.fn(),
  replace: jest.fn(),
};
jest.mock("next/router", () => ({ useRouter: () => mockRouter }));
jest.mock("@/pages/admin/components/protectPage", () => ({
  __esModule: true,
  default: ({ children }: React.PropsWithChildren) => children,
}));
jest.mock("@/hooks/Orders/useOrderForEditing", () => ({
  useOrderForEditing: jest.fn(),
}));
jest.mock("@/services/dishes", () => ({ getDishCatalog: jest.fn() }));
jest.mock("@/services/order", () => ({ sendApplicationOrderAdd: jest.fn() }));

afterEach(() => {
  jest.clearAllMocks();
  sessionStorage.removeItem(TOKEN_ID);
  document.cookie =
    "restaurant-review-tour-addition-mesero=; Max-Age=0; Path=/";
});

it("preserves added dishes and their submission ID across review, back navigation and a retry", async () => {
  jest.mocked(useOrderForEditing).mockReturnValue({
    uuid: "order-1",
    name: "",
    tableNumber: 4,
    dishes: 1,
    dishesDescription: [],
    status: "ORDEN ENVIADA",
  });
  const dish = {
    uuid: "cafe",
    name: "Café",
    type: "bebidas",
    price: 25,
    isUniquePrice: true,
    kitchenType: "barra",
  };
  const variable = {
    ...dish,
    uuid: "jugo",
    name: "Jugo",
    isUniquePrice: false,
  };
  jest
    .mocked(getDishCatalog)
    .mockResolvedValue([
      { id: "bebidas", value: "Bebidas", dishes: [dish, variable] },
    ]);
  jest
    .mocked(sendApplicationOrderAdd)
    .mockResolvedValueOnce(false)
    .mockResolvedValueOnce(true);
  const store = configureStore({
    reducer: { ordersDishes, user: () => ({ uuid: "mesero", type: "mesero" }) },
  });
  sessionStorage.setItem(TOKEN_ID, "token");
  document.cookie = "restaurant-review-tour-addition-mesero=1; Path=/";
  const view = render(
    <Provider store={store}>
      <AddOrderPage />
    </Provider>,
  );
  fireEvent.click(
    await screen.findByRole("button", { name: "Agregar una unidad de Café" }),
  );
  fireEvent.click(
    screen.getByRole("button", { name: "Agregar una unidad de Café" }),
  );
  fireEvent.click(
    screen.getByRole("button", { name: "Agregar una unidad de Jugo" }),
  );
  fireEvent.click(screen.getByRole("button", { name: "Revisar adición" }));
  expect(mockRouter.push).toHaveBeenCalledWith("/orders/add/order-1/send");
  const draft = store.getState().ordersDishes.additionDraft;

  view.rerender(
    <Provider store={store}>
      <AdditionReviewPage />
    </Provider>,
  );
  expect(
    screen.getByRole("link", { name: "Volver a platillos" }),
  ).toHaveAttribute("href", "/orders/add/order-1");

  view.rerender(
    <Provider store={store}>
      <AddOrderPage />
    </Provider>,
  );
  expect(
    await screen.findByRole("button", { name: "Quitar una unidad de Café" }),
  ).toBeEnabled();
  expect(store.getState().ordersDishes.additionDraft).toEqual(draft);

  view.rerender(
    <Provider store={store}>
      <AdditionReviewPage />
    </Provider>,
  );
  expect(screen.getAllByText("Precio variable")).toHaveLength(2);
  fireEvent.click(screen.getByRole("button", { name: "Desglosar platillos" }));
  const titles = screen.getAllByRole("textbox", { name: "Título" });
  expect(titles).toHaveLength(3);
  fireEvent.change(titles[1], { target: { value: "Café especial" } });
  fireEvent.click(screen.getByRole("button", { name: "Actualizar platillos" }));
  expect(screen.getByRole("heading", { name: "Café especial" })).toBeVisible();
  const notes = screen.getByRole("textbox", {
    name: "Notas de la orden para cocina",
  });
  fireEvent.change(notes, { target: { value: " Sin azúcar " } });
  fireEvent.click(screen.getByRole("button", { name: "Enviar adición" }));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "No se pudo enviar",
  );
  expect(
    screen.getByRole("button", { name: "Desglosar platillos" }),
  ).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: "Enviar adición" }));
  await waitFor(() =>
    expect(mockRouter.replace).toHaveBeenCalledWith("/orders/myOrders"),
  );
  expect(sendApplicationOrderAdd).toHaveBeenCalledTimes(2);
  expect(jest.mocked(sendApplicationOrderAdd).mock.calls[0]).toEqual(
    jest.mocked(sendApplicationOrderAdd).mock.calls[1],
  );
  expect(
    jest.mocked(sendApplicationOrderAdd).mock.calls[1][2].modifications,
  ).toMatchObject({
    submissionId: draft?.submissionId,
    notes: "Sin azúcar",
    dishesDescription: [
      { ...dish, number: 1 },
      { ...dish, number: 1, name: "Café especial" },
      { ...variable, number: 1 },
    ],
  });
  expect(store.getState().ordersDishes.additionDraft).toBeUndefined();
});
