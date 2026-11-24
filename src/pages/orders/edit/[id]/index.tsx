import { isDishFinished, isDishSent } from "@/utils/kitchenOrder";
import ProtectPage from "@/pages/admin/components/protectPage";
import { sendApplicationOrderEdit } from "@/services/order";
import { useOrderForEditing } from "@/hooks/Orders/useOrderForEditing";
import type { RootRedux } from "@/store/store";
import { IUserRedux } from "@/store/slices/user.slice";
import type { DishesWithOrder } from "@/pages/api/types/Order/order.type";
import { DEFAULT_TABLE_LLEVAR } from "@/utils/constants";
import { TOKEN_ID } from "@/utils/strings";
import { CHECKS } from "@/utils/users";
import { ArrowBack, Check, Edit, RoomService, Send } from "@mui/icons-material";
import { TextField } from "@mui/material";
import { useFormik } from "formik";
import Head from "next/head";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MessageComponent = withReactContent(Swal);

type Props = {
  name: string;
  dishesNumber: number;
  price: number;
  index: number;
  status: string;
  onChange: (
    name: string,
    quantity: number,
    price: number,
    index: number,
  ) => void;
  onOpen?: (val: any) => void;
};

const FieldEditedOption = ({
  name,
  dishesNumber,
  price,
  index,
  status,
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
    return onChange(values.name, values.dishesNumber, values.price, index);
  };

  return (
    <>
      <div
        className={`w-full flex justify-between ${
          isDishFinished(status) ? "bg-success" : "bg-enabled-dark"
        } bg-enabled-dark py-2 px-2 `}
      >
        <div
          className={`text-secondary text-[1rem] basis-4/6 ${
            isDishFinished(status) && "line-through"
          }`}
        >
          {formik.values.name}
        </div>
        <div
          className={`text-secondary text-[1rem] basis-1/6 ${
            isDishFinished(status) && "line-through"
          }`}
        >
          {formik.values.dishesNumber}
        </div>
        {isDishSent(status) ? (
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
        ) : (
          <div className='basis-1/6 flex justify-end'></div>
        )}
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

const OrderForm = ({ orderId }: { orderId: string }) => {
  const router = useRouter();
  const order = useOrderForEditing(orderId);
  const sending = useRef(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [editedDishes, setEditedDishes] = useState<DishesWithOrder[]>();
  const userStore: IUserRedux = useSelector((store: RootRedux) => store.user);
  const dishes = editedDishes ?? order?.dishesDescription ?? [];
  const tableNumber = order?.tableNumber;

  const onChangeDish = (
    name: string,
    number: number,
    price: number,
    index: number,
  ) => {
    setEditedDishes(
      dishes.map((dish, position) =>
        position === index ? { ...dish, name, price, number } : dish,
      ),
    );
  };

  const sendOrder = async () => {
    const token = sessionStorage.getItem(TOKEN_ID);
    if (!order || !token || !dishes.length || sending.current || sent) return;

    sending.current = true;
    setLoading(true);
    try {
      const response = await sendApplicationOrderEdit(token, orderId, {
        modifications: {
          dishesDescription: dishes,
          orderUUID: orderId,
          originalDishes: order.dishesDescription,
        },
        waiter: userStore.uuid,
      });

      if (response) {
        setSent(true);

        void MessageComponent.fire({
          icon: "success",
          title: "Orden modificada",
          confirmButtonText: "Finalizar",
          preConfirm: () => router.push("/orders/myOrders"),
        });
      } else {
        void MessageComponent.fire({
          icon: "error",
          title: "No se pudo actualizar la orden",
          text: "Revisa el pedido actualizado antes de volver a editarlo.",
          confirmButtonText: "Entendido",
        });
      }
    } finally {
      sending.current = false;
      setLoading(false);
    }
  };

  return (
    <ProtectPage push={router.push} requiredProfiles={CHECKS}>
      <Head>
        <title>Editar ordenes</title>
      </Head>
      <div className='font-primary text-[1.5rem] p-4 flex flex-row'>
        <div className='basis-1/5'>
          <button onClick={router.back}>
            <ArrowBack fontSize='large' />
          </button>
        </div>
        <div className='basis-2/5 flex items-center font-bold'>
          <RoomService fontSize='small' className='mr-4' />
          {tableNumber === DEFAULT_TABLE_LLEVAR
            ? "Para llevar"
            : "MESA " + tableNumber}
        </div>
        <div className='!text-[0.75rem] !font-bold basis-2/5'>
          <p className='text-center'>Estatus:</p>
          <p className='text-center'>{order?.status}</p>
        </div>
      </div>
      <div className='mb-[3rem]'>
        <div className='flex flex-col bg-enabled'>
          {dishes.map((itm, idx) => (
            <FieldEditedOption
              key={itm.uuid + "-" + idx}
              index={idx}
              name={itm.name}
              price={itm.price}
              dishesNumber={itm.number || 0}
              status={itm.status || ""}
              onChange={onChangeDish}
            />
          ))}
        </div>
      </div>
      {loading ? (
        <div className='flex items-center flex fixed bottom-0 z-20 px-4 py-2'>
          <span className='loader mr-4'></span> Enviando solicitud
        </div>
      ) : (
        <button
          className='w-full flex fixed bottom-0 z-20 bg-success text-white text-[1.5rem] itmes-center justify-center flex font-secondary py-2'
          onClick={sendOrder}
          disabled={!order || !dishes.length || sent}
        >
          <Send className='mr-6' /> Mandar solicitud
        </button>
      )}
    </ProtectPage>
  );
};

export default function OrderPage() {
  const { query } = useRouter();
  return typeof query.id === "string" ? (
    <OrderForm key={query.id} orderId={query.id} />
  ) : null;
}
