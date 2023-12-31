import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { SEED_OF_JWT } from "@/pages/api/auth/controller/users";
import { HttpMethodsEnum } from "@/enums/http.enum";
import { UOrderReq } from "@/pages/api/types/Order/order.type";
import { updateDishesAndNumber } from "../../controllers/updateOrder";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const method = req.method;
  const header = req.headers;
  const authorization = header["authorization"] || header["www-authenticate"];
  const token = authorization?.replace(/^Bearer\s+/, "");
  if (token) {
    jwt.verify(token, SEED_OF_JWT, async (err) => {
      if (err) {
        res.status(403).send({ error: true, message: "Sin autorización" });
        return;
      } else {
        switch (method) {
          case HttpMethodsEnum.PUT:
            const body: UOrderReq = req.body;
            const dishesDescription = body.modifications.dishesDescription;
            if (req.query.id) {
              const orderId: string = req.query.id as string;
              const response = await updateDishesAndNumber(
                orderId,
                dishesDescription,
              );
              res.status(201).send(response);
            } else {
              res
                .status(403)
                .send({ error: true, message: "Sin autorización" });
            }
            break;
          default:
            res.status(403).send({ error: true, message: "Sin autorización" });
            break;
        }
        return;
      }
    });
  } else {
    res.status(403).send({ error: true, message: "Sin autorización" });
  }
};

export default handler;
