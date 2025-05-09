import { NextApiRequest, NextApiResponse } from "next";
import { getAllOrdersFS, getOrdersByDate } from "./controllers/getOrders";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { init, end } = req.query;
  console.log("req:body", init, end);

  if (init && end) {
    const initalDate = new Date(init);
    initalDate.setHours(0, 0, 0, 0);
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 99);
    const orders2 = await getOrdersByDate(initalDate, endDate);
    console.log(initalDate, endDate);
    if (orders2?.length && orders2.length > 0) {
      res.status(200).send({ data: orders2, error: false });
    } else {
      res.status(200).send({ data: [], error: false });
    }
  }

  /*const orders = await getAllOrdersFS();
  if (orders) {
    const dataPreprocesed = Object.values(orders);
    const data = dataPreprocesed.map((itm: any) => ({
      ...itm,
      createdAtTmp: formatDate(itm.creatAt),
      createAtHour: formatHour(itm.creatAt),
      createAtDay: new Date(itm.creatAt).getDay(),
      createdAtFullTm: new Date(itm.creatAt).toLocaleString("es-MX"),
      createAtTime: new Date(itm.creatAt).getTime(),
      total: getTotalDish(itm.dishesDescription),
    }));
    res.status(200).send({ data: data, error: false });
  } else {
    res.status(200).send({ data: [], error: false });
  }*/
};
export default handler;
