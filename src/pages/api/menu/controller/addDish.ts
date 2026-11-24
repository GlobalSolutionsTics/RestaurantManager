import { firestore } from "@firebase/config";
import { DishesEnum } from "./enum/dishes.enum";
import { DB_DISHES } from "@models/names";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { TMenuResponse } from "@/types/menu.types";
import { v4 as uuidv4 } from "uuid";

export const addDish = async (
  collection: DishesEnum,
  dishPayload: TMenuResponse,
) => {
  try {
    const menuRef = doc(firestore, DB_DISHES, collection);
    const menuCollection = await getDoc(menuRef);
    const menuPayload: TMenuResponse = {
      isUniquePrice: dishPayload.isUniquePrice,
      name: dishPayload.name,
      price: dishPayload.price,
      type: dishPayload.type,
      uuid: uuidv4(),
    };
    if (dishPayload.kitchenType) {
      menuPayload.kitchenType = dishPayload.kitchenType;
    }
    if (menuCollection.exists()) {
      const menuItems: TMenuResponse[] = menuCollection.data().data;
      await updateDoc(menuRef, { data: [...menuItems, menuPayload] });
    } else {
      await setDoc(menuRef, { data: [menuPayload] });
    }
    return true;
  } catch (err: any) {
    console.error("Error al añadir platillo:", err);
    return false;
  }
};
