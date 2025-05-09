import { useEffect, useState } from "react";
import { listUserSerive } from "@/services/users";
import { TOKEN_ID } from "@/utils/strings";

type Props = {
  waiterId: any;
};

const WaiterName = ({ waiterId }: Props) => {
  const [waiterName, setWaiterName] = useState("");

  useEffect(() => {
    const fetchWaiterName = async () => {
      const token = sessionStorage.getItem(TOKEN_ID);
      if (waiterId && token) {
        const waiters = await listUserSerive(token);
        const findWaiter = waiters.find((itm: any) => itm.uuid === waiterId);
        if (findWaiter) {
          setWaiterName(findWaiter.name);
        }
      }
    };
    fetchWaiterName();
  }, [waiterId]);

  return <span>{waiterName}</span>;
};

export default WaiterName;
