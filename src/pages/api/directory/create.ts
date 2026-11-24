import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { SEED_OF_JWT } from "./controllers/client";
import { HttpMethodsEnum } from "@/enums/http.enum";
import createClient from "./controllers/create.controller";
import { v4 as uuidv4 } from "uuid";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const method = req.method;
  if (method === HttpMethodsEnum.POST) {
    const header = req.headers;
    const authorization = header["authorization"] || header["www-authenticate"];
    const token = authorization?.replace(/^Bearer\s+/, "");
    if (token) {
      jwt.verify(token, SEED_OF_JWT, async (error) => {
        if (error) {
          res.status(403).send({
            error: true,
            message: "Error token inválido",
            details: error.message,
          });
        } else {
          const body = req.body;
          try {
            const { error, message } = await createClient(
              body.name,
              body.adress,
              body.phone,
              uuidv4(),
            );
            res.status(200).send({ error, message });
          } catch (e: any) {
            console.error("Error en createClient:", e);
            res.status(500).send({
              error: true,
              message: "Error interno del servidor al crear el cliente",
              details: e.message,
            });
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
