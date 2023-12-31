import { RT_ORDER_TABLE_NAME } from "@models/names";
import { getAuth, signInAnonymously } from "firebase/auth";
import { child, get, getDatabase, ref } from "firebase/database";

export const getAllOrdersFS = async () => {
  try {
    const auth = getAuth();
    await signInAnonymously(auth);
    const dbRef = ref(getDatabase());
    const getData = await get(child(dbRef, RT_ORDER_TABLE_NAME));
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
