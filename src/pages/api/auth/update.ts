import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { HttpMethodsEnum } from "@/enums/http.enum";
import { IUsersResponse, SEED_OF_JWT, updateUser } from "./controller/users";

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
          const body: IUsersResponse = req.body;
          const payload = {
            uuid: body.uuid,
            user: body.user,
            name: body.name,
            password: body.password,
            type: body.type,
          };
          const { error, message } = await updateUser(payload);
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
