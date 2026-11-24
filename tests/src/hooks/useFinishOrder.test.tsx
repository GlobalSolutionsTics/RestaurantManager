import { configureStore } from "@reduxjs/toolkit";
import { act, renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { useFinishOrder } from "@/hooks/Wainters/useFinishOrder";
import orderCreate, {
  resetCreateCommanda,
  setCreateTableRDX,
  setCreateDishSelection,
} from "@/store/slices/create.order.slice";
import { DEFAULT_TABLE_LLEVAR } from "@/utils/constants";
import { TOKEN_ID } from "@/utils/strings";

jest.mock("next/router", () => ({
  useRouter: () => ({ push: jest.fn().mockResolvedValue(true) }),
}));
jest.mock("@/services/config", () => ({
  listConfigurationService: jest.fn().mockResolvedValue({ tablesActives: 1 }),
}));
jest.mock("@/utils/formats", () => ({
  getActualDateDB: () => ({ fullDate: "2026/11/23" }),
}));
jest.mock("sweetalert2-react-content", () => () => ({ fire: jest.fn() }));

it("sends once per click sequence, reuses the key on retry, and resets it for a new order", async () => {
  const db = configureStore({
    reducer: { orderCreate, user: () => ({ uuid: "mesero" }) },
  });
  db.dispatch(setCreateTableRDX(DEFAULT_TABLE_LLEVAR));
  const dish = {
    uuid: "taco",
    name: "Taco",
    type: "comida",
    price: 20,
    isUniquePrice: true,
  };
  db.dispatch(setCreateDishSelection([{ ...dish, number: 2 }]));
  sessionStorage.setItem(TOKEN_ID, "token-de-prueba");
  const originalFetch = global.fetch;
  let failFirstRequest!: (reason: Error) => void;
  const fetchMock = jest
    .fn()
    .mockImplementationOnce(
      () =>
        new Promise((_resolve, reject) => {
          failFirstRequest = reject;
        }),
    )
    .mockResolvedValue({
      json: async () => ({ error: false, message: "uuid-confirmado" }),
    });
  global.fetch = fetchMock;

  try {
    const { result } = renderHook(useFinishOrder, {
      wrapper: ({ children }: PropsWithChildren) => (
        <Provider store={db}>{children}</Provider>
      ),
    });

    act(() => result.current.changeNotes(" Sin cebolla "));
    act(() => result.current.changeDish(1, { price: 30 }));
    await act(async () => {
      const first = result.current.handleSendOrder();
      await result.current.handleSendOrder();
      expect(fetchMock).toHaveBeenCalledTimes(1);
      failFirstRequest(new Error("respuesta perdida"));
      await first;
    });

    await act(async () => result.current.handleSendOrder());
    const sentKey = (index: number) =>
      fetchMock.mock.calls[index][1].headers["Idempotency-Key"];
    expect(sentKey(0)).toMatch(/^2026\/11\/23:/);
    expect(sentKey(1)).toBe(sentKey(0));
    expect(JSON.parse(fetchMock.mock.calls[1][1].body).notes).toBe(
      "Sin cebolla",
    );
    expect(
      JSON.parse(fetchMock.mock.calls[1][1].body).dishesDescription,
    ).toEqual([
      { ...dish, number: 1 },
      { ...dish, number: 1, price: 30 },
    ]);
    expect(db.getState().orderCreate.id).toBe("uuid-confirmado");

    act(() => {
      db.dispatch(resetCreateCommanda());
      db.dispatch(setCreateTableRDX(DEFAULT_TABLE_LLEVAR));
    });
    await act(async () => result.current.handleSendOrder());
    expect(sentKey(2)).not.toBe(sentKey(0));
  } finally {
    global.fetch = originalFetch;
    sessionStorage.removeItem(TOKEN_ID);
  }
});
