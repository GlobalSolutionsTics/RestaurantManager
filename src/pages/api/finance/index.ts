import { NextApiRequest, NextApiResponse } from "next";
import { getAllOrdersFS } from "./controllers/getOrders";
import { formatDate, formatHour, getTotalDish } from "@/utils/formats";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const orders = await getAllOrdersFS();
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
  }
};
export default handler;
