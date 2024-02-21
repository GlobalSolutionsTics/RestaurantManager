import { getActualDateDB } from "@/utils/formats";
import { RT_ORDER_TABLE_NAME } from "@models/names";
import { getAuth, signInAnonymously } from "firebase/auth";
import { child, get, getDatabase, ref } from "firebase/database";

export const getAllOrdersFS = async () => {
  try {
    const auth = getAuth();
    await signInAnonymously(auth);
    const dbRef = ref(getDatabase());
    const date = getActualDateDB();
    const DB_RT =
      RT_ORDER_TABLE_NAME + "/" + date.year + "/" + date.month + "/" + date.day;
    const getData = await get(child(dbRef, DB_RT));
    if (getData.exists()) {
      return getData.val();
    } else {
      console.log("No existe la base");
      return false;
    }
  } catch (e) {
    console.log("Error:", e);
  }
};
