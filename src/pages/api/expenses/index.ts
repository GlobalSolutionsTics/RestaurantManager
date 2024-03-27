import { TResponseCollection } from "@/types/expenses.types";
import { TErrorResponse } from "@/types/response.types";
import { firestore } from "@firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";

type TMenu = {
  name: string;
  price: number;
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<Array<TMenu> | TErrorResponse>,
) => {
  try {
    const expensRef = doc(firestore, "expens", "Ricardo");
    const expensCollection = await getDoc(expensRef);
    if (expensCollection.exists()) {
      const collection = expensCollection.data() as TResponseCollection;
      console.log(collection);
      const menu = collection.data;
      res.status(200).json(menu);
    } else {
      res.status(404).json({
        status: 404,
        message: "Error al obtener el listado de la base",
      });
    }
  } catch (error) {
    res.status(500).json({ status: 500, message: "Error en el servidor" });
  }
};

export default handler;
