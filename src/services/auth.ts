import { ContentTypeEnum } from "@/enums/contentType.enum";
import { HttpMethodsEnum } from "@/enums/http.enum";
import { URL_API_AUTH } from "@/utils/urls";

export const loginService = async (user: string, pass: string) => {
  try {
    const payload = {
      user,
      password: pass,
    };
    const header = {
      method: HttpMethodsEnum.POST,
      body: JSON.stringify(payload),
      "Content-Type": ContentTypeEnum.JSON,
    };
    const petition = await fetch(`${URL_API_AUTH}/login`, header);
    if (petition.status === 200) {
      const { token, type } = await petition.json();
      return { token: token, type: type };
    }
  } catch (e: any) {
    return false;
  }
};
