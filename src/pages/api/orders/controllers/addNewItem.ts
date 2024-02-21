import { OrdersDishesStatus } from "@/enums/orders.enum";
import { StatusEnum } from "@/enums/states.enum";
import { TResponseOrders } from "@/types/menu.types";
import { getActualDateDB } from "@/utils/formats";
import { realtimeDB } from "@firebase/config";
import { RT_ORDER_TABLE_NAME } from "@models/names";
import { getAuth, signInAnonymously } from "firebase/auth";
import { child, get, getDatabase, ref, set } from "firebase/database";

export const addNewItem = async (
  orderId: string,
  modifications: TResponseOrders,
) => {
  const auth = getAuth();
  await signInAnonymously(auth);
  const dbRef = ref(getDatabase());
  const date = getActualDateDB();
  const DB_RT =
    RT_ORDER_TABLE_NAME + "/" + date.year + "/" + date.month + "/" + date.day;
  const snapshot = await get(child(dbRef, DB_RT + "/" + orderId));
  if (snapshot.exists()) {
    const data: TResponseOrders = snapshot.val();
    const newDishes = modifications.dishesDescription.map((itm) => ({
      ...itm,
      status: OrdersDishesStatus.ACTIVE,
    }));
    const newDishesDescription = data.dishesDescription.concat(newDishes);
    set(ref(realtimeDB, DB_RT + "/" + orderId), {
      ...data,
      dishesDescription: newDishesDescription,
      status: StatusEnum.EDITED,
      updateAt: new Date().toString(),
    });
  }
};
