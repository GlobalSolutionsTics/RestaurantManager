import { HttpMethodsEnum } from "@/enums/http.enum";
import { TCatalog } from "@/types/catalog.types";
import { TErrorResponse } from "@/types/response.types";
import { NextApiRequest, NextApiResponse } from "next";
import { ExpensesEnum } from "./controller/enum/expenses.enum";
import { addCategory } from "./controller/addCategory";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<TErrorResponse>,
) => {
  const method = req.method;
  if (method === HttpMethodsEnum.POST) {
    const body = req.body;
    const payload: TCatalog = body;
    const collection: ExpensesEnum = ExpensesEnum.CATEGORIES;
    if (payload) {
      const createCategory = await addCategory(collection, payload);
      if (createCategory) {
        res
          .status(200)
          .json({ status: 200, message: "Gasto añadido exitosamente" });
      } else {
        res
          .status(500)
          .json({ status: 500, message: "Error al crear el gasto" });
      }
    } else {
      const paramPayload = payload ? "" : "body";
      res.status(400).json({
        status: 400,
        message: "Error falta un parametro" + paramPayload,
      });
    }
  } else {
    res
      .status(404)
      .json({ status: 404, message: "No existe la url que busca" });
  }
};

export default handler;
