import { TConifg } from "@/types/configuration.types";
import { firestore } from "@firebase/config";
import { DB_CONFIGURATION } from "@models/names";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const COLLECTION = "configuration";

export const listConfiguration = async () => {
  const configRef = doc(firestore, DB_CONFIGURATION, COLLECTION);
  const collections = await getDoc(configRef);
  if (collections.exists()) {
    const configData = collections.data();
    return { error: false, message: "", data: configData };
  } else {
    return {
      error: true,
      message: "Error al obtener la configuración",
      data: [],
    };
  }
};

export const updateConfiguration = async (payload: TConifg) => {
  const configRef = doc(firestore, DB_CONFIGURATION, COLLECTION);
  const collections = await getDoc(configRef);
  if (collections.exists()) {
    await updateDoc(configRef, payload);
    return { error: false, message: "Información actualizada correctamente" };
  } else {
    return { error: true, message: "Error al actualizar la información" };
  }
};
