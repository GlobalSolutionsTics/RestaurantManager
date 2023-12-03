import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { HttpMethodsEnum } from "@/enums/http.enum";
import { listConfiguration, updateConfiguration } from "./controller/config";
import { SEED_OF_JWT } from "../auth/controller/users";
import { TConifg } from "@/types/configuration.types";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method = req.method;
  const header = req.headers;
  const authorization = header["authorization"] || header["www-authenticate"];
  const token = authorization?.replace(/^Bearer\s+/, "");
  if (token) {
    jwt.verify(token, SEED_OF_JWT, async (err) => {
      if (err) {
        res.status(403).send({ message: "Sin autorizacion" });
      } else {
        switch (method) {
          case HttpMethodsEnum.GET:
            const { error, message, data } = await listConfiguration();
            if (error) {
              res
                .status(401)
                .send({ message: "No hubo resultado en la petición" });
            } else {
              res.status(200).send({ message, data });
            }
            break;
          case HttpMethodsEnum.PUT:
            const body: TConifg = req.body;
            const { error: errorUpdate, message: messageUpdate } =
              await updateConfiguration(body);
            if (!errorUpdate) {
              res
                .status(200)
                .send({ error: errorUpdate, message: messageUpdate });
            }
            res
              .status(500)
              .send({ error: errorUpdate, message: messageUpdate });
            break;
          default:
            res
              .status(404)
              .send({ message: "No se encontro la ruta especificada" });
        }
      }
    });
  } else {
    res.status(403).send({ message: "Necesita un token para continuar" });
  }
};

export default handler;
