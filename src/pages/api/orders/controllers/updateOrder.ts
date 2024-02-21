import { OrdersDishesStatus } from "@/enums/orders.enum";
import { StatusApplicationEnum, StatusEnum } from "@/enums/states.enum";
import { TResponseOrders } from "@/types/menu.types";
import { getActualDateDB } from "@/utils/formats";
import { firestore, realtimeDB } from "@firebase/config";
import { DB_ORDERS_APPLICATION, RT_ORDER_TABLE_NAME } from "@models/names";
import { getAuth, signInAnonymously } from "firebase/auth";
import { child, get, ref, update } from "firebase/database";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const date = getActualDateDB();
const DB_RT =
  RT_ORDER_TABLE_NAME + "/" + date.year + "/" + date.month + "/" + date.day;

export const updateStatusOrder = async (
  status: StatusEnum,
  orderUUID: string,
) => {
  try {
    const auth = getAuth();
    await signInAnonymously(auth);
    const docRef = ref(realtimeDB, DB_RT);
    const getOrders = await get(child(docRef, orderUUID));
    if (getOrders.exists()) {
      if (status !== StatusEnum.ORDER_READY) {
        const data: TResponseOrders = getOrders.val();
        const newData = { ...data, status };
        await update(child(docRef, orderUUID), newData);
        return { error: false, message: "Datos actualizados correctamente" };
      } else {
        const data: TResponseOrders = getOrders.val();
        const newDishes = data.dishesDescription.map((itm) => ({
          ...itm,
          status: OrdersDishesStatus.READY,
        }));
        const newData = { ...data, status, dishesDescription: newDishes };
        await changeStatusRequestEditionForOrderId(
          StatusApplicationEnum.CLOSE,
          orderUUID,
        );
        await update(child(docRef, orderUUID), newData);
        return { error: false, message: "Datos actualizados correctamente" };
      }
    }

    return { error: true, message: "Error al actualizar el estatus" };
  } catch (e) {
    console.log("Error:", e);
    return { error: true, message: "Error en los servicios de google" };
  }
};

export const acceptEditOrderService = async (
  orderUUIID: string,
  applicationId: string,
  payload: any,
) => {
  try {
    const auth = getAuth();
    await signInAnonymously(auth);
    const docRef = ref(realtimeDB, DB_RT);
    const getOrders = await get(child(docRef, orderUUIID));
    if (getOrders.exists()) {
      const data: Array<TResponseOrders> = getOrders.val();
      const newData = {
        ...data,
        dishes: payload.dishes,
        dishesDescription: payload.dishesDescription,
        status: StatusEnum.EDITED,
      };
      await changeRequestedEdition(applicationId, StatusApplicationEnum.ACTIVE);
      await update(child(docRef, orderUUIID), newData);
      return { error: false, message: "Datos actualizados correctamente" };
    }

    return { error: true, message: "Error al actualizar el estatus" };
  } catch (e) {
    console.log("Error:", e);
    return { error: true, message: "Error en los servicios de google" };
  }
};

export const changeRequestedEdition = async (
  applicationId: string,
  status: string,
) => {
  const listRef = doc(firestore, DB_ORDERS_APPLICATION, "activas");
  const collections = await getDoc(listRef);
  if (collections.exists()) {
    const collection = collections.data();
    const requestedEdition = collection.data;
    const newElement = requestedEdition.map((itm: any) => {
      if (itm.uuid === applicationId) {
        return { ...itm, applicationStatus: status };
      }
      return itm;
    });
    const payload = {
      data: newElement,
    };
    await updateDoc(listRef, payload);
  }
};

export const changeStatusRequestEditionForOrderId = async (
  status: string,
  uuidOrder: string,
) => {
  const listRef = doc(firestore, DB_ORDERS_APPLICATION, "activas");
  const collections = await getDoc(listRef);
  if (collections.exists()) {
    const collection = collections.data();
    const requestedEdition = collection.data;
    const findElement = requestedEdition.find(
      (itm: any) => itm.modifications.orderUUID === uuidOrder,
    );
    if (findElement === undefined) {
      return false;
    }
    const applicationId = findElement.uuid;
    await changeRequestedEdition(applicationId, status);
  }
};

export const updateDishesAndNumber = async (
  orderId: string,
  dishesDescription: Array<any>,
) => {
  try {
    const auth = getAuth();
    await signInAnonymously(auth);
    const docRef = ref(realtimeDB, DB_RT);
    const getOrders = await get(child(docRef, orderId));
    if (getOrders.exists()) {
      const data: Array<TResponseOrders> = getOrders.val();
      const newData = {
        ...data,
        dishes: dishesDescription.length,
        dishesDescription: dishesDescription,
        status: StatusEnum.EDITED,
      };
      await update(child(docRef, orderId), newData);
      return { error: false, message: "Datos actualizados correctamente" };
    }

    return { error: true, message: "Error al actualizar el estatus" };
  } catch (e) {
    console.log("Error:", e);
    return { error: true, message: "Error en los servicios de google" };
  }
};

enum EButtonActives {
  EFECTIVE = "EFECTIVO",
  DEBIT = "TARJETA DE DEBITO",
  CREDIT = "TARJETA DE CREDITO",
  VOUCHER = "VALES",
  COUTERSY = "CORTESIA",
}

export const updateInformationPayment = async (
  orderId: string,
  paymentInformation: {
    payWith: number;
    propine: number;
    shift: number;
    paymentType: EButtonActives;
  },
) => {
  try {
    const auth = getAuth();
    await signInAnonymously(auth);
    const docRef = ref(realtimeDB, DB_RT);
    const getOrders = await get(child(docRef, orderId));
    if (getOrders.exists()) {
      const data: Array<TResponseOrders> = getOrders.val();
      const newData = {
        ...data,
        payWith: paymentInformation.payWith,
        propine: paymentInformation.propine,
        shift: paymentInformation.shift,
        paymentType: paymentInformation.paymentType,
      };
      await update(child(docRef, orderId), newData);
      return { error: false, message: "Datos actualizados correctamente" };
    }

    return { error: true, message: "Error al actualizar el estatus" };
  } catch (e) {
    console.log("Error:", e);
    return { error: true, message: "Error en los servicios de google" };
  }
};
