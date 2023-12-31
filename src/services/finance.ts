import { HttpMethodsEnum } from "@/enums/http.enum";
import { URL_API_FINANCE } from "@/utils/urls";

export const getFinancialServices = async (token: string) => {
  try {
    const headers = {
      method: HttpMethodsEnum.PUT,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const petition = await fetch(URL_API_FINANCE, headers);
    if (petition.status === 200) {
      const data = await petition.json();
      return data.data;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
};
