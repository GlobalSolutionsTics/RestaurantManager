import { NextApiRequest, NextApiResponse } from "next";
import PetitionController from "../controllers/petition.controller";
import { addCategory } from "./controller/addCategory";
import { addExpenses } from "./controller/addExpenses";
import { getExpenses } from "./controller/getExpenses";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const petitionController = new PetitionController(req, res);
  petitionController.post(addExpenses);
  petitionController.get(getExpenses);
};

export default handler;
