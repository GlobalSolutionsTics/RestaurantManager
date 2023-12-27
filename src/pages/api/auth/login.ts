import { HttpMethodsEnum } from "@/enums/http.enum";
import { NextApiRequest, NextApiResponse } from "next";
import { loginUsers } from "./controller/users";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method = req.method;
  const body = req.body;
  if (method === HttpMethodsEnum.POST) {
    console.log(body.user, body.password);
    const login = await loginUsers(body.user, body.password);
    if (login) {
      return res.status(200).send(login);
    } else {
      return res.status(204).send("");
    }
  } else {
    return res.status(404).send("Archivo no encontrado en el servidor");
  }
};

export default handler;
