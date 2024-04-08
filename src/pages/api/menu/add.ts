import { HttpMethodsEnum } from "@/enums/http.enum";
import { TMenuResponse } from "@/types/menu.types";
import { TErrorResponse } from "@/types/response.types";
import { NextApiRequest, NextApiResponse } from "next";
import { addDish } from "./controller/addDish";
import { DishesEnum } from "./controller/enum/dishes.enum";

type TCreateResponse = {
  status: number;
  message: number;
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<TCreateResponse | TErrorResponse>,
) => {
  const method = req.method;
  if (method === HttpMethodsEnum.POST) {
    const body = req.body;
    const payload: TMenuResponse = body.dish;
    const collection: DishesEnum = body.collection;
    if (payload && collection) {
      const createDish = await addDish(collection, payload);
      if (createDish) {
        res
          .status(200)
          .json({ status: 200, message: "Platillo añadido exitosamente" });
      } else {
        res
          .status(500)
          .json({ status: 500, message: "Error al crear el platillo" });
      }
    } else {
      const paramPayload = payload ? "" : " dish ";
      const paramCollection = collection ? "" : " collection ";
      res.status(400).json({
        status: 400,
        message: "Error falta un parametro" + paramCollection + paramPayload,
      });
    }
  } else {
    res
      .status(404)
      .json({ status: 404, message: "No existe la url que busca" });
  }
};
export default handler;
