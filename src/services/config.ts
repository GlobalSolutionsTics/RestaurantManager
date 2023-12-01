import { HttpMethodsEnum } from "@/enums/http.enum";
import { TConifg } from "@/types/configuration.types";
import { URL_API_CONFIG } from "@/utils/urls";

export const listConfigurationService = async (token: string) => {
  try {
    const headers = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const petition = await fetch(URL_API_CONFIG, headers);
    const response: any = await petition.json();
    if (!response.error) {
      return response.data;
    }
    return false;
  } catch (e: any) {
    console.error("Error al obtener la configuración");
    return false;
  }
};

export const updateConfigurationService = async (
  token: string,
  payload: TConifg,
) => {
  try {
    const headers = {
      method: HttpMethodsEnum.PUT,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };
    const petition = await fetch(URL_API_CONFIG, headers);
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
