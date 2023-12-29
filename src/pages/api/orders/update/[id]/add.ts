import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { SEED_OF_JWT } from "@/pages/api/auth/controller/users";
import { HttpMethodsEnum } from "@/enums/http.enum";
import { addNewItem } from "../../controllers/addNewItem";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const method = req.method;
  const header = req.headers;
  const uuid = req.query.id as string;
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
            const modifications = req.body.modifications;
            await addNewItem(uuid, modifications);
            res
              .status(200)
              .send({ error: false, message: "Actualización completada" });
            break;
          default:
            res.status(403).send({ error: true, message: "Sin autorización" });
            return;
        }
      }
    });
  } else {
    res.status(403).send({ error: true, message: "Sin autorización" });
    return;
  }
};

export default handler;
