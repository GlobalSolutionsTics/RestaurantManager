import { HttpMethodsEnum } from "@/enums/http.enum";
import type { KitchenType } from "@/types/kitchen.types";
import { ADMIN } from "@/utils/users";
import { firestore } from "@firebase/config";
import { DB_KITCHENS } from "@models/names";
import {
  collection,
  doc,
  getDocs,
  runTransaction,
  setDoc,
} from "firebase/firestore";
import jwt from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4, validate as isUuid } from "uuid";
import { SEED_OF_JWT } from "../auth/controller/users";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { GET, POST, PUT, DELETE } = HttpMethodsEnum;
  const method = req.method;
  if (
    method !== GET &&
    method !== POST &&
    method !== PUT &&
    method !== DELETE
  ) {
    res.setHeader("Allow", [GET, POST, PUT, DELETE]);
    return res.status(405).json({ message: "Método no permitido." });
  }

  try {
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
    const session = jwt.verify(token ?? "", SEED_OF_JWT);
    if (typeof session === "string" || session.type !== ADMIN) {
      return res
        .status(403)
        .json({ message: "Se requiere acceso de administrador." });
    }
  } catch {
    return res.status(401).json({ message: "La sesión no es válida." });
  }

  const kitchens = collection(firestore, DB_KITCHENS, "catalog", "types");
  const { id, name: rawName } = req.body ?? {};
  const name = typeof rawName === "string" ? rawName.trim() : "";

  if (
    (method === PUT || method === DELETE) &&
    (typeof id !== "string" || !isUuid(id))
  ) {
    return res
      .status(400)
      .json({ message: "El ID de la cocina no es válido." });
  }
  if ((method === POST || method === PUT) && !name) {
    return res.status(400).json({ message: "Escribe el nombre de la cocina." });
  }

  try {
    switch (method) {
      case GET: {
        const snapshot = await getDocs(kitchens);
        const data = snapshot.docs.map((kitchen) => ({
          id: kitchen.id,
          name: kitchen.data().name as string,
        }));
        return res.status(200).json({ data });
      }
      case POST: {
        const kitchen: KitchenType = { id: uuidv4(), name };
        await setDoc(doc(kitchens, kitchen.id), kitchen);
        return res.status(201).json({ data: kitchen });
      }
      case PUT:
      case DELETE: {
        const reference = doc(kitchens, id);
        const kitchen: KitchenType = { id, name };
        const exists = await runTransaction(firestore, async (transaction) => {
          const snapshot = await transaction.get(reference);
          if (!snapshot.exists()) return false;

          if (method === PUT) {
            transaction.update(reference, { name });
          } else {
            transaction.delete(reference);
          }
          return true;
        });

        if (!exists) {
          return res.status(404).json({ message: "La cocina ya no existe." });
        }
        return res
          .status(200)
          .json({ data: method === PUT ? kitchen : { id } });
      }
    }
  } catch (error) {
    console.error("Error en el catálogo de cocinas:", error);
    return res
      .status(500)
      .json({ message: "No se pudo completar la operación de cocinas." });
  }
}
