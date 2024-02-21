import { NextApiRequest, NextApiResponse } from "next";
import { TOrder } from "../types/Order/order.type";
import { v4 as uuidv4 } from "uuid";
import addOrder from "./controllers/addOrder";
import { OrdersDishesStatus } from "@/enums/orders.enum";
import { existTableNumber } from "./controllers/getAllOrders";

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const method = req.method;
  if (method === "POST") {
    const body: TOrder = req.body;
    const uuid = uuidv4();
    const newDishes = body.dishesDescription.map((itm) => ({
      ...itm,
      status: OrdersDishesStatus.ACTIVE,
    }));
    const exits = await existTableNumber(body.tableNumber);
    if (!exits) {
      const add = await addOrder(
        body.name,
        body.dishes,
        uuid,
        body.tableNumber,
        newDishes,
        body.waiter,
      );
      if (add) {
        res.status(201).send({
          error: false,
          message: uuid,
        });
      } else {
        res
          .status(500)
          .send({ error: true, message: "Error al insertar en la bd" });
      }
    } else {
      res
        .status(202)
        .send({
          error: true,
          message: "Esta mesa ya tiene una orden, favor de verificarla",
        });
    }
  } else {
    res.status(404);
  }
};

export default handler;
