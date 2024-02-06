import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { firestore } from "@firebase/config";
import { DB_DIRECTORY } from "@models/names";
import { v4 as uuidv4 } from "uuid";
import { TDirectory } from "@/types/directory.types";
import { IClientResponse } from "./client";

const COLLECTION = "activos";
const createClient = async (
  name: string,
  adress: string,
  phone: number,
  uuidDirectory: string,
) => {
  console.log("funciona");
  try {
    const usersRef = doc(firestore, DB_DIRECTORY, COLLECTION);
    const usersCollections = await getDoc(usersRef);
    if (usersCollections.exists()) {
      const uuid = uuidv4();
      const usersData = usersCollections.data();
      const usersItems: Array<IClientResponse> = usersData.data;
      const userPayload: IClientResponse = {
        name,
        adress,
        phone,
        uuid,
      };
      usersItems.push(userPayload);
      const payload = {
        data: usersItems,
      };
      await updateDoc(usersRef, payload);
      return { error: false, message: " Usuario creado" };
    } else {
      const userPayload: TDirectory = {
        name: name,
        phone: phone,
        adress: adress,
        uuidDirectory: uuidDirectory,
      };
      const payload = {
        data: [userPayload],
      };
      await setDoc(usersRef, payload);
      return {
        error: false,
        message: "Se creo correctamente el directorio",
        data: [],
      };
    }
  } catch (e: any) {
    return {
      error: true,
      message: "Error al creae la vinculacion en firebase",
      data: [],
    };
  }
};

export default createClient;
