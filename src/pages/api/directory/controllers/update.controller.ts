import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { firestore } from "@firebase/config";
import { DB_DIRECTORY } from "@models/names";
import {
  ERROR_NOT_CONNECTION,
  IClientResponse,
  USER_UPDATE_MESSAGE,
} from "./client";

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
        adress: payload.adress,
        phone: payload.phone,
        uuid: payload.uuid,
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
