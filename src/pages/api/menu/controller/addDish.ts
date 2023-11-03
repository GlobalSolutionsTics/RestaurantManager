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
    const uuid = uuidv4();
    if (menuCollection.exists()) {
      const menuData = menuCollection.data();
      const menuItems: Array<TMenuResponse> = menuData.data;
      const menuPayload: TMenuResponse = {
        isUniquePrice: dishPayload.isUniquePrice,
        name: dishPayload.name,
        price: dishPayload.price,
        type: dishPayload.type,
        uuid,
      };
      menuItems.push(menuPayload);
      const payload = {
        data: menuItems,
      };
      await updateDoc(menuRef, payload);
      return true;
    } else {
      const menuPayload: TMenuResponse = {
        isUniquePrice: dishPayload.isUniquePrice,
        name: dishPayload.name,
        price: dishPayload.price,
        type: dishPayload.type,
        uuid,
      };
      const payload = {
        data: [menuPayload],
      };
      await setDoc(menuRef, payload);
      return true;
    }
  } catch (err: any) {
    console.error("Error al añadir platillo:", err);
    return false;
  }
};
