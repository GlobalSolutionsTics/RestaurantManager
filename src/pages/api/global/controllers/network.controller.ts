import { HttpMethodsEnum } from "@/enums/http.enum";
import { NextApiRequest, NextApiResponse } from "next";

class NetworkController {
  protected method: string | undefined;
  protected _get: any;
  protected _post: any;
  protected _put: any;

  constructor(req: NextApiRequest, res: NextApiResponse) {
    this.method = req.method;
  }

  set get(callback: (req: NextApiRequest, res: NextApiResponse) => void) {
    this._get = callback;
  }

  set post(callback: (req: NextApiRequest, res: NextApiResponse) => void) {
    this._post = callback;
  }

  set put(callback: (req: NextApiRequest, res: NextApiResponse) => void) {
    this._put = callback;
  }

  execute() {
    switch (this.method) {
      case HttpMethodsEnum.GET:
        this._get();
        break;
      case HttpMethodsEnum.POST:
        this._post();
        break;
      case HttpMethodsEnum.PUT:
        this._put();
      default:
        throw Error("Error no existe el metodos");
    }
  }
}

export default NetworkController;
