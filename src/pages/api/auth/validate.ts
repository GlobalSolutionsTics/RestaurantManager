import { HttpMethodsEnum } from "@/enums/http.enum";
import { NextApiRequest, NextApiResponse } from "next";
import { SEED_OF_JWT, loginUsers } from "./controller/users";
import jwt from "jsonwebtoken";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const method = req.method;
  const body = JSON.parse(req.body);
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
          const isValidUser = await loginUsers(body.user, body.pass);
          if (isValidUser) {
            res.status(200).send({
              succes: true,
              message: "Acceso autorizado",
            });
          } else {
            res.status(403).send({
              error: true,
              message: "Token invalido",
            });
          }
        }
      });
    } else {
      res.status(403).send({
        error: true,
        message: "No hay token",
      });
    }
  } else {
    res.status(404).send("Not found");
  }
};

export default handler;
