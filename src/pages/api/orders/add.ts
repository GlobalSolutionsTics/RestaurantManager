import { NextApiRequest, NextApiResponse } from "next";
import { TOrder } from "../types/Order/order.type";
import { v4 as uuidv4 } from "uuid";
import addOrder from "./controllers/addOrder";

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const method = req.method;
  if (method === "POST") {
    const body: TOrder = req.body;
    console.log(body);
    const uuid = uuidv4();
    const add = await addOrder(
      body.name,
      body.dishes,
      uuid,
      body.tableNumber,
      body.dishesDescription
    );
    if (add) {
      res.status(201).send({
        id: uuid,
      });
    } else {
      res.status(500).send({ message: "Error al insertar en la bd" });
    }
  } else {
    res.status(404);
  }
};

export default handler;
