import { HttpMethodsEnum } from "@/enums/http.enum";
import { NextApiRequest, NextApiResponse } from "next";

class PetitionController {
  protected res: NextApiResponse;
  protected req: NextApiRequest;
  constructor(req: NextApiRequest, res: NextApiResponse) {
    this.req = req;
    this.res = res;
  }

  public async get(
    callback: (req: NextApiRequest, res: NextApiResponse) => void | unknown,
  ) {
    if (this.req.method === HttpMethodsEnum.GET) {
      await callback(this.req, this.res);
    }
  }

  public async post(
    callback: (req: NextApiRequest, res: NextApiResponse) => void | unknown,
  ) {
    if (this.req.method === HttpMethodsEnum.POST) {
      await callback(this.req, this.res);
    }
  }

  public async put(
    callback: (req: NextApiRequest, res: NextApiResponse) => void | unknown,
  ) {
    if (this.req.method === HttpMethodsEnum.PUT) {
      await callback(this.req, this.res);
    }
  }

  public async delete(
    callback: (req: NextApiRequest, res: NextApiResponse) => void | unknown,
  ) {
    if (this.req.method === HttpMethodsEnum.DELETE) {
      await callback(this.req, this.res);
    }
  }
}

export default PetitionController;
