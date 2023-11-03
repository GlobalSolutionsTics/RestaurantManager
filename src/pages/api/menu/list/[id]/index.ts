import { HttpMethodsEnum } from "@/enums/http.enum";
import { TMenu } from "@/types/menu.types";
import { NextApiRequest, NextApiResponse } from "next";
import { getDish } from "../../controller/getDish";
import { TErrorResponse } from "@/types/response.types";
import { DishesEnum } from "../../controller/enum/dishes.enum";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<Array<TMenu> | TErrorResponse>,
) => {
  const method = req.method;
  if (method === HttpMethodsEnum.GET) {
    const dish_id = req.query.id as DishesEnum;
    const menu: any = await getDish(dish_id);
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
