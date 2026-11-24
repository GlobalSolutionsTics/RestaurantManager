import { TResponseOrders } from "@/types/menu.types";
import { getActualDateDB } from "@/utils/formats";
import { realtimeDB } from "@firebase/config";
import { RT_ORDER_TABLE_NAME } from "@models/names";
import { getAuth, signInAnonymously } from "firebase/auth";
import { onValue, ref } from "firebase/database";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { listClientService } from "@/services/client";
import { TOKEN_ID } from "@/utils/strings";
import { IClientResponse } from "@/pages/api/directory/controllers/client";

export const useOrderPrint = () => {
  const [total, setTotal] = useState(0);
  const [information, setInformation] = useState<
    TResponseOrders & { creatAt: string }
  >();
  const [clientList, setClientList] = useState<Array<IClientResponse>>([]);

  const { query } = useRouter();
  const initializer = useCallback(async () => {
    try {
      const id = query.id as string;
      if (id !== undefined) {
        const token = sessionStorage.getItem(TOKEN_ID) || "";
        const clients = await listClientService(token);
        setClientList(clients);
        const auth = getAuth();
        await signInAnonymously(auth);
        const date = getActualDateDB();
        const RT_DB = `${RT_ORDER_TABLE_NAME}/${date.year}/${date.month}/${date.day}`;
        const connection = ref(realtimeDB, RT_DB);
        return onValue(connection, (snapshot) => {
          if (snapshot.exists()) {
            console.log("Entrando al snap");
            const data = snapshot.val();
            const select: TResponseOrders & { creatAt: string } = data[id];
            const totaly = select?.dishesDescription.reduce(
              (prev, next) => prev + next.number * next.price,
              0,
            );
            setTotal(totaly);
            setInformation(select);
          }
        });
      }
    } catch (e) {
      console.error("Error al cargar la información:", e);
    }
  }, [query, total]);

  useEffect(() => {
    initializer();
  }, [query, total]);

  return {
    total,
    information,
    clientList,
    initializer,
  };
};
