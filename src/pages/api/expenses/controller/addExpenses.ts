import { EDbNames } from "@/enums/db.enum";
import { TExpenses } from "@/types/expenses.types";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import FirestoreController from "../../controllers/firestore.controller";
import { HttpStatusEnum } from "@/enums/http.enum";

export const addExpenses = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  try {
    const body: TExpenses & { type: string } = req.body;
    const uuid = uuidv4();
    const BD = EDbNames.DB_EXPENSES;
    const COLLECTION = "expenses";

    const fsController = new FirestoreController(BD, COLLECTION);
    const payload: TExpenses = {
      ...body,
      uuid: uuid,
    };
    const created = await fsController.create(payload);

    if (created) {
      res.status(HttpStatusEnum.CREATE).send({
        error: false,
        message: { id: uuid },
      });
    } else {
      res.status(HttpStatusEnum.SERVER_ERROR).send({
        error: true,
        message: "Error al crear el gasto",
      });
    }
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.status(HttpStatusEnum.SERVER_ERROR).send({
      error: true,
      message: "Error en el servidor",
    });
  }
};
