import { NextApiRequest, NextApiResponse } from "next";
import { getOrdersByDate } from "./controllers/getOrders";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

  if (body.init && body.end) {
    const init = body.init;
    const end = body.end;
    console.log("INIT-END:", init, end);
    const initalDate = new Date(init as string);
    initalDate.setHours(6, 0, 0, 0);
    const endDate = new Date(end as string);
    endDate.setHours(23, 0, 0, 0);
    console.log("INIT:", initalDate);
    console.log("FINISH:", endDate);
    const orders2 = await getOrdersByDate(initalDate, endDate);
    if (orders2?.length && orders2.length > 0) {
      res.status(200).send({ data: orders2, error: false });
    } else {
      res.status(200).send({ data: [], error: false });
    }
  } else {
    res.status(400).send({ data: [], error: true });
  }
};
export default handler;
