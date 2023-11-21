import { ContentTypeEnum } from "@/enums/contentType.enum";
import { HttpMethodsEnum } from "@/enums/http.enum";
import { URL_API_ORDER } from "@/utils/urls";

export const createOrder = async (payload: any) => {
  try {
    const header = {
      method: HttpMethodsEnum.POST,
      body: JSON.stringify(payload),
      "Content-Type": ContentTypeEnum.JSON,
    };
    const petition = await fetch(`${URL_API_ORDER}/add`, header);
    if (petition.status === 201) {
      const response: any = await petition.json();
      return response.id;
    }
    return false;
  } catch (e: any) {
    return false;
  }
};
