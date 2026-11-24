import { Payment } from "@/components/admin/paymentForm/types";
import { OrdersDishesStatus } from "@/enums/orders.enum";
import { StatusApplicationEnum, StatusEnum } from "@/enums/states.enum";
import { TResponseOrders } from "@/types/menu.types";
import { isDishSent } from "@/utils/kitchenOrder";
import { getActualDateDB } from "@/utils/formats";
import { firestore, realtimeDB } from "@firebase/config";
import { DB_ORDERS_APPLICATION, RT_ORDER_TABLE_NAME } from "@models/names";
import { getAuth, signInAnonymously } from "firebase/auth";
import { child, get, ref, runTransaction, update } from "firebase/database";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { isDeepStrictEqual } from "node:util";
import type { EditDishesRequest } from "../../types/Order/order.type";

const dailyOrdersPath = () =>
  `${RT_ORDER_TABLE_NAME}/${getActualDateDB().fullDate}`;

export const updateStatusOrder = async (
  status: StatusEnum,
  orderUUID: string,
) => {
  try {
    const auth = getAuth();
    await signInAnonymously(auth);
    const orderRef = ref(realtimeDB, `${dailyOrdersPath()}/${orderUUID}`);
    const result = await runTransaction(
      orderRef,
      (order: TResponseOrders | null) => {
        if (!order || order.uuid !== orderUUID) return order;
        if (status !== StatusEnum.ORDER_READY) return { ...order, status };
        return {
          ...order,
          status,
          dishesDescription: (order.dishesDescription ?? []).map((dish) => ({
            ...dish,
            status: OrdersDishesStatus.READY,
          })),
        };
      },
      { applyLocally: false },
    );
    if (result.committed && result.snapshot.child("uuid").val() === orderUUID) {
      if (status === StatusEnum.ORDER_READY) {
        await changeStatusRequestEditionForOrderId(
          StatusApplicationEnum.CLOSE,
          orderUUID,
        );
      }
      return { error: false, message: "Datos actualizados correctamente" };
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
    const docRef = ref(realtimeDB, dailyOrdersPath());
    const getOrders = await get(child(docRef, orderUUIID));
    if (getOrders.exists()) {
      const newData = {
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
  { originalDishes, dishesDescription }: EditDishesRequest["modifications"],
) => {
  await signInAnonymously(getAuth());
  const orderRef = ref(realtimeDB, `${dailyOrdersPath()}/${orderId}`);
  const timestamp = new Date().toString();
  let applied = false;

  const result = await runTransaction(
    orderRef,
    (order: TResponseOrders | null) => {
      applied = false;
      if (!order || order.uuid !== orderId) return order;

      const currentDishes = order.dishesDescription ?? [];
      // Apply field edits to their original lines and keep dish identity and status.
      const editedDishes = originalDishes.map((dish, index) => {
        if (!isDishSent(dish.status)) return dish;
        const { name, number, price } = dishesDescription[index];
        return { ...dish, name, number, price };
      });
      if (isDeepStrictEqual(currentDishes, editedDishes)) {
        applied = true;
        return order;
      }
      if (
        order.status === StatusEnum.CLOSED ||
        order.status === StatusEnum.CANCELED ||
        !isDeepStrictEqual(currentDishes, originalDishes)
      )
        return order;

      applied = true;
      return {
        ...order,
        dishesDescription: editedDishes,
        dishes: editedDishes.reduce(
          (total, dish) => total + (Number(dish.number) || 0),
          0,
        ),
        status: StatusEnum.EDITED,
        updateAt: timestamp,
      };
    },
    { applyLocally: false },
  );

  if (!result.committed) throw new Error("La transacción no se confirmó");
  return applied;
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
    discount: number;
  },
) => {
  try {
    const auth = getAuth();
    await signInAnonymously(auth);
    const docRef = ref(realtimeDB, dailyOrdersPath());
    const getOrders = await get(child(docRef, orderId));
    if (getOrders.exists()) {
      const newData = {
        payWith: paymentInformation.payWith,
        propine: paymentInformation.propine,
        shift: paymentInformation.shift,
        paymentType: paymentInformation.paymentType,
        discount: paymentInformation.discount,
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

export const updateInformationPaymentV2 = async (
  orderId: string,
  payment: Payment,
) => {
  try {
    const auth = getAuth();
    await signInAnonymously(auth);
    const docRef = ref(realtimeDB, dailyOrdersPath());
    const getOrders = await get(child(docRef, orderId));
    if (getOrders.exists()) {
      const newData = {
        payment,
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
