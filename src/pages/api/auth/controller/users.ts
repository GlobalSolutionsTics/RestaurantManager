import { doc, getDoc, updateDoc } from "firebase/firestore";
import jwt from "jsonwebtoken";
import { firestore } from "@firebase/config";
import { DB_USERS } from "@models/names";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/router";
export interface IUsersResponse {
  user: string;
  password: string;
  name: string;
  type: string;
  uuid: string;
}

export const ERROR_NOT_CONNECTION = "Erro no se pudo encontrar la colección";
const USER_DELETED_MESSAGE = "Usuario eliminado exitosamente";
const ERROR_DONT_DELETE_USER = "No se puede eliminar a este usuario";
const USER_UPDATE_MESSAGE = "Usuario actualizado exitosamente";

export const SEED_OF_JWT = "AñOS_LUZ";

// const checkTokenExpiration = (token: string): boolean => {
//   const { push } = useRouter();
//   const decodedToken: any = jwt.verify(token, SEED_OF_JWT);
//   const currentTime = Date.now() / 1000;

//   try {
//     if (decodedToken.exp && decodedToken.exp < currentTime) {
//       push("/admin");
//       return true;
//     }

//     return false;
//   } catch (error) {
//     return false;
//   }
// };

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
        uuid: find.uuid,
      };

      const token = jwt.sign(payload, SEED_OF_JWT, { expiresIn: "3m" });

      // if (checkTokenExpiration(token)) {
      //   return false;
      // }

      return { token: token, type: find.type };
    } else {
      return false;
    }
  } else {
    return false;
  }
};

export const searchUserByUser = async (user: string) => {
  const usersRef = doc(firestore, DB_USERS, "activos");
  const usersCollections = await getDoc(usersRef);
  if (usersCollections.exists()) {
    const usersData = usersCollections.data();
    const users = usersData.data as Array<IUsersResponse>;
    const find = users.find((itm) => itm.user === user);
    if (find) {
      return true;
    }
    return false;
  }
};

export const createUser = async (
  name: string,
  user: string,
  password: string,
  type: string,
) => {
  const existUser = await searchUserByUser(user);
  if (existUser) {
    return { error: true, message: "Usuario existente" };
  }
  const usersRef = doc(firestore, DB_USERS, "activos");
  const usersCollections = await getDoc(usersRef);
  if (usersCollections.exists()) {
    const uuid = uuidv4();
    const usersData = usersCollections.data();
    const usersItems: Array<IUsersResponse> = usersData.data;
    const userPayload: IUsersResponse = {
      name,
      user,
      password,
      type,
      uuid,
    };
    usersItems.push(userPayload);
    const payload = {
      data: usersItems,
    };
    await updateDoc(usersRef, payload);
    return { error: false, message: " Usuario creado" };
  }
  return { error: true, message: "No se pudo crear el usuario" };
};

export const listUsers = async () => {
  const usersRef = doc(firestore, DB_USERS, "activos");
  const usersCollections = await getDoc(usersRef);
  if (usersCollections.exists()) {
    const usersData = usersCollections.data();
    const usersItems: Array<IUsersResponse> = usersData.data;
    return { data: usersItems };
  }
  return { data: [] };
};

export const deleteUser = async (uuid: string) => {
  const usersRef = doc(firestore, DB_USERS, "activos");
  const usersCollections = await getDoc(usersRef);
  if (usersCollections.exists()) {
    const usersData = usersCollections.data();
    const users = usersData.data as Array<IUsersResponse>;
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

export const updateUser = async (payload: IUsersResponse) => {
  const usersRef = doc(firestore, DB_USERS, "activos");
  const usersCollections = await getDoc(usersRef);
  if (usersCollections.exists()) {
    const usersData = usersCollections.data();
    const users = usersData.data as Array<IUsersResponse>;
    const find = users.findIndex((itm) => itm.uuid === payload.uuid);
    if (find !== -1) {
      const userObject: IUsersResponse[] = users.splice(find, 1);
      const userData = userObject[0];
      const newUserData = {
        ...userData,
        name: payload.name,
        password: payload.password,
        type: payload.type,
        user: payload.user,
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
