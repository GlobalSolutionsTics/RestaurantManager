import { doc, getDoc } from "firebase/firestore";
import jwt from "jsonwebtoken";
import { firestore } from "@firebase/config";
import { DB_USERS } from "@models/names";
interface IUsersResponse {
  user: string;
  password: string;
  name: string;
  type: string;
  uuid: string;
}

const SEED_OF_JWT = "AñOS_LUZ";

export const loginUsers = async (user: string, pass: string) => {
  const usersRef = doc(firestore, DB_USERS, "activos");
  const usersCollections = await getDoc(usersRef);
  if (usersCollections.exists()) {
    const usersData = usersCollections.data();
    const users = usersData.data as Array<IUsersResponse>;
    const find = users.find(
      (itm) => itm.user === user && itm.password === pass,
    );

    if (find) {
      const payload = {
        name: find.name,
        type: find.type,
      };
      const token = jwt.sign(payload, SEED_OF_JWT, { expiresIn: "48h" });
      return { token: token, type: find.type };
    } else {
      return false;
    }
  } else {
    return false;
  }
};
