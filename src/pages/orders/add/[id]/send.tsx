import ProtectPage from "@/pages/admin/components/protectPage";
import { sendApplicationOrderAdd } from "@/services/order";
import { useOrderForEditing } from "@/hooks/Orders/useOrderForEditing";
import { clearAdditionDraft } from "@/store/slices/orders.slice";
import type { RootRedux } from "@/store/store";
import { IUserRedux } from "@/store/slices/user.slice";
import { TMenuResponse } from "@/types/menu.types";
import { DEFAULT_TABLE_LLEVAR } from "@/utils/constants";
import { TOKEN_ID } from "@/utils/strings";
import { CHECKS } from "@/utils/users";
import { ArrowBack, Check, Edit, RoomService, Send } from "@mui/icons-material";
import { Alert, TextField } from "@mui/material";
import { useFormik } from "formik";
import Head from "next/head";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

type TDish = TMenuResponse & { number?: number; image?: string };
type TDishesDescription = Array<TDish>;

const MessageComponent = withReactContent(Swal);

type Props = {
  name: string;
  dishesNumber: number;
  price: number;
  index: number;
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

type AdditionDraft = RootRedux["ordersDishes"]["additionDraft"];

const OrderForm = ({
  orderId,
  draft,
}: {
  orderId: string;
  draft: AdditionDraft;
}) => {
  const router = useRouter();
  const order = useOrderForEditing(orderId);
  const sending = useRef(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [editedDraft, setEditedDraft] = useState<{
    id: string;
    dishes: TDishesDescription;
  }>();
  const userStore: IUserRedux = useSelector((store: RootRedux) => store.user);
  const dispatch = useDispatch();
  const dishes =
    editedDraft && editedDraft.id === draft?.submissionId
      ? editedDraft.dishes
      : draft?.dishes ?? [];
  const repeatedDishNames = Array.from(
    new Set(
      dishes
        .filter(
          (dish) =>
            order?.dishesDescription?.some(
              (existing) =>
                existing.uuid === dish.uuid &&
                existing.name === dish.name &&
                existing.price === dish.price &&
                existing.type === dish.type,
            ),
        )
        .map((dish) => dish.name),
    ),
  );
  const tableNumber = order?.tableNumber;

  const onChangeDish = (
    name: string,
    number: number,
    price: number,
    index: number,
  ) => {
    if (!draft) return;
    setEditedDraft({
      id: draft.submissionId,
      dishes: dishes.map((dish, position) =>
        position === index ? { ...dish, name, price, number } : dish,
      ),
    });
  };

  const sendOrder = async () => {
    const token = sessionStorage.getItem(TOKEN_ID);
    if (!order || !token || !dishes.length || sending.current || sent || !draft)
      return;

    sending.current = true;
    setLoading(true);
    try {
      const response = await sendApplicationOrderAdd(token, orderId, {
        modifications: {
          dishesDescription: dishes,
          orderUUID: orderId,
          submissionId: draft.submissionId,
        },
        waiter: userStore.uuid,
      });

      if (response) {
        setSent(true);
        dispatch(clearAdditionDraft(draft.submissionId));
        void MessageComponent.fire({
          icon: "success",
          title: "Platillos enviados",
          confirmButtonText: "Finalizar",
          preConfirm: () => router.push("/orders/myOrders"),
        });
      } else {
        void MessageComponent.fire({
          icon: "error",
          title: "No se pudo actualizar la orden",
          text: "Puedes volver a intentar el mismo envío.",
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
        <title>Añadir platillos</title>
      </Head>
      <div className='w-full fixed z-30 bg-white'>
        <div className='font-primary text-[1.5rem] p-4 flex flex-row'>
          <div className='basis-1/5'>
            <button onClick={router.back}>
              <ArrowBack fontSize='large' />
            </button>
          </div>
          <div className='basis-2/5 flex items-center font-bold'>
            <RoomService fontSize='large' className='mr-4' />
            {tableNumber === DEFAULT_TABLE_LLEVAR && <>Para llevar</>}
            {tableNumber !== DEFAULT_TABLE_LLEVAR && <>Mesa {tableNumber}</>}
          </div>
          <div className='!text-[0.75rem] !font-bold basis-2/5'>
            <p className='text-center'>Estatus:</p>
            <p className='text-center'>{order?.status}</p>
          </div>
        </div>
        <h1 className='bg-enabled px-2 py-2 font-secondary font-bold'>
          Platillos que vas a añadir
        </h1>
        <div className='flex flex-row bg-enabled px-2'>
          <div className='basis-4/6'>Descripción</div>
          <div className='basis-1/6'>Cantidad</div>
          <div className='basis-1/6'></div>
        </div>
        <div className='flex flex-col bg-enabled'>
          {dishes.map((itm, idx) => (
            <FieldEditedOption
              key={`${draft?.submissionId}-${idx}`}
              index={idx}
              name={itm.name}
              price={itm.price}
              dishesNumber={itm.number || 0}
              onChange={onChangeDish}
            />
          ))}
        </div>
        {!sent && repeatedDishNames.length > 0 && (
          <Alert severity='info' role='status' className='m-2'>
            {repeatedDishNames.length === 1
              ? `El platillo «${repeatedDishNames[0]}» ya está en el pedido.`
              : `Ya están en el pedido: ${repeatedDishNames.join(", ")}.`}{" "}
            Al enviar, las unidades nuevas se sumarán a los pendientes.
          </Alert>
        )}
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
          <Send className='mr-6' /> Enviar adición
        </button>
      )}
    </ProtectPage>
  );
};

export default function OrderPage() {
  const { query } = useRouter();
  const storedDraft = useSelector(
    (store: RootRedux) => store.ordersDishes.additionDraft,
  );
  if (typeof query.id !== "string") return null;
  const draft = storedDraft?.orderId === query.id ? storedDraft : undefined;
  return <OrderForm key={query.id} draft={draft} orderId={query.id} />;
}
