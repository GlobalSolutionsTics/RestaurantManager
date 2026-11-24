import { HttpMethodsEnum } from "@/enums/http.enum";
import type { IUsersResponse } from "@/pages/api/auth/controller/users";
import { URL_API_AUTH } from "@/utils/urls";

export const listUserSerive = async (
  token: string,
): Promise<IUsersResponse[] | false> => {
  try {
    const petition = await fetch(`${URL_API_AUTH}/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!petition.ok) return false;
    const response = await petition.json();
    return Array.isArray(response?.data) ? response.data : false;
  } catch (e: any) {
    console.error("Error al obtener el listado de usuarios: ", e);
    return false;
  }
};

export type TCreateUser = {
  name: string;
  user: string;
  password: string;
  type: string;
  kitchenType?: string;
};

export const createUserService = async (
  payload: TCreateUser,
  token: string,
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
    const petition = await fetch(`${URL_API_AUTH}/create`, headers);
    const response = await petition.json();
    if (response.error) {
      return false;
    } else {
      return true;
    }
  } catch (e: any) {
    console.error("Error en el servicio de creación de usuarios:", e);
    return false;
  }
};

export const updateUserService = async (
  payload: IUsersResponse,
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
    const petition = await fetch(`${URL_API_AUTH}/update`, headers);
    const response = await petition.json();
    if (response.error) {
      return false;
    } else {
      return true;
    }
  } catch (e: any) {
    console.error("Error en el servicio de creación de usuarios:", e);
    return false;
  }
};

export const deleteUserService = async (uuid: string, token: string) => {
  try {
    const headers = {
      method: HttpMethodsEnum.DELETE,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uuid }),
    };
    const petition = await fetch(`${URL_API_AUTH}/delete`, headers);
    const response = await petition.json();
    if (response.error) {
      return false;
    } else {
      return true;
    }
  } catch (e: any) {
    console.error("Error en el servicio de creación de usuarios:", e);
    return false;
  }
};
