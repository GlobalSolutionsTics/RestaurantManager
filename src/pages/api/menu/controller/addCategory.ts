import { firestore } from "@firebase/config";
import { DishesEnum } from "./enum/dishes.enum";
import { DB_DISHES } from "@models/names";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { TCatalog } from "@/types/catalog.types";

export const addCategory = async (
  collection: DishesEnum,
  category: TCatalog,
) => {
  try {
    const menuRef = doc(firestore, DB_DISHES, collection);
    const menuCollection = await getDoc(menuRef);
    if (menuCollection.exists()) {
      const menuData = menuCollection.data();
      const menuItems: Array<TCatalog> = menuData.data;
      const menuPayload: TCatalog = {
        id: category.id,
        value: category.value,
      };
      menuItems.push(menuPayload);
      const payload = {
        data: menuItems,
      };
      await updateDoc(menuRef, payload);
      return true;
    } else {
      const menuPayload: TCatalog = {
        id: category.id,
        value: category.value,
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
