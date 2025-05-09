import { getActualDateDB } from "@/utils/formats";
import { RT_ORDER_TABLE_NAME } from "@models/names";
import { getAuth, signInAnonymously } from "firebase/auth";
import {
  child,
  DatabaseReference,
  get,
  getDatabase,
  ref,
} from "firebase/database";
import { generateFormatedDateForBD, processOrderForFS } from "../utils";
import { DbFormatDate } from "../types";
import { Order } from "@/ui/financial/type";
import { StatusEnum } from "@/enums/states.enum";

export const getAllOrdersFS = async () => {
  try {
    const auth = getAuth();
    await signInAnonymously(auth);
    const dbRef = ref(getDatabase());
    const date = getActualDateDB();
    return getOrderForDate(date, dbRef);
  } catch (e) {
    console.log("Error:", e);
  }
};

export const getOrdersByDate = async (iniitalDate: Date, endDate: Date) => {
  try {
    const auth = getAuth();
    await signInAnonymously(auth);
    const dbRef = ref(getDatabase());
    const dates = generateFormatedDateForBD(iniitalDate, endDate);
    const information = [];
    for (let i = 0; i < dates.length; i++) {
      const data = await getOrderForDate(dates[i], dbRef);
      const dataProcessed: Order[] = processOrderForFS(data);
      const dataFilter = dataProcessed.filter(
        (order) => order.status === StatusEnum.CLOSED,
      );
      const info = {
        date: dates[i].fullDate,
        data: dataFilter,
      };
      information.push(info);
    }
    return information;
  } catch (e) {
    console.error("Error in getOrdersByDate:", e);
  }
};

const getOrderForDate = async (
  date: DbFormatDate,
  dbRef: DatabaseReference,
) => {
  const DB_RT =
    RT_ORDER_TABLE_NAME + "/" + date.year + "/" + date.month + "/" + date.day;
  const getData = await get(child(dbRef, DB_RT));
  if (getData.exists()) {
    return getData.val();
  } else {
    console.log("No existe la base");
    return [];
  }
};
