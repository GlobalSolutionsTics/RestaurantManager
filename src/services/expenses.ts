import { ContentTypeEnum } from "@/enums/contentType.enum";
import { HttpMethodsEnum, HttpStatusEnum } from "@/enums/http.enum";
import { ExpensesEnum } from "@/pages/api/expenses/controller/enum/expenses.enum";
import { TCatalog } from "@/types/catalog.types";
import { TExpenses } from "@/types/expenses.types";
import { URL_API_EXPENSES } from "@/utils/urls";

export const getExpCategories = async () => {
  try {
    const petition = await fetch(
      `${URL_API_EXPENSES}/list/${ExpensesEnum.CATEGORIES}`,
    );
    const response: Array<TCatalog> = await petition.json();
    return response;
  } catch (e) {
    console.log(e);
  }
};

export const createCategoryService = async (payload: any) => {
  try {
    const header = {
      method: HttpMethodsEnum.POST,
      body: JSON.stringify(payload),
      "Conent-Type": ContentTypeEnum.JSON,
    };
    const petition = await fetch(`${URL_API_EXPENSES}/addExpenses`, header);
    if (petition.status === HttpStatusEnum.OK) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log("Error al añadir el platillo:", e);
    return false;
  }
};

export const getExpensesService = async (id: string) => {
  try {
    const petition = await fetch(`${URL_API_EXPENSES}/list/${id}`);
    const response: Array<TExpenses> = await petition.json();
    return response;
  } catch (e) {
    console.log(e);
  }
};

export const createExpensesService = async (payload: any) => {
  try {
    const header = {
      method: HttpMethodsEnum.POST,
      body: JSON.stringify(payload),
      "Content-Type": ContentTypeEnum.JSON,
    };
    const petition = await fetch(`${URL_API_EXPENSES}/add`, header);
    if (petition.status === HttpStatusEnum.OK) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log("Error al añadir el gasto");
  }
};

export const updateExpensesInformation = async (
  payload: any,
  token: string | null,
) => {
  try {
    const header = {
      method: HttpMethodsEnum.PUT,
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": ContentTypeEnum.JSON,
        Authorization: `Bearer ${token}`,
      },
    };
    const petition = await fetch(`${URL_API_EXPENSES}/update`, header);
    if (petition.status === HttpStatusEnum.CREATE) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log("Error al añadir el gasto", e);
    return false;
  }
};
