import { HttpMethodsEnum } from "@/enums/http.enum";
import { NextApiRequest, NextApiResponse } from "next";
import { SEED_OF_JWT } from "./controller/users";
import jwt from "jsonwebtoken";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const method = req.method;

  if (method === HttpMethodsEnum.GET) {
    const header = req.headers;
    const authorization = header["authorization"] || header["www-authenticate"];
    const token = authorization?.replace(/^Bearer\s+/, "");

    if (token) {
      jwt.verify(token, SEED_OF_JWT, async (error, decoded) => {
        if (error) {
          res.status(403).send({
            error: true,
            message: "Error token inválido",
          });
        } else {
          res.status(200).send({
            error: false,
            message: decoded,
          });
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
