import { ContentTypeEnum } from "@/enums/contentType.enum";
import { HttpMethodsEnum } from "@/enums/http.enum";
import { StatusEnum } from "@/enums/states.enum";
import { UOrderReq } from "@/pages/api/types/Order/order.type";
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

export const sendApplicationOrderAdd = async (
  token: string,
  uuid: string,
  payload: UOrderReq,
) => {
  try {
    const headers = {
      method: HttpMethodsEnum.PUT,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        modifications: payload.modifications,
        tableNumber: payload.tableNumber,
        waiter: payload.waiter,
        status: payload.status,
      }),
    };
    const petition = await fetch(
      `${URL_API_ORDER}/update/${uuid}/add`,
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

export const sendApplicationOrderEdit = async (
  token: string,
  uuid: string,
  payload: UOrderReq,
) => {
  try {
    const headers = {
      method: HttpMethodsEnum.PUT,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        modifications: payload.modifications,
        tableNumber: payload.tableNumber,
        waiter: payload.waiter,
        status: payload.status,
      }),
    };
    const petition = await fetch(
      `${URL_API_ORDER}/update/${uuid}/order`,
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

export const getApplicationList = async (token: string) => {
  const config = {
    method: HttpMethodsEnum.GET,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
  try {
    const consult = await fetch(`${URL_API_ORDER}/applications`, config);
    const response = await consult.json();
    return response.data;
  } catch (e) {
    console.log("Error al obtener las solicitud:", e);
    return false;
  }
};

export const acceptEditService = async (token: string, body: any) => {
  try {
    const headers = {
      method: HttpMethodsEnum.PUT,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        applicationId: body.applicationId,
        modifications: body.modifications,
      }),
    };
    const petition = await fetch(
      `${URL_API_ORDER}/update/accept-edit`,
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
