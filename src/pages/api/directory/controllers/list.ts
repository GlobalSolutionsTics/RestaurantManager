import { firestore } from "@firebase/config";
import { DB_DIRECTORY } from "@models/names";
import { doc, getDoc } from "firebase/firestore";

const COLLECTION = "activos";

const getAllList = async () => {
  const listRef = doc(firestore, DB_DIRECTORY, COLLECTION);
  const collections = await getDoc(listRef);
  if (collections.exists()) {
    const data = collections.data();
    return { error: false, message: "", data: data };
  } else {
    return { error: true, message: "Error al conectar con la bd", data: [] };
  }
};

export default getAllList;
