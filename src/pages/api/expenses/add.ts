import { HttpMethodsEnum } from "@/enums/http.enum";
import { TExpenses } from "@/types/expenses.types";
import { TErrorResponse } from "@/types/response.types";
import { NextApiRequest, NextApiResponse } from "next";
import { ExpensesEnum } from "./controller/enum/expenses.enum";
import { addExpenses } from "./controller/addExpenses";

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
    const payload: TExpenses = body.expens;
    const collection: ExpensesEnum = body.collection;
    if (payload && collection) {
      const createExpens = await addExpenses(collection, payload);
      if (createExpens) {
        res
          .status(200)
          .json({ status: 200, message: "Gasto añadido exitosamente" });
      } else {
        res
          .status(500)
          .json({ status: 500, message: "Error al crear el gasto" });
      }
    } else {
      const paramPayload = payload ? "" : "expens";
      const paramCollection = collection ? "" : "collection";
      res.status(400).json({
        status: 400,
        message: "Error, falta un parametro" + paramCollection + paramPayload,
      });
    }
  } else {
    res
      .status(404)
      .json({ status: 404, message: "No existe la url que busca" });
  }
};

export default handler;
