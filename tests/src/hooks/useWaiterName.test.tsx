import { useWaiterName } from "@/components/waiter/useWaiterName";
import { listUserSerive } from "@/services/users";
import { TOKEN_ID } from "@/utils/strings";
import { configureStore } from "@reduxjs/toolkit";
import { act, renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { Provider } from "react-redux";

jest.mock("@/services/users", () => ({ listUserSerive: jest.fn() }));

const store = configureStore({
  reducer: { user: () => ({ uuid: "signed-in", name: "Ana", type: "mesero" }) },
});
const wrapper = ({ children }: PropsWithChildren) => (
  <Provider store={store}>{children}</Provider>
);

afterEach(() => {
  jest.clearAllMocks();
  sessionStorage.removeItem(TOKEN_ID);
});

it("uses the signed-in waiter's name without requesting the directory", () => {
  sessionStorage.setItem(TOKEN_ID, "test-token");
  const { result } = renderHook(() => useWaiterName("signed-in"), { wrapper });
  expect(result.current).toBe("Ana");
  expect(listUserSerive).not.toHaveBeenCalled();
});

it("leaves the name empty when the directory request fails", async () => {
  sessionStorage.setItem(TOKEN_ID, "test-token");
  jest.mocked(listUserSerive).mockResolvedValue(false);
  const { result } = renderHook(() => useWaiterName("another-waiter"), {
    wrapper,
  });
  await act(async () => {});
  expect(listUserSerive).toHaveBeenCalledWith("test-token");
  expect(result.current).toBe("");
});
