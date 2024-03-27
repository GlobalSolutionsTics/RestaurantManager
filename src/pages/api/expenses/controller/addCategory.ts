import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { ExpensesEnum } from "./enum/expenses.enum";
import { TCatalog } from "@/types/catalog.types";
import { firestore } from "@firebase/config";
import { DB_EXPENSES } from "@models/names";

export const addCategory = async (
  collection: ExpensesEnum,
  category: TCatalog,
) => {
  try {
    const expensRef = doc(firestore, DB_EXPENSES, collection);
    const expensCollection = await getDoc(expensRef);
    if (expensCollection.exists()) {
      const expensData = expensCollection.data();
      const expensItems: Array<TCatalog> = expensData.data;
      const expensPayload: TCatalog = {
        id: category.id,
        value: category.value,
      };
      expensItems.push(expensPayload);
      const payload = {
        data: expensItems,
      };
      await updateDoc(expensRef, payload);
      return true;
    } else {
      const expensPayload: TCatalog = {
        id: category.id,
        value: category.value,
      };
      const payload = {
        data: [expensPayload],
      };
      await setDoc(expensRef, payload);
      return true;
    }
  } catch (e) {
    console.log("Error al añadir gasto", e);
    return false;
  }
};
