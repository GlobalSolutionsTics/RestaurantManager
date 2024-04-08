import { EDbNames } from "@/enums/db.enum";
import { NextApiRequest, NextApiResponse } from "next";
import FirestoreController from "../../controllers/firestore.controller";
import { HttpStatusEnum } from "@/enums/http.enum";

export const getAllInventaryProduct = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const BD = EDbNames.DB_INVENTORY;
  const COLLECTION = "products";
  const fsController = new FirestoreController(BD, COLLECTION);
  const data = await fsController.list();
  if (data) {
    res.status(HttpStatusEnum.OK).send({ error: false, data: data });
  } else {
    res.status(HttpStatusEnum.SERVER_ERROR).send({
      error: true,
      message: "Error al listar los productos",
    });
  }
};
