import { TKitchen } from "@/types/kitchen.types";
import { firestore } from "@firebase/config";
import { DB_KITCHENS } from "@models/names";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

const COLLECTION = "activos";
export const createKitchen = async (
  uuidUser: string,
  kitchenAsigned: string,
  description: string,
) => {
  try {
    const listRef = doc(firestore, DB_KITCHENS, COLLECTION);
    const collections = await getDoc(listRef);
    if (collections.exists()) {
      const data = collections.data();

      return { error: false, message: "", data: data };
    } else {
      const payload: TKitchen = {
        description: description,
        uuidUser: uuidUser,
        kitchenId: kitchenAsigned,
      };
      await setDoc(listRef, payload);

      return {
        error: false,
        message: "Se creo correctamente la cocina",
        data: [],
      };
    }
  } catch (e: any) {}
  return {
    error: true,
    message: "Error al crear la vinculación en firebase",
    data: [],
  };
};
