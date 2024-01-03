import { StatusEnum } from "@/enums/states.enum";
import { TResponseOrders } from "@/types/menu.types";
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
  const snapshot = await get(child(dbRef, RT_ORDER_TABLE_NAME + "/" + orderId));
  if (snapshot.exists()) {
    const data: TResponseOrders = snapshot.val();
    const newDishes = modifications.dishesDescription.map((itm) => ({
      ...itm,
      status: "ACTIVO",
    }));
    const newDishesDescription = data.dishesDescription.concat(newDishes);
    set(ref(realtimeDB, RT_ORDER_TABLE_NAME + "/" + orderId), {
      ...data,
      dishesDescription: newDishesDescription,
      status: StatusEnum.SEND,
      updateAt: new Date().toString(),
    });
  }
};
