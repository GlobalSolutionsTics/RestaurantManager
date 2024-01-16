/*import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { HttpMethodsEnum } from "@/enums/http.enum";
import { createClient, SEED_OF_JWT } from "./controllers/client";

interface ClientRequestBody {
  name: string;
  phone: string;
  adress: string;
  uuid: string;
}

interface CreateDirectoryResult {
  error: boolean;
  message: string;
}

export const createDirectory = async (
  req: NextApiRequest,
  res: NextApiResponse<CreateDirectoryResult>,
): Promise<void> => {
  try {
    const method = req.method;

    if (method === HttpMethodsEnum.POST) {
      const header = req.headers;
      const authorization =
        header["authorization"] || header["www-authenticate"];
      const token = authorization?.replace(/^Bearer\s+/, "");

      if (token) {
        jwt.verify(token, SEED_OF_JWT, async (error) => {
          if (error) {
            return res.status(403).send({
              error: true,
              message: "Error token inválido",
            });
          } else {
            try {
              const body: ClientRequestBody = req.body;

              const { error, message } = await createClient(
                body.name,
                body.phone,
                body.adress,
                body.uuid,
              );

              return res.status(201).send({
                error,
                message,
              });
            } catch (e: any) {
              console.error("Error al procesar la solicitud:", e);
              return res.status(500).send({
                error: true,
                message: "Error interno del servidor",
              });
            }
          }
        });
      } else {
        return res.status(403).send({
          error: true,
          message: "No tienes autorización para esto",
        });
      }
    } else {
      return res.status(404).send({
        error: true,
        message: "Not found",
      });
    }
  } catch (error) {
    return res.status(500).send({
      error: true,
      message: "Ocurrió un error al crear el directorio",
    });
  }
};
*/
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { firestore } from "@firebase/config";
import { DB_DIRECTORY } from "@models/names";
import { v4 as uuidv4 } from "uuid";
import { TDirectory } from "@/types/directory.types";
import { IClientResponse } from "./controllers/client";

const COLLECTION = "activos";
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
