import { URL_API_CLIENT } from "@/utils/urls";
import { HttpMethodsEnum, HttpStatusEnum } from "@/enums/http.enum";
import { IClientResponse } from "@/pages/api/directory/controllers/client";

export const listClientService = async (token: string) => {
  try {
    const petition = await fetch(`${URL_API_CLIENT}/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const response = await petition.json();
    return response.data;
  } catch (e: any) {
    console.log("Error al obtener el listado de clientes: ", e);
    return false;
  }
};

type TCreateClient = {
  name: string;
  adress: string;
  phone: number;
};

export const createClientService = async (
  payload: TCreateClient,
  token: any,
) => {
  try {
    const headers = {
      method: HttpMethodsEnum.POST,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };
    const petition = await fetch(`${URL_API_CLIENT}/create`, headers);
    if (petition.status === HttpStatusEnum.OK) {
      return true;
    } else {
      return console.log("lol");
    }
  } catch (e) {
    console.log("Error al añadir el cliente: ", e);
    return false;
  }
};
/*
export const createClientService = async (
  payload: TCreateClient,
  token: string,
) => {
  try {
    const headers = {
      method: HttpMethodsEnum.POST,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify(payload),
    };
    const petition = await fetch(`${URL_API_CLIENT}/create`, headers);
    const response = await petition.json();
    if (response.error) {
      return false;
    } else {
      return true;
    }
  } catch (e: any) {
    console.log("Error en el servicio de creacion de clientes: ", e);
    return false;
  }
};
*/
export const updateClientService = async (
  payload: IClientResponse,
  token: string,
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
    const petition = await fetch(`${URL_API_CLIENT}/update`, headers);
    const response = await petition.json();
    if (response.error) {
      return false;
    } else {
      return true;
    }
  } catch (e: any) {
    console.log("Error en el servicio de creacion de clientes: ", e);
    return false;
  }
};

export const deleteClientService = async (uuid: string, token: string) => {
  try {
    const headers = {
      method: HttpMethodsEnum.DELETE,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uuid }),
    };
    const petition = await fetch(`${URL_API_CLIENT}/delete`, headers);
    const response = await petition.json();
    if (response.error) {
      return false;
    } else {
      return true;
    }
  } catch (e: any) {
    console.log("Error en el servicio de creacion de clientes: ", e);
    return false;
  }
};
