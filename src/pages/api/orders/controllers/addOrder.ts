import { realtimeDB } from "@firebase/config";
import { child, get, getDatabase, ref, set } from "firebase/database";
import { RT_ORDER_TABLE_NAME } from "@models/names";

const addOrder = async (
  name: string,
  dishes: number,
  uuid: string,
  tableNumber: number,
  dishesDescription: Array<any>
) => {
  try {
    let preId = 0;
    const dbRef = ref(getDatabase());
    get(child(dbRef, RT_ORDER_TABLE_NAME))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const array = Object.keys(data).map((el) => el);
          preId = array.length;
          console.log(array, preId);
          set(ref(realtimeDB, RT_ORDER_TABLE_NAME + "/" + uuid), {
            name: name,
            dishes: dishes,
            dishesDescription: dishesDescription,
            orderId: preId + 1,
            uuid: uuid,
            tableNumber: tableNumber,
          });
        } else {
          set(ref(realtimeDB, RT_ORDER_TABLE_NAME + "/" + uuid), {
            name: name,
            dishes: dishes,
            dishesDescription: dishesDescription,
            orderId: preId + 1,
            uuid: uuid,
            tableNumber: tableNumber,
          });
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
    return true;
  } catch (e) {
    console.log("Error al insertar en DB:", e);
    return false;
  }
};

export default addOrder;
