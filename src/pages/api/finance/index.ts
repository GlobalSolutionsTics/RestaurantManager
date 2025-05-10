import { NextApiRequest, NextApiResponse } from "next";
import { getAllOrdersFS, getOrdersByDate } from "./controllers/getOrders";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { init, end } = req.body;

  if (init && end) {
    const initalDate = new Date(init as string);
    initalDate.setHours(0, 0, 0, 0);
    const endDate = new Date(end as string);
    endDate.setHours(23, 59, 59, 99);
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
