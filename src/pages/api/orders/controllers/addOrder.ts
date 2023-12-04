import { realtimeDB } from "@firebase/config";
import { child, get, getDatabase, ref, set } from "firebase/database";
import { RT_ORDER_TABLE_NAME } from "@models/names";
import { getAuth, signInAnonymously } from "firebase/auth";
import { StatusEnum } from "@/enums/states.enum";

const addOrder = async (
  name: string,
  dishes: number,
  uuid: string,
  tableNumber: number,
  dishesDescription: Array<any>,
  waiter: string,
) => {
  try {
    let preId = 0;
    let isError = false;
    const auth = getAuth();
    await signInAnonymously(auth);
    const dbRef = ref(getDatabase());
    const snapshot = await get(child(dbRef, RT_ORDER_TABLE_NAME));
    if (snapshot.exists()) {
      const data = snapshot.val();
      const array = Object.keys(data).map((el) => el);
      preId = array.length;
      set(ref(realtimeDB, RT_ORDER_TABLE_NAME + "/" + uuid), {
        name: name,
        dishes: dishes,
        dishesDescription: dishesDescription,
        orderId: preId + 1,
        uuid: uuid,
        tableNumber: tableNumber,
        status: StatusEnum.SEND,
        waiter,
        creatAt: new Date().toString(),
        updateAt: new Date().toString(),
      });
    } else {
      set(ref(realtimeDB, RT_ORDER_TABLE_NAME + "/" + uuid), {
        name: name,
        dishes: dishes,
        dishesDescription: dishesDescription,
        orderId: preId + 1,
        uuid: uuid,
        tableNumber: tableNumber,
        status: StatusEnum.SEND,
        waiter,
        creatAt: new Date().toString(),
        updateAt: new Date().toString(),
      });
    }

    if (isError) {
      return false;
    }
    return true;
  } catch (e) {
    console.log("Error al insertar en DB:", e);
    return false;
  }
};

export default addOrder;
