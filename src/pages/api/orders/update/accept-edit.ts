import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { SEED_OF_JWT } from "../../auth/controller/users";
import { HttpMethodsEnum } from "@/enums/http.enum";
import { acceptEditOrderService } from "../controllers/updateOrder";

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  const method = req.method;
  const header = req.headers;
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
            const body = req.body;
            const applicationId = body.applicationId;
            const modifications = body.modifications;
            console.log("Payload:", applicationId, modifications);
            const { error, message } = await acceptEditOrderService(
              modifications.orderUUID,
              applicationId,
              modifications,
            );
            if (!error) {
              res.status(200).send({ error: false, message: "Autorizado" });
              return;
            } else {
              res.status(500).send({ error: false, message });
              return;
            }
          default:
            res.status(403).send({ error: true, message: "Sin autorización" });
            break;
        }
      }
    });
  } else {
    res.status(403).send({ error: true, message: "Sin autorización" });
  }
};

export default handle;
