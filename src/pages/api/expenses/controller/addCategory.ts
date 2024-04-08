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
