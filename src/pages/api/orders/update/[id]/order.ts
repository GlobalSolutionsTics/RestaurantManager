import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { SEED_OF_JWT } from "@/pages/api/auth/controller/users";
import { HttpMethodsEnum } from "@/enums/http.enum";
import { UOrderReq } from "@/pages/api/types/Order/order.type";
import { insertInDB } from "@/utils/dbcontroller";
import { DB_ORDERS_APPLICATION } from "@models/names";
import { StatusApplicationEnum } from "@/enums/states.enum";

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
            await insertInDB(DB_ORDERS_APPLICATION, "activas", {
              ...body,
              applicationStatus: StatusApplicationEnum.ACTIVE,
            });
            res
              .status(201)
              .send({ error: false, message: "Actualización completada" });
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
