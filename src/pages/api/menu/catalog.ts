import { DishesEnum } from "./controller/enum/dishes.enum";
import type {
  DishCatalogCategory,
  TResponseCollection,
} from "@/types/menu.types";
import type { TCatalog } from "@/types/catalog.types";
import { firestore } from "@firebase/config";
import { DB_DISHES } from "@models/names";
import { collection, getDocs } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ message: "Método no permitido." });
  }

  try {
    const snapshot = await getDocs(collection(firestore, DB_DISHES));
    const documents = new Map(
      snapshot.docs.map((document) => [document.id, document.data()]),
    );
    const categories: TCatalog[] =
      documents.get(DishesEnum.CATEGORIES)?.data ?? [];
    const data: DishCatalogCategory[] = categories.map((category) => ({
      ...category,
      dishes:
        (documents.get(category.id) as TResponseCollection | undefined)?.data ??
        [],
    }));
    return res.status(200).json({ data });
  } catch (error) {
    console.error("No se pudo obtener el catálogo de platillos:", error);
    return res
      .status(500)
      .json({ message: "No se pudo cargar el catálogo de platillos." });
  }
}
