import { TDirectory } from "@/types/directory.types";
import { firestore } from "@firebase/config";
import { DB_DIRECTORY } from "@models/names";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

const COLLECTION = "activos";
export const createDirectory = async (
  uuidDirectory: string,
  nombre: string,
  telefono: int,
  adress: string,
) => {
  try {
    const listRef = doc(firestore, DB_DIRECTORY, COLLECTION);
    const collection = await getDoc(listRef);
    if (collection.exist()) {
      const data = collection.data();

      return { error: false, message: "", data: data };
    } else {
      const payload: TDirectory = {
        nombre: nombre,
        telefono: telefono,
        adress,
      };
      await setDoc(listRef, payload);

      return {
        error: false,
        message: "Se creó correctamente el directorio",
        data: [],
      };
    }
  } catch (e: any) {}
  return {
    error: true,
    message: "Error al crear la vinculacion en firebase",
    data: [],
  };
};
