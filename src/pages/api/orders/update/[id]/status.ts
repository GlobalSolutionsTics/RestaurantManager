import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { StatusEnum } from "@/enums/states.enum";
import { updateStatusOrder } from "../../controllers/updateOrder";
import { SEED_OF_JWT } from "@/pages/api/auth/controller/users";
import { HttpMethodsEnum } from "@/enums/http.enum";

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  const method = req.method;
  const header = req.headers;
  const uuid = req.query.id as string;
  const authorization = header["authorization"] || header["www-authenticate"];
  const token = authorization?.replace(/^Bearer\s+/, "");
  if (token) {
    jwt.verify(token, SEED_OF_JWT, async (err) => {
      if (err) {
        res.status(403).send({
          error: true,
          message: "Usted no tiene autorización para está operación",
        });
      } else {
        switch (method) {
          case HttpMethodsEnum.PUT:
            if (uuid) {
              const status = req.body.status;
              const { error, message } = await updateStatusOrder(status, uuid);
              if (!error) {
                res.status(200).send({
                  error,
                  message,
                });
              } else {
                res.status(500).send({
                  error,
                  message,
                });
              }
            }
            res.status(403).send({
              error: true,
              message: "No se encontro la operación a realizar",
            });
            break;
          default:
            res.status(403).send({
              error: true,
              message: "No se encontro la operación a realizar",
            });
            break;
        }
      }
    });
  } else {
    res.status(403).send({
      error: true,
      message: "No tiene autorización para esto",
    });
  }
};

export default handle;
