import { doc, getDoc } from "firebase/firestore";
import { ExpensesEnum } from "./enum/expenses.enum";
import { firestore } from "@firebase/config";
import { DB_EXPENSES } from "@models/names";
import { TResponseCollection } from "@/types/expenses.types";

export const getExpenses = async (collection: ExpensesEnum) => {
  const expensRef = doc(firestore, DB_EXPENSES, collection);
  const expensCollection = await getDoc(expensRef);
  if (expensCollection.exists()) {
    const collection = expensCollection.data() as TResponseCollection;
    const menu = collection.data;
    return menu;
  } else {
    return false;
  }
};
