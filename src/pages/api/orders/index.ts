import { NextApiRequest, NextApiResponse } from "next";
import { getAllOrders } from "./controllers/getAllOrders";

type TOrders = {
  data: any;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<TOrders>) => {
  const method = req.method;
  if (req.method === "GET") {
    const data = await getAllOrders();
    if (data) {
      res.status(200).send({
        data: data,
      });
    } else {
      res.status(404).send({
        data: "Sin informacion",
      });
    }
  } else {
    res.status(200).json({
      data: [],
    });
  }
};

export default handler;
