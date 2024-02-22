import { NextApiRequest, NextApiResponse } from "next";

const handle = (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).send({ message: "OK" });
};

export default handle;
