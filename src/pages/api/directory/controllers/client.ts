import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { firestore } from "@firebase/config";
import { DB_DIRECTORY } from "@models/names";
import { v4 as uuidv4 } from "uuid";
import { TDirectory } from "@/types/directory.types";

export interface IClientResponse {
  name: string;
  adress: string;
  phone: number;
  uuid: string;
}

export const ERROR_NOT_CONNECTION = "Erro no se pudo encontrar la colección";
const USER_DELETED_MESSAGE = "Usuario eliminado exitosamente";
const ERROR_DONT_DELETE_USER = "No se puede eliminar a este usuario";
const USER_UPDATE_MESSAGE = "Usuario actualizado exitosamente";

export const SEED_OF_JWT = "AñOS_LUZ";

const COLLECTION = "activos";

export const searchClientByClient = async (name: string) => {
  const usersRef = doc(firestore, DB_DIRECTORY, "activos");
  const usersCollections = await getDoc(usersRef);
  if (usersCollections.exists()) {
    const usersData = usersCollections.data();
    const users = usersData.data as Array<IClientResponse>;
    const find = users.find((itm) => itm.name === name);
    if (find) {
      return true;
    }
    return false;
  }
};

export const createClient = async (
  name: string,
  adress: string,
  phone: number,
  uuidDirectory: string,
) => {
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

export const listClient = async () => {
  const usersRef = doc(firestore, DB_DIRECTORY, "activos");
  const usersCollections = await getDoc(usersRef);
  if (usersCollections.exists()) {
    const usersData = usersCollections.data();
    const usersItems: Array<IClientResponse> = usersData.data;
    return { error: false, message: "", data: usersItems };
  }
  return { error: true, message: "Error al conectar con la bd", data: [] };
};

export const deleteClient = async (uuid: string) => {
  const usersRef = doc(firestore, DB_DIRECTORY, "activos");
  const usersCollections = await getDoc(usersRef);
  if (usersCollections.exists()) {
    const usersData = usersCollections.data();
    const users = usersData.data as Array<IClientResponse>;
    const find = users.findIndex((itm) => itm.uuid === uuid);
    if (find !== -1) {
      users.splice(find, 1);
      const payload = {
        data: users,
      };
      await updateDoc(usersRef, payload);
      return { error: false, message: USER_DELETED_MESSAGE };
    } else {
      return { error: true, message: ERROR_DONT_DELETE_USER };
    }
  } else {
    return { error: true, message: ERROR_NOT_CONNECTION };
  }
};

export const updateClient = async (payload: IClientResponse) => {
  const usersRef = doc(firestore, DB_DIRECTORY, "activos");
  const usersCollections = await getDoc(usersRef);
  if (usersCollections.exists()) {
    const usersData = usersCollections.data();
    const users = usersData.data as Array<IClientResponse>;
    const find = users.findIndex((itm) => itm.uuid === payload.uuid);
    if (find !== -1) {
      const userObject: IClientResponse[] = users.splice(find, 1);
      const userData = userObject[0];
      const newUserData = {
        ...userData,
        name: payload.name,
        password: payload.phone,
        type: payload.adress,
      };
      users.push(newUserData);
      const payloadData = { data: users };

      await updateDoc(usersRef, payloadData);
      return { error: false, message: USER_UPDATE_MESSAGE };
    }
    return { error: true, message: ERROR_NOT_CONNECTION };
  } else {
    return { error: true, message: ERROR_NOT_CONNECTION };
  }
};
