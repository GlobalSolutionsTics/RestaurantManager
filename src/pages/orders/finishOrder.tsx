import { createOrder } from "@/services/order";
import {
  IOrderSlice,
  setDishesDescriptionRedux,
  setOrderIdRedux,
  setTableOrder,
} from "@/store/slices/orders.slice";
import { TMenuResponse } from "@/types/menu.types";
import { Check, Edit } from "@mui/icons-material";
import { Select, TextField, TextareaAutosize } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { useFormik } from "formik";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { TConifg } from "@/types/configuration.types";
import { TOKEN_ID } from "@/utils/strings";
import { listConfigurationService } from "@/services/config";
import { DEFAULT_TABLE_LLEVAR } from "@/utils/constants";

const MessageComponent = withReactContent(Swal);

type Props = {
  name: string;
  dishesNumber: number;
  price: number;
  uuid: string;
  onChange: (a: any, b: any, c: any, d: any) => void;
  onOpen?: (val: any) => void;
};

const FieldEditedOption = ({
  name,
  dishesNumber,
  price,
  uuid,
  onChange,
  onOpen,
}: Props) => {
  const [editValues, setEditValues] = useState(false);
  const [initialPrice, setInitialPrice] = useState(price);

  const INITAL_VALUES = {
    name: name,
    dishesNumber: dishesNumber,
    price: price,
  };

  const toggleEdit = () => {
    if (onOpen) {
      if (editValues) {
        onOpen(false);
      } else {
        onOpen(true);
      }
    }
    setEditValues(!editValues);
  };

  const formik = useFormik({
    initialValues: INITAL_VALUES,
    onSubmit: () => {},
  });

  const handleChangeEdit = () => {
    const values = formik.values;
    toggleEdit();
    return onChange(values.name, values.dishesNumber, values.price, uuid);
  };

  return (
    <>
      <div className='w-full flex justify-between bg-enabled-dark py-2 px-2'>
        <div className='text-secondary text-[1rem] basis-4/6'>
          {formik.values.name}
        </div>
        <div className='basis-1/6'>{formik.values.dishesNumber}</div>
        <div className='basis-1/6 flex justify-end'>
          {editValues ? (
            <button onClick={handleChangeEdit}>
              <Check />
            </button>
          ) : (
            <button onClick={toggleEdit}>
              <Edit />
            </button>
          )}
        </div>
      </div>
      {editValues && (
        <div className='flex flex-col bg-enabled p-4'>
          <TextField
            className='text-secondary text-[1rem] w-full basis-4/6 !mb-4 bg-white'
            value={formik.values.name}
            onChange={formik.handleChange("name")}
            onBlur={formik.handleBlur("name")}
            variant='outlined'
            label='Platillo'
          />
          <TextField
            className='text-secondary text-[1rem] w-full basis-4/6 !mb-4 bg-white'
            value={formik.values.dishesNumber}
            onChange={formik.handleChange("dishesNumber")}
            onBlur={formik.handleBlur("dishesNumber")}
            variant='outlined'
            label='Cantidad'
            type='number'
            inputMode='numeric'
          />
          <TextField
            className='text-secondary text-[1rem] w-full basis-4/6 bg-white disabled:!bg-enabled disabled:!text-dark'
            value={formik.values.price}
            onChange={formik.handleChange("price")}
            onBlur={formik.handleBlur("price")}
            disabled={initialPrice !== 0}
            variant='outlined'
            label='Costo'
            type='number'
            inputMode='numeric'
          />
        </div>
      )}
    </>
  );
};

const FinishOrderPage = () => {
  const [loading, setLoading] = useState(false);
  const [kitchenList, setKitchen] = useState([]);

  const { push } = useRouter();
  const orderStore: IOrderSlice = useSelector(
    (store: any) => store.ordersDishes,
  );
  const dispatch = useDispatch();
  const userStore = useSelector((store: any) => store.user);

  //Handlers
  const handleChangeTable = (e: any) => {
    const val = parseInt(e.target.value);
    dispatch(setTableOrder(val));
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
    dispatch(setDishesDescriptionRedux(newDish));
  };
  //Handle functions
  const handleSendOrder = async () => {
    setLoading(true);
    const payload = {
      name: orderStore.name,
      dishes: orderStore.dishes,
      tableNumber: orderStore.tableNumber,
      dishesDescription: orderStore.dishesDescription,
      waiter: userStore.uuid,
    };
    const { error, message } = await createOrder(payload);
    if (!error) {
      dispatch(setOrderIdRedux(message));
      push("/orders/qrcodePage");
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
    setLoading(false);
  };

  useEffect(() => {
    getConfigurationInfo();
  }, []);

  return (
    <>
      <div className='w-full h-[100vh]'>
        <div className='bg-white top-0'>
          <div className='relative font-normal h-[120px] grid content-center w-screen px-10 bg-neutral-300'>
            <Image src={"/platillos/otros.jpg"} fill alt='' />
            <div className='absolute opacity-60 bg-black top-0 bottom-0 w-full'></div>
            <div className='absolute w-full top-0 bottom-0 flex flex-col py-4 px-6'>
              <p className='text-[2rem] text-white font-secondary'>
                Finalizar orden
              </p>
              <p className='text-[1.5rem] text-white font-primary'>
                Numero de platillos en la orden: {orderStore.dishes}
              </p>
            </div>
          </div>
        </div>
        <div className='w-full'>
          <div className='flex flex-col flex-start mx-8 my-4'>
            <span className='font-primary text-[1.5rem] mb-2'>
              Mesa que está atendiendo
            </span>
            <Select
              labelId='select-table-label'
              id='select-category'
              value={orderStore.tableNumber}
              label='Mesa #'
              onChange={handleChangeTable}
            >
              <MenuItem value={DEFAULT_TABLE_LLEVAR}>PARA LLEVAR</MenuItem>
              {kitchenList.map((itm, index) => (
                <MenuItem key={"ind-" + index} value={index + 1}>
                  {index + 1}
                </MenuItem>
              ))}
            </Select>
            <span className='font-primary text-[1.5rem] mb-2'>
              ¿Cuantos platillos van en la orden?
            </span>
            <div className='flex flex-col pb-4'>
              {orderStore.dishesDescription.map((itm, index) => (
                <FieldEditedOption
                  key={"id-" + index}
                  name={itm.name}
                  dishesNumber={itm.number || 0}
                  price={itm.price}
                  uuid={itm.uuid || ""}
                  onChange={onChangeDish}
                />
              ))}
            </div>
          </div>
        </div>
        {loading ? (
          <div className='flex items-center fixed bottom-0 p-4 text-[1.5rem]'>
            <span className='loader mr-4'></span> Enviando orden
          </div>
        ) : (
          <button
            className='text-[2rem] p-4 text-center w-full bg-success disabled:!bg-enabled disabled:!text-dark bottom-0 text-white font-primary font-bold'
            onClick={handleSendOrder}
            disabled={orderStore.dishesDescription.length === 0}
          >
            Enviar orden
          </button>
        )}
      </div>
    </>
  );
};

export default FinishOrderPage;
