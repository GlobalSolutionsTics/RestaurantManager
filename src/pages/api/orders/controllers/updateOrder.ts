import { StatusEnum } from "@/enums/states.enum";
import { TResponseOrders } from "@/types/menu.types";
import { realtimeDB } from "@firebase/config";
import { RT_ORDER_TABLE_NAME } from "@models/names";
import { getAuth, signInAnonymously } from "firebase/auth";
import { child, get, ref, update } from "firebase/database";

export const updateStatusOrder = async (
  status: StatusEnum,
  orderUUID: string,
) => {
  try {
    const auth = getAuth();
    await signInAnonymously(auth);
    const docRef = ref(realtimeDB, RT_ORDER_TABLE_NAME);
    const getOrders = await get(child(docRef, orderUUID));
    if (getOrders.exists()) {
      const data: Array<TResponseOrders> = getOrders.val();
      const newData = { ...data, status };
      await update(child(docRef, orderUUID), newData);
      return { error: false, message: "Datos actualizados correctamente" };
    }

    return { error: true, message: "Error al actualizar el estatus" };
  } catch (e) {
    console.log("Error:", e);
    return { error: true, message: "Error en los servicios de google" };
  }
};
