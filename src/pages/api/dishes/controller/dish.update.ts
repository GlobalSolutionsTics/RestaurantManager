import { firestore } from "@firebase/config";
import { DB_DISHES } from "@models/names";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ERROR_NOT_CONNECTION } from "../../auth/controller/users";

const DISHES_IS_UPDATED = "Los platillos se actualizaron correctamente";

export const updateDish = async (category: string, dishes: Array<any>) => {
  const dishesRef = doc(firestore, DB_DISHES, category);
  const dishesCollection = await getDoc(dishesRef);
  if (dishesCollection.exists()) {
    const payloadData = { data: dishes };
    await updateDoc(dishesRef, payloadData);
    return { error: false, message: DISHES_IS_UPDATED };
  } else {
    return { error: true, message: ERROR_NOT_CONNECTION };
  }
};
