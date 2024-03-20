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
      headers: {
        "Content-Type": ContentTypeEnum.JSON,
      },
    };
    const petition = await fetch(`${URL_API_AUTH}/login`, header);
    if (petition.status === 200) {
      const { token, type } = await petition.json();
      return { token: token, type: type };
    }
    return false;
  } catch (e: any) {
    return false;
  }
};

export const validateTokneService = async (token: string) => {
  try {
    const header = {
      headers: {
        "Content-Type": ContentTypeEnum.JSON,
        Authorization: `Bearer ${token}`,
      },
    };
    const petition = await fetch(`${URL_API_AUTH}/validate`, header);
    if (petition.status === 200) {
      const { error } = await petition.json();
      if (!error) return true;
    }
    return false;
  } catch (e: any) {
    return false;
  }
};
