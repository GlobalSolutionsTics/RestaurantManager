import { firestore } from "@firebase/config";
import { getAuth, signInAnonymously } from "firebase/auth";
import { child, getDatabase, ref } from "firebase/database";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export const insertInDB = async (
  dbName: string,
  collection: any,
  payload: any,
) => {
  try {
    const dbRef = doc(firestore, dbName, collection);
    const dbCollection = await getDoc(dbRef);
    const uuid = uuidv4();
    if (dbCollection.exists()) {
      const dbData = dbCollection.data();
      const dbItems: Array<any> = dbData.data;
      dbItems.push({
        ...payload,
        uuid: uuid,
        createAt: new Date(),
        updateAt: new Date(),
      });
      const obj = {
        data: dbItems,
      };
      await updateDoc(dbRef, obj);
      return true;
    } else {
      const obj = {
        data: [
          {
            ...payload,
            uuid: uuid,
            createAt: new Date(),
            updateAt: new Date(),
          },
        ],
      };
      await setDoc(dbRef, obj);
      return true;
    }
  } catch (e) {
    console.log("Error al insertar en firestore:", e);
    return false;
  }
};
