import { getCategories, getDishService } from "@/services/dishes";
import { TCatalog } from "@/types/catalog.types";
import { TMenuResponse } from "@/types/menu.types";
import { useCallback, useEffect, useState } from "react";

export const useDishes = () => {
  const [categories, setCategories] = useState<Array<TCatalog>>([]);
  const [searcherItems, setSearcherItems] = useState<Array<TMenuResponse>>([]);

  const getAllDishes = async (categories: TCatalog[]) => {
    let dishesForCategory: Array<any> = [];
    const promises = [];
    for (let a = 0; a < categories.length; a++) {
      const promise = await getDishService(categories[a].id);
      promises.push(promise);
    }
    const responses = await Promise.all(promises);
    if (responses) {
      responses.map((itm) => {
        dishesForCategory = dishesForCategory.concat(itm);
        return itm;
      });
      setSearcherItems(dishesForCategory);
    }
  };

  const getAllCategories = useCallback(async () => {
    const obtainCategories = await getCategories();
    if (obtainCategories) {
      setCategories(obtainCategories);
      getAllDishes(obtainCategories);
    }
  }, []);

  useEffect(() => {
    getAllCategories();
  }, []);

  return {
    categories,
    searcherItems,
    getAllCategories,
  };
};
