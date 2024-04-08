import { HttpMethodsEnum } from "@/enums/http.enum";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { deleteExpenses } from "./controller/deleteExpenses";

const SEED_OF_JWT = "AñOS_LUZ";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const method = req.method;
  if (method === HttpMethodsEnum.DELETE) {
    const header = req.headers;
    const authorization = header["authorization"] || header["www-authenticate"];
    const token = authorization?.replace(/^Bearer\s+/, "");
    if (token) {
      jwt.verify(token, SEED_OF_JWT, async (error) => {
        if (error) {
          res.status(403).send({
            error: true,
            message: "No tienes autorizacion para eliminar gastos",
          });
        } else {
          const body = req.body;
          const uuid = body.uuid;
          const { error, message } = await deleteExpenses(uuid);
          res.status(200).send([error, message]);
        }
      });
    } else {
      res.status(403).send({ error: true, message: "No tienes autorizacion" });
    }
  } else {
    res.status(404).send("Not found");
  }
};
export default handler;
