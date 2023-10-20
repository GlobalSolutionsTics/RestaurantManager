import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@firebase/config";

export const getAllOrders = async () => {
  try {
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
