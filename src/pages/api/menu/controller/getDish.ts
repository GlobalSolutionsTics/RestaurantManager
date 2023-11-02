import { TResponseCollection } from "@/types/menu.types";
import { firestore } from "@firebase/config";
import { DB_DISHES } from "@models/names";
import { doc, getDoc } from "firebase/firestore";
import { DishesEnum } from "./enum/dishes.enum";

export const getDish = async (collection: DishesEnum) => {
  const menuRef = doc(firestore, DB_DISHES, collection);
  const menuCollection = await getDoc(menuRef);
  if (menuCollection.exists()) {
    const collection = menuCollection.data() as TResponseCollection;
    const menu = collection.data;
    return menu;
  } else {
    return false;
  }
};
