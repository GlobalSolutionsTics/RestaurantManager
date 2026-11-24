import { getCategories, getDishService } from "@/services/dishes";
import { TCatalog } from "@/types/catalog.types";
import { TMenuResponse } from "@/types/menu.types";
import { useCallback, useEffect, useState } from "react";

export const useDishes = () => {
  const [categories, setCategories] = useState<Array<TCatalog>>([]);
  const [searcherItems, setSearcherItems] = useState<Array<TMenuResponse>>([]);

  const getAllDishes = async (categories: TCatalog[]) => {
    const responses = await Promise.all(
      categories.map(({ id }) => getDishService(id)),
    );
    setSearcherItems(responses.flatMap((dishes) => dishes ?? []));
  };

  const getAllCategories = useCallback(async () => {
    const obtainCategories = await getCategories();
    if (obtainCategories) {
      setCategories(obtainCategories);
      getAllDishes(obtainCategories);
    }
  }, []);

  useEffect(() => {
    void getAllCategories();
  }, [getAllCategories]);

  return {
    categories,
    searcherItems,
    getAllCategories,
  };
};
