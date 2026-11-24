import { HttpMethodsEnum } from "@/enums/http.enum";
import { NextApiRequest, NextApiResponse } from "next";
import { Payment } from "@/components/admin/paymentForm/types";
import { updateInformationPaymentV2 } from "../../../controllers/updateOrder";

type TBody = {
  payment: Payment;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method = req.method;
  const header = req.headers;
  const authorization = header["authorization"] || header["www-authenticate"];
  const token = authorization?.replace(/^Bearer\s+/, "");
  if (token) {
    switch (method) {
      case HttpMethodsEnum.PUT:
        const body: TBody = req.body;
        const id = req.query.id as string;
        const { error } = await updateInformationPaymentV2(id, body.payment);
        if (!error) {
          res.status(200).send({ message: "Ok", error: false });
        } else {
          res
            .status(500)
            .send({ message: "Error al hacer la modificación", error: true });
        }
        break;
      default:
        res.status(500).send({ message: "Sin permisos", error: true });
        break;
    }
  } else {
    res.status(500).send({ message: "Sin permisos", error: true });
  }
};
export default handler;
