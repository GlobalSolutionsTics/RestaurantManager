import { NextApiRequest, NextApiResponse } from "next";
import { SEED_OF_JWT } from "../auth/controller/users";
import jwt from "jsonwebtoken";
import { HttpMethodsEnum } from "@/enums/http.enum";
import { updateDish } from "./controller/dish.update";

const handle = (req: NextApiRequest, res: NextApiResponse) => {
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
          const body: any = req.body;
          const { error, message } = await updateDish(
            body.category,
            body.dishes,
          );
          if (error) {
            res.status(401).send({ error, message });
          } else {
            res.status(201).send({ error, message });
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

export default handle;
