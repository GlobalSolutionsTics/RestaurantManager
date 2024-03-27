import { TExpenses } from "@/types/expenses.types";
import { firestore } from "@firebase/config";
import { DB_EXPENSES } from "@models/names";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export const deleteExpenses = async (uuid: string) => {
  const expensRef = doc(firestore, DB_EXPENSES, "activos");
  const expensCollection = await getDoc(expensRef);
  if (expensCollection.exists()) {
    const expensData = expensCollection.data();
    const expenses = expensData.data as Array<TExpenses>;
    const find = expenses.findIndex((itm) => itm.uuid === uuid);
    if (find !== -1) {
      expenses.splice(find, 1);
      const payload = { data: expenses };
      await updateDoc(expensRef, payload);
      return { error: false, message: "Gasto eliminado" };
    } else {
      return { error: true, message: "Error al eliminar gasto" };
    }
  } else {
    return { error: true, message: "No se encuentra el gasto" };
  }
};
