import { Payment } from "@/components/admin/paymentForm/types";
import { ContentTypeEnum } from "@/enums/contentType.enum";
import { HttpMethodsEnum } from "@/enums/http.enum";
import { StatusEnum } from "@/enums/states.enum";
import type { AddDishesRequest, EditDishesRequest, UpdateDinersDivisionRequest } from "@/pages/api/types/Order/order.type";
import type { KitchenOrderAction } from "@/utils/kitchenOrder";
import { URL_API_ORDER } from "@/utils/urls";

export const createOrder = async (payload: any, submissionKey?: string) => {
  try {
    const header = {
      method: HttpMethodsEnum.POST,
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": ContentTypeEnum.JSON,
        ...(submissionKey && { "Idempotency-Key": submissionKey }),
      },
    };
    const petition = await fetch(`${URL_API_ORDER}/add`, header);
    const response: any = await petition.json();
    return { error: response.error, message: response.message };
  } catch {
    return {
      error: true,
      message: "No se pudo confirmar el pedido. Intenta de nuevo.",
    };
  }
};

export const updateDinersDivisionService = async (
  token: string,
  orderId: string,
  division: UpdateDinersDivisionRequest,
): Promise<{ error: boolean; message: string }> => {
  try {
    const response = await fetch(`${URL_API_ORDER}/update/${orderId}/diners-division`, {
      method: HttpMethodsEnum.PUT,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": ContentTypeEnum.JSON,
      },
      body: JSON.stringify(division),
    });
    const result = await response.json();
    return { error: !response.ok || result.error, message: result.message };
  } catch {
    return { error: true, message: "No se pudo guardar la división. Intenta de nuevo." };
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

export async function advanceKitchenOrderService(
  token: string,
  uuid: string,
  expectedStatus: string,
  expectedAction: KitchenOrderAction,
) {
  const response = await fetch(`${URL_API_ORDER}/update/${uuid}/v2/status`, {
    method: HttpMethodsEnum.PUT,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": ContentTypeEnum.JSON,
    },
    body: JSON.stringify({ expectedStatus, expectedAction }),
  });
  const result = await response.json();
  if (!response.ok || result.error) {
    throw new Error(result.message ?? "No se pudo actualizar la comanda.");
  }
}

export const sendApplicationOrderAdd = async (
  token: string,
  uuid: string,
  payload: AddDishesRequest,
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
        waiter: payload.waiter,
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
  payload: EditDishesRequest,
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
        waiter: payload.waiter,
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

export const editPaymentInformationService = async (
  token: string,
  uuid: string,
  body: any,
) => {
  try {
    const headers = {
      method: HttpMethodsEnum.PUT,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        modifications: body.modifications,
      }),
    };
    const petition = await fetch(
      `${URL_API_ORDER}/update/${uuid}/payment-info`,
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

export const editPaymentInformationServiceV2 = async (
  token: string,
  uuid: string,
  payment: Payment,
) => {
  try {
    const headers = {
      method: HttpMethodsEnum.PUT,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        payment,
      }),
    };
    const petition = await fetch(
      `${URL_API_ORDER}/update/${uuid}/v2/payment-info`,
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
