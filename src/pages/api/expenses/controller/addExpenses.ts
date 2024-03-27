import { TExpenses } from "@/types/expenses.types";
import { ExpensesEnum } from "./enum/expenses.enum";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { firestore } from "@firebase/config";
import { DB_EXPENSES } from "@models/names";
import { v4 as uuidv4 } from "uuid";

export const addExpenses = async (
  collection: ExpensesEnum,
  expensesPayload: TExpenses,
) => {
  try {
    const expensRef = doc(firestore, DB_EXPENSES, collection);
    const expensCollection = await getDoc(expensRef);
    const uuid = uuidv4();
    if (expensCollection.exists()) {
      const expensData = expensCollection.data();
      const expensItems: Array<TExpenses> = expensData.data;
      const expensPayload: TExpenses = {
        name: expensesPayload.name,
        price: expensesPayload.price,
        uuid,
      };
      expensItems.push(expensPayload);
      const payload = {
        data: expensItems,
      };
      await updateDoc(expensRef, payload);
      return true;
    } else {
      const expensPayload: TExpenses = {
        name: expensesPayload.name,
        price: expensesPayload.price,
        uuid,
      };
      const payload = {
        data: [expensPayload],
      };
      await setDoc(expensRef, payload);
      return true;
    }
  } catch (e) {
    console.log("Error al añadir gasto:", e);
    return false;
  }
};
