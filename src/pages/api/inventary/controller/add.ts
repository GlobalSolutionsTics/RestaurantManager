import { NextApiRequest, NextApiResponse } from "next";
import FirestoreController from "../../controllers/firestore.controller";
import { EDbNames } from "@/enums/db.enum";
import { TInventoryProduct } from "../../types/product.type";
import { HttpStatusEnum } from "@/enums/http.enum";
import { v4 as uuidv4 } from "uuid";

export const addInventaryProduct = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const body: TInventoryProduct & { type: string } = req.body;
  const uuid = uuidv4();
  const BD = EDbNames.DB_INVENTORY;
  const BD_IH = EDbNames.DB_INVENTORY_HISTORIC;
  const COLLECTION = "products";
  if (body.type === "product") {
    const fsController = new FirestoreController(BD, COLLECTION);
    const historicController = new FirestoreController(BD_IH, uuid);
    const payload: TInventoryProduct = {
      ...body,
      uuid: uuid,
      isDeleted: false,
    };
    const created = await fsController.create(payload);
    if (created) {
      await historicController.create({ action: "CREATE" });
      res.status(HttpStatusEnum.CREATE).send({
        error: false,
        message: {
          id: uuid,
        },
      });
    } else {
      res.status(HttpStatusEnum.SERVER_ERROR).send({
        error: true,
        message: "Error al crear el producto",
      });
    }
  }
};
