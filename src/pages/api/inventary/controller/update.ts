import { NextApiResponse, NextApiRequest } from "next";
import { TInventoryProduct } from "../../types/product.type";
import { EDbNames } from "@/enums/db.enum";
import FirestoreController from "../../controllers/firestore.controller";
import { HttpStatusEnum } from "@/enums/http.enum";

export const updateInventaryProduct = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const body: TInventoryProduct & { type: string } = req.body;
  const BD = EDbNames.DB_INVENTORY;
  const BD_IH = EDbNames.DB_INVENTORY_HISTORIC;
  const COLLECTION = "products";
  if (body.type === "product") {
    const uuid = body.uuid;
    const fsController = new FirestoreController(BD, COLLECTION);
    const historicController = new FirestoreController(BD_IH, uuid || "fail");
    const findProduct: any = await fsController.find(
      (itm: any) => itm.uuid === uuid,
    );
    const payload: TInventoryProduct = {
      name: body.name,
      cant: body.cant,
      measurement: body.measurement,
      uuid: uuid,
      createAt: findProduct.createAt,
      isDeleted: findProduct.isDeleted,
    };
    const update = await fsController.update(
      payload,
      (itm) => itm.uuid === uuid,
    );
    if (update) {
      await historicController.create({ action: "UPDATE" });
      res.status(HttpStatusEnum.CREATE).send({
        error: false,
        message: {
          id: uuid,
        },
      });
    } else {
      await historicController.create({ action: "FAIL UPDATE" });
      res.status(HttpStatusEnum.SERVER_ERROR).send({
        error: true,
        message: "Error al actualizar el producto",
      });
    }
  }
};
