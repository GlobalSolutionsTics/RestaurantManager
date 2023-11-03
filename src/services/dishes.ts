import { ContentTypeEnum } from "@/enums/contentType.enum";
import { HttpMethodsEnum, HttpStatusEnum } from "@/enums/http.enum";
import { DishesEnum } from "@/pages/api/menu/controller/enum/dishes.enum";
import { TCatalog } from "@/types/catalog.types";
import { TMenuResponse } from "@/types/menu.types";
import { URL_API_MENU } from "@/utils/urls";

export const getCategories = async () => {
  try {
    const petition = await fetch(
      `${URL_API_MENU}/list/${DishesEnum.CATEGORIES}`,
    );
    const response: Array<TCatalog> = await petition.json();
    return response;
  } catch (e) {
    console.log(e);
  }
};

export const getDishService = async (id: string) => {
  try {
    const petition = await fetch(`${URL_API_MENU}/list/${id}`);
    const response: Array<TMenuResponse> = await petition.json();
    return response;
  } catch (e) {
    console.log(e);
  }
};

export const createDishService = async (payload: any) => {
  try {
    const header = {
      method: HttpMethodsEnum.POST,
      body: JSON.stringify(payload),
      "Content-Type": ContentTypeEnum.JSON,
    };
    const petition = await fetch(`${URL_API_MENU}/add`, header);
    if (petition.status === HttpStatusEnum.OK) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log("Error al añadir el platillo:", e);
  }
};

export const createCategoryService = async (payload: any) => {
  try {
    const header = {
      method: HttpMethodsEnum.POST,
      body: JSON.stringify(payload),
      "Content-Type": ContentTypeEnum.JSON,
    };
    const petition = await fetch(`${URL_API_MENU}/addCategory`, header);
    if (petition.status === HttpStatusEnum.OK) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log("Error al añadir el platillo:", e);
  }
};
