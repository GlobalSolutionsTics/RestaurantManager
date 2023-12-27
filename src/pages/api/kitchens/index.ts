import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { SEED_OF_JWT } from "../auth/controller/users";
import { HttpMethodsEnum } from "@/enums/http.enum";
import { getAllList } from "./controllers/list";
import { createKitchen } from "./controllers/create";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method = req.method;
  const header = req.headers;
  const body = req.body;
  const authorization = header["authorization"] || header["www-authenticate"];
  const token = authorization?.replace(/^Bearer\s+/, "");
  if (token) {
    jwt.verify(token, SEED_OF_JWT, async (err) => {
      if (err) {
        res.status(403).send({
          error: true,
          message: "Token invalido",
        });
      } else {
        switch (method) {
          case HttpMethodsEnum.GET:
            const { error, data, message } = await getAllList();
            if (!error) {
              res.status(200).send({ error, data, message });
            } else {
              res.status(404).send({ error, data, message });
            }
            break;
          case HttpMethodsEnum.POST:
            const uuidUser = body.uuidUser;
            const kitchenAsigned = body.kitchenAsigned;
            const description = body.description;
            const {
              error: errorCreate,
              data: dataCreate,
              message: messageCreate,
            } = await createKitchen(uuidUser, kitchenAsigned, description);
            if (!errorCreate) {
              res.status(200).send({
                error: errorCreate,
                data: dataCreate,
                message: messageCreate,
              });
            } else {
              res.status(404).send({
                error: errorCreate,
                data: dataCreate,
                message: messageCreate,
              });
            }
            break;
        }
      }
    });
  } else {
    res.status(403).send({
      error: true,
      message: "No tienes permiso para acceder a esté modulo",
    });
  }
};

export default handler;
