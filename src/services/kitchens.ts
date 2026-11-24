import { HttpMethodsEnum } from "@/enums/http.enum";
import type { KitchenType } from "@/types/kitchen.types";
import { TOKEN_ID } from "@/utils/strings";

async function requestKitchens<T>(
  method: HttpMethodsEnum,
  payload?: Partial<KitchenType>,
): Promise<T> {
  const token = sessionStorage.getItem(TOKEN_ID);
  if (!token) throw new Error("Inicia sesión para administrar las cocinas.");

  const response = await fetch("/api/kitchens/catalog", {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(
      result.message ?? "No se pudo completar la operación de cocinas.",
    );
  }
  return result.data;
}

export const listKitchens = () =>
  requestKitchens<KitchenType[]>(HttpMethodsEnum.GET);

export const createKitchen = (name: string) =>
  requestKitchens<KitchenType>(HttpMethodsEnum.POST, { name });

export const updateKitchen = (kitchen: KitchenType) =>
  requestKitchens<KitchenType>(HttpMethodsEnum.PUT, kitchen);

export const deleteKitchen = (id: string) =>
  requestKitchens<Pick<KitchenType, "id">>(HttpMethodsEnum.DELETE, { id });
