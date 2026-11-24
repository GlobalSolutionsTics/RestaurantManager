import { listConfigurationService } from "@/services/config";
import { createOrder } from "@/services/order";
import {
  setCreateDishesDescriptionRDX,
  setCreateIdOrderRDX,
  setCreateSubmissionKeyRDX,
  setCreateTableRDX,
} from "@/store/slices/create.order.slice";
import { RootRedux } from "@/store/store";
import { TConifg } from "@/types/configuration.types";
import { TMenuResponse } from "@/types/menu.types";
import { DEFAULT_TABLE_LLEVAR } from "@/utils/constants";
import { getActualDateDB } from "@/utils/formats";
import { TOKEN_ID } from "@/utils/strings";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { v4 as uuidv4 } from "uuid";

const MessageComponent = withReactContent(Swal);

export const useFinishOrder = () => {
  const sending = useRef(false);
  const [loading, setLoading] = useState(false);
  const [kitchenList, setKitchen] = useState([]);
  const [nameClient, setNameClient] = useState("");
  const [diners, setDiners] = useState<number | string>(1);

  const { push } = useRouter();
  const orderStore = useSelector((store: RootRedux) => store.orderCreate);
  const dispatch = useDispatch();
  const userStore = useSelector((store: any) => store.user);

  //Handlers
  const handleChangeTable = (e: any) => {
    const val = parseInt(e.target.value);
    dispatch(setCreateTableRDX(val));
  };

  //Area para los servicios
  const getConfigurationInfo = async () => {
    const token = sessionStorage.getItem(TOKEN_ID);
    setLoading(true);
    if (token) {
      const petition: TConifg = await listConfigurationService(token);
      const list: any = new Array(petition.tablesActives).fill(0);
      setKitchen(list);
    } else {
      push("/admin");
    }
    setLoading(false);
  };

  const onChangeDish = (
    name: string,
    dishNumber: number,
    price: number,
    uuid: string,
  ) => {
    const dishesDescription: Array<TMenuResponse> =
      orderStore.dishesDescription;

    const newDish = dishesDescription.map((itm) => {
      if (itm.uuid === uuid) {
        return { ...itm, name: name, price: price, number: dishNumber };
      }
      return itm;
    });
    dispatch(setCreateDishesDescriptionRDX(newDish));
  };
  //Handle functions
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
        dishesDescription: orderStore.dishesDescription,
        waiter: userStore.uuid,
        ...(diners !== "" && { diners }),
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

  useEffect(() => {
    getConfigurationInfo();
  }, []);

  return {
    loading,
    kitchenList,
    orderStore,
    nameClient,
    diners,
    handleChangeTable,
    onChangeDish,
    handleChangeName,
    handleSendOrder,
    handleChangeDiners,
  };
};
