import { listUserSerive } from "@/services/users";
import type { RootRedux } from "@/store/store";
import { TOKEN_ID } from "@/utils/strings";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export function useWaiterName(waiterId?: string) {
  const { uuid, name } = useSelector((store: RootRedux) => store.user);
  const [result, setResult] = useState<{ id: string; name: string }>();
  const isCurrentWaiter = !!waiterId && waiterId === uuid;

  useEffect(() => {
    if (!waiterId || isCurrentWaiter) return;
    const token = sessionStorage.getItem(TOKEN_ID);
    if (!token) return;

    let active = true;
    void listUserSerive(token).then((waiters) => {
      if (!active) return;
      const waiter = Array.isArray(waiters)
        ? waiters.find(({ uuid }) => uuid === waiterId)
        : undefined;
      setResult({ id: waiterId, name: waiter?.name ?? "" });
    });
    return () => {
      active = false;
    };
  }, [waiterId, isCurrentWaiter]);

  if (isCurrentWaiter) return name;
  return result?.id === waiterId ? result?.name ?? "" : "";
}
