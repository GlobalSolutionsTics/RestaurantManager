import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { HttpMethodsEnum } from "@/enums/http.enum";
import { IClientResponse, SEED_OF_JWT } from "./controllers/client";
import { updateClient } from "./controllers/update.controller";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method = req.method;
  if (method === HttpMethodsEnum.PUT) {
    const header = req.headers;
    const authorization = header["authorization"] || header["www-authenticate"];
    const token = authorization?.replace(/^Bearer\s+/, "");
    if (token) {
      jwt.verify(token, SEED_OF_JWT, async (err) => {
        if (err) {
          res.status(403).send({
            error: true,
            message: "No tienes autorizacion para esto",
          });
        } else {
          const body: IClientResponse = req.body;
          const payload = {
            uuid: body.uuid,
            name: body.name,
            adress: body.adress,
            phone: body.phone,
          };
          const { error, message } = await updateClient(payload);
          if (error) {
            res.status(401).send({ error, message });
          } else {
            res.status(200).send({ error, message });
          }
        }
      });
    } else {
      res.status(403).send({
        error: true,
        message: "No tienes autorizacion para esto",
      });
    }
  } else {
    res.status(404).send("Not found");
  }
};

export default handler;
