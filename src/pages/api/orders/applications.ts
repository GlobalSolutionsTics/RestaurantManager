import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { SEED_OF_JWT } from "../auth/controller/users";
import { getInDB } from "@/utils/dbcontroller";
import { DB_ORDERS_APPLICATION } from "@models/names";

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  const method = req.method;
  const header = req.headers;
  const authorization = header["authorization"] || header["www-authenticate"];
  const token = authorization?.replace(/^Bearer\s+/, "");
  if (token) {
    jwt.verify(token, SEED_OF_JWT, async (err) => {
      if (err) {
        res.status(403).send({
          error: true,
          message: "Sin autorización",
        });
        return;
      } else {
        const data = await getInDB(DB_ORDERS_APPLICATION, "activas");
        res.status(200).send({ error: false, data: data });
      }
    });
  } else {
    res.status(403).send({ error: true, message: "Sin autorización" });
    return;
  }
};

export default handle;
