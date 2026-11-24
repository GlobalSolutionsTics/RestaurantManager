import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@firebase/config";
import { getAuth, signInAnonymously } from "firebase/auth";

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
