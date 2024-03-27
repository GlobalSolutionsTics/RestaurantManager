/*import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { ExpensesEnum } from "./enum/expenses.enum";
import { TCatalog } from "@/types/catalog.types";
import { firestore } from "@firebase/config";
import { DB_EXPENSES } from "@models/names";

export const addCategory = async (
  collection: ExpensesEnum,
  category: TCatalog,
) => {
  try {
    const expensRef = doc(firestore, DB_EXPENSES, collection);
    const expensCollection = await getDoc(expensRef);
    if (expensCollection.exists()) {
      const expensData = expensCollection.data();
      const expensItems: Array<TCatalog> = expensData.data;
      const expensPayload: TCatalog = {
        id: category.id,
        value: category.value,
      };
      expensItems.push(expensPayload);
      const payload = {
        data: expensItems,
      };
      await updateDoc(expensRef, payload);
      return true;
    } else {
      const expensPayload: TCatalog = {
        id: category.id,
        value: category.value,
      };
      const payload = {
        data: [expensPayload],
      };
      await setDoc(expensRef, payload);
      return true;
    }
  } catch (e) {
    console.log("Error al añadir gasto", e);
    return false;
  }
};
*/

import { TCatalog } from "@/types/catalog.types";
import { v4 as uuidv4 } from "uuid";
import { NextApiRequest, NextApiResponse } from "next";
import { EDbNames } from "@/enums/db.enum";
import FirestoreController from "../../controllers/firestore.controller";
import { HttpStatusEnum } from "@/enums/http.enum";

export const addCategory = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const body: TCatalog & { type: string } = req.body;
  const uuid = uuidv4();
  const BD = EDbNames.DB_EXPENSES_CATEGORY;
  const COLLECTION = "categories";
  if (body.type === "category") {
    const fsController = new FirestoreController(BD, COLLECTION);
    const payload: TCatalog = {
      ...body,
      id: body.id,
      value: body.value,
    };
    const created = await fsController.create(payload);
    if (created) {
      res.status(HttpStatusEnum.CREATE).send({
        error: false,
        message: { id: uuid },
      });
    } else {
      res
        .status(HttpStatusEnum.SERVER_ERROR)
        .send({ error: true, message: "Error al crear el gasto" });
    }
  }
};
