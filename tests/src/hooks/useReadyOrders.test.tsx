import { StatusEnum } from "@/enums/states.enum";
import { useReadyOrders } from "@/hooks/Wainters/useReadyOrders";
import { act, renderHook, waitFor } from "@testing-library/react";
import { onValue, type DataSnapshot } from "firebase/database";

jest.mock("@firebase/config", () => ({ realtimeDB: {} }));
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  signInAnonymously: jest.fn().mockResolvedValue(undefined),
}));
jest.mock("firebase/database", () => ({
  onValue: jest.fn(),
  ref: jest.fn(),
}));

it("shows only ready orders for the signed-in waiter and clears the list after an empty snapshot", async () => {
  const unsubscribe = jest.fn();
  jest.mocked(onValue).mockReturnValue(unsubscribe);
  const { result, unmount } = renderHook(() => useReadyOrders("waiter-1"));

  await waitFor(() => expect(onValue).toHaveBeenCalledTimes(1));
  const receive = jest.mocked(onValue).mock.calls[0][1];
  act(() =>
    receive({
      val: () => ({
        pending: {
          uuid: "pending",
          waiter: "waiter-1",
          status: StatusEnum.SEND,
        },
        ready: {
          uuid: "ready",
          waiter: "waiter-1",
          status: StatusEnum.ORDER_READY,
        },
        other: {
          uuid: "other",
          waiter: "waiter-2",
          status: StatusEnum.ORDER_READY,
        },
      }),
    } as DataSnapshot),
  );
  expect(result.current.orders.map(({ uuid }) => uuid)).toEqual(["ready"]);

  act(() => receive({ val: () => null } as DataSnapshot));
  expect(result.current.orders).toEqual([]);
  expect(result.current.loading).toBe(false);

  unmount();
  expect(unsubscribe).toHaveBeenCalledTimes(1);
});
