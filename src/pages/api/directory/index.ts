// import { NextApiRequest, NextApiResponse } from "next";
// import { SEED_OF_JWT } from "../auth/controller/users";
// import jwt from "jsonwebtoken";
// import { HttpMethodsEnum } from "@/enums/http.enum";
// import { getAllList } from "./controllers/list";
// import createClient from "./controllers/create";

// const handler = async (req: NextApiRequest, res: NextApiResponse) => {
//   const method = req.method;
//   const headers = req.headers;
//   const body = req.body;
//   const authorization = headers["authorization"] || headers["www-authenticate"];
//   const token = authorization?.replace(/^Bearer\s+/, "");

//   try {
//     if (token) {
//       const decodedToken = jwt.verify(token, SEED_OF_JWT);
//       switch (method) {
//         case HttpMethodsEnum.GET:
//           const { error, data, message } = await getAllList();
//           if (!error) {
//             res.status(200).send({ error, data, message });
//           } else {
//             res.status(404).send({ error, data, message });
//           }
//           break;
//         case HttpMethodsEnum.POST:
//           const { uuidDirectory, name, phone, adress } = body;
//           const {
//             error: errorCreate,
//             data: dataCreate,
//             message: messageCreate,
//           } = await createClient(uuidDirectory, name, phone, adress);
//           if (!errorCreate) {
//             res.status(200).send({
//               error: errorCreate,
//               data: dataCreate,
//               message: messageCreate,
//             });
//           } else {
//             res.status(404).send({
//               error: errorCreate,
//               data: dataCreate,
//               message: messageCreate,
//             });
//           }
//           break;
//       }
//     } else {
//       res.status(403).send({
//         error: true,
//         message: "No se puede acceder a este modulo",
//       });
//     }
//   } catch (error) {
//     res.status(403).send({
//       error: true,
//       message: "Token invalido",
//     });
//   }
// };

// export default handler;
