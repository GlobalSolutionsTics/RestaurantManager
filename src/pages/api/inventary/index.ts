import { NextApiRequest, NextApiResponse } from "next";
import PetitionController from "../controllers/petition.controller";
import { addInventaryProduct } from "./controller/add";
import { updateInventaryProduct } from "./controller/update";
import { getAllInventaryProduct } from "./controller/get";
import { deleteInventaryProduct } from "./controller/delete";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const petitionController = new PetitionController(req, res);
  petitionController.get(getAllInventaryProduct);
  petitionController.post(addInventaryProduct);
  petitionController.put(updateInventaryProduct);
  petitionController.delete(deleteInventaryProduct);
};

export default handler;
