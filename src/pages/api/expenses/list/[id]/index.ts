import { HttpMethodsEnum } from "@/enums/http.enum";
import { TExpenses } from "@/types/expenses.types";
import { TErrorResponse } from "@/types/response.types";
import { NextApiRequest, NextApiResponse } from "next";
import { ExpensesEnum } from "../../controller/enum/expenses.enum";
import { getExpenses } from "../../controller/getExpenses";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<Array<TExpenses> | TErrorResponse>,
) => {
  const method = req.method;
  if (method === HttpMethodsEnum.GET) {
    const expens_id = req.query.id as ExpensesEnum;
    const menu: any = await getExpenses(expens_id);
    if (menu) {
      res.status(200).json(menu);
    } else {
      res.status(404).json({ status: 404, message: "Error id no encontrado" });
    }
  } else {
    res.status(404);
  }
};

export default handler;
