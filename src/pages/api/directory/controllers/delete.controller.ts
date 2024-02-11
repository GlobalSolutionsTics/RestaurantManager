import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { firestore } from "@firebase/config";
import { DB_DIRECTORY } from "@models/names";
import {
  ERROR_DONT_DELETE_USER,
  ERROR_NOT_CONNECTION,
  IClientResponse,
  USER_DELETED_MESSAGE,
} from "./client";

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
