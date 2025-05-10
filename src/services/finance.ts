import { HttpMethodsEnum } from "@/enums/http.enum";
import { URL_API_FINANCE } from "@/utils/urls";

export const getFinancialServices = async (
  token: string,
  init: string,
  end: string,
) => {
  try {
    const headers = {
      method: HttpMethodsEnum.POST,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        init: init,
        end: end,
      }),
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
