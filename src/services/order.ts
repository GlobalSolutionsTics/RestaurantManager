import { ContentTypeEnum } from "@/enums/contentType.enum";
import { HttpMethodsEnum } from "@/enums/http.enum";
import { StatusEnum } from "@/enums/states.enum";
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

export const updateOrderService = async (
  token: string,
  uuid: string,
  status: StatusEnum,
) => {
  try {
    const headers = {
      method: HttpMethodsEnum.PUT,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    };
    const petition = await fetch(
      `${URL_API_ORDER}/update/${uuid}/status`,
      headers,
    );
    const response = await petition.json();
    if (response.error) {
      return false;
    } else {
      return true;
    }
  } catch (e: any) {
    console.error("Error al actualizar la configuracion");
    return false;
  }
};
