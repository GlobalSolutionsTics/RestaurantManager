import { TInventoryProduct } from "@/pages/api/types/product.type";
import fetchRequest from "./request.controller";
import { URL_API_INVENTARY } from "@/utils/urls";

export const createInventaryProductService = async (
  token: string,
  payload: TInventoryProduct,
) => {
  try {
    const petition = await fetchRequest(token).post(URL_API_INVENTARY, payload);
    if (petition) return true;
    return false;
  } catch (e) {
    console.error("Error en la peticion IPX0002:", e);
    return false;
  }
};

export const getAllInventaryProductService = async (token: string) => {
  try {
    const petition: any = await fetchRequest(token).get(URL_API_INVENTARY);
    if (petition) {
      const dataFilter = petition.data.filter(
        (itm: any) => itm.isDeleted === false,
      );
      return dataFilter;
    }
    return false;
  } catch (e) {
    console.error("Error en la peticion IPX0001:", e);
    return false;
  }
};

export const updateInventaryProductService = async (
  token: string,
  payload: TInventoryProduct,
) => {
  try {
    const petition = await fetchRequest(token).put(URL_API_INVENTARY, payload);
    if (petition) return true;
    return false;
  } catch (e) {
    console.error("Error en la peticion IPX0003:", e);
    return false;
  }
};

export const deleteInventaryProductService = async (
  token: string,
  payload: { uuid: string | undefined; type: string },
) => {
  try {
    const petition = await fetchRequest(token).delete(
      URL_API_INVENTARY,
      payload,
    );
    if (petition) return true;
    return false;
  } catch (e) {
    console.error("Error en la peticion IPX0004:", e);
    return false;
  }
};
