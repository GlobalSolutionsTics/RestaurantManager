import { createOrder } from "@/services/order";
import {
  setCreateDishSelection,
  setCreateOrderNotes,
  setCreateIdOrderRDX,
  setCreateSubmissionKeyRDX,
} from "@/store/slices/create.order.slice";
import { RootRedux } from "@/store/store";
import { DEFAULT_TABLE_LLEVAR } from "@/utils/constants";
import {
  separateVariablePriceUnits,
  trimDishNote,
} from "@/utils/orderDishNotes";
import { getActualDateDB } from "@/utils/formats";
import { useRouter } from "next/router";
import { ChangeEvent, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { v4 as uuidv4 } from "uuid";

const MessageComponent = withReactContent(Swal);

export const useFinishOrder = () => {
  const sending = useRef(false);
  const [loading, setLoading] = useState(false);
  const [nameClient, setNameClient] = useState("");
  const [diners, setDiners] = useState<number | string>(1);

  const { push } = useRouter();
  const orderStore = useSelector((store: RootRedux) => store.orderCreate);
  const dispatch = useDispatch();
  const userStore = useSelector((store: RootRedux) => store.user);

  const reviewedDishes = separateVariablePriceUnits(
    orderStore.dishesDescription,
  );
  const changeDish = (index: number, changes: { price: number }) => {
    if (
      changes.price !== undefined &&
      (!Number.isFinite(changes.price) || changes.price < 0)
    )
      return;
    dispatch(
      setCreateDishSelection(
        reviewedDishes.map((dish, position) =>
          index === position ? { ...dish, ...changes } : dish,
        ),
      ),
    );
  };

  const handleChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    const value: string = event.target.value;
    setNameClient(value);
  };

  const handleChangeDiners = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value !== "") {
      const value = Number(event.target.value);
      if (!isNaN(value)) {
        setDiners(value);
      }
    } else {
      setDiners("");
    }
  };

  const handleSendOrder = async () => {
    if (sending.current) return;
    sending.current = true;
    setLoading(true);

    try {
      const submissionKey =
        orderStore.submissionKey ?? `${getActualDateDB().fullDate}:${uuidv4()}`;
      if (!orderStore.submissionKey) {
        dispatch(setCreateSubmissionKeyRDX(submissionKey));
      }
      const nameOrder =
        orderStore.tableNumber === DEFAULT_TABLE_LLEVAR
          ? nameClient
          : orderStore.name;

      const payload = {
        name: nameOrder,
        dishes: orderStore.dishes,
        tableNumber: orderStore.tableNumber,
        dishesDescription: reviewedDishes.map(trimDishNote),
        waiter: userStore.uuid,
        ...(diners !== "" && { diners }),
        ...(orderStore.notes?.trim() && { notes: orderStore.notes.trim() }),
      };
      const { error, message } = await createOrder(payload, submissionKey);
      if (!error) {
        dispatch(setCreateIdOrderRDX(message));
        await push("/orders/qrcodePage");
      } else {
        MessageComponent.fire({
          icon: "error",
          title: "Ocurrio un error",
          text: message,
          confirmButtonText: "Entendido",
          showLoaderOnConfirm: false,
          showLoaderOnDeny: false,
        });
      }
    } finally {
      sending.current = false;
      setLoading(false);
    }
  };

  return {
    loading,
    orderStore,
    nameClient,
    diners,
    changeDish,
    reviewedDishes,
    changeNotes: (notes: string) => dispatch(setCreateOrderNotes(notes)),
    updateDishes: (dishes: typeof reviewedDishes) =>
      dispatch(setCreateDishSelection(dishes)),
    handleChangeName,
    handleSendOrder,
    handleChangeDiners,
  };
};
