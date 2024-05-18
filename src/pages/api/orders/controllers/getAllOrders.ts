import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@firebase/config";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getActualDateDB } from "@/utils/formats";
import { RT_ORDER_TABLE_NAME } from "@models/names";
import { child, get, getDatabase, ref } from "firebase/database";
import { StatusEnum } from "@/enums/states.enum";
import { TResponseOrders } from "@/types/menu.types";
import { DEFAULT_TABLE_LLEVAR } from "@/utils/constants";

export const getAllOrders = async () => {
  try {
    const auth = getAuth();
    await signInAnonymously(auth);
    const docRef = doc(firestore, "orders", "LA");
    const getData = await getDoc(docRef);
    if (getData.exists()) {
      return getData.data();
    } else {
      console.log("No existe la base");
      return false;
    }
  } catch (e) {
    console.log("Error:", e);
  }
};

export const existTableNumber = async (tableNumber: number) => {
  if (tableNumber !== DEFAULT_TABLE_LLEVAR) {
    const auth = getAuth();
    await signInAnonymously(auth);
    const dbRef = ref(getDatabase());
    const date = getActualDateDB();
    const DB_RT =
      RT_ORDER_TABLE_NAME + "/" + date.year + "/" + date.month + "/" + date.day;
    const snapshot = await get(child(dbRef, DB_RT));
    if (snapshot.exists()) {
      const data: Array<TResponseOrders> = snapshot.val();
      const elements: Array<TResponseOrders> = Object.values(data).sort(
        (a: any, b: any) => a.orderId - b.orderId,
      );
      const filters = elements.filter(
        (itm) =>
          itm.status !== StatusEnum.CLOSED &&
          itm.status !== StatusEnum.CANCELED,
      );
      const mapTables = filters.map((itm) => itm.tableNumber);
      if (mapTables.includes(tableNumber)) {
        return true;
      } else {
        return false;
      }
    }
  } else {
    return false;
  }
};
