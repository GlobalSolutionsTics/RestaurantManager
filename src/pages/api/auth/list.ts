import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { SEED_OF_JWT, listUsers } from "./controller/users";
import { HttpMethodsEnum } from "@/enums/http.enum";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const method = req.method;
  if (method === HttpMethodsEnum.GET) {
    const header = req.headers;
    const authorization = header["authorization"] || header["www-authenticate"];
    const token = authorization?.replace(/^Bearer\s+/, "");
    if (token) {
      jwt.verify(token, SEED_OF_JWT, async (error) => {
        if (error) {
          res.status(403).send({
            error: true,
            message: "Error token inválido",
          });
        } else {
          const { data } = await listUsers();
          res.status(201).send({ data });
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
