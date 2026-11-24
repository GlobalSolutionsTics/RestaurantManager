import { act, renderHook } from "@testing-library/react";
import { get, ref } from "firebase/database";
import { useOrderForEditing } from "@/hooks/Orders/useOrderForEditing";

jest.mock("@firebase/config", () => ({ realtimeDB: {} }));
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  signInAnonymously: jest.fn(),
}));
jest.mock("firebase/database", () => ({
  get: jest.fn(),
  ref: jest.fn(),
}));
jest.mock("@/utils/formats", () => ({
  getActualDateDB: () => ({ fullDate: "2026/11/23" }),
}));

type Snapshot = Awaited<ReturnType<typeof get>>;

it("ignores a late read from the previous order after navigation", async () => {
  let resolveFirst!: (snapshot: Snapshot) => void;
  jest
    .mocked(get)
    .mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveFirst = resolve;
        }),
    )
    .mockResolvedValueOnce({ val: () => ({ uuid: "second" }) } as Snapshot);

  const { result, rerender } = renderHook(({ id }) => useOrderForEditing(id), {
    initialProps: { id: "first" },
  });
  await act(async () => {});
  expect(ref).toHaveBeenLastCalledWith(
    expect.anything(),
    expect.stringMatching(/\/first$/),
  );

  await act(async () => {
    rerender({ id: "second" });
  });
  expect(ref).toHaveBeenLastCalledWith(
    expect.anything(),
    expect.stringMatching(/\/second$/),
  );
  expect(result.current?.uuid).toBe("second");

  await act(async () => {
    resolveFirst({ val: () => ({ uuid: "first" }) } as Snapshot);
  });
  expect(result.current?.uuid).toBe("second");
});
