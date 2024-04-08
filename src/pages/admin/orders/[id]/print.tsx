import { Analytics, track } from "@vercel/analytics/react";
import { IClientResponse } from "@/pages/api/directory/controllers/client";
import { listClientService } from "@/services/client";
import { editPaymentInformationService } from "@/services/order";
import { listUserSerive } from "@/services/users";
import { TDirectory } from "@/types/directory.types";
import { TResponseOrders } from "@/types/menu.types";
import { CLIENT, DEFAULT_TABLE_LLEVAR, ENV } from "@/utils/constants";
import {
  currencyFormat,
  formatDateTime,
  getActualDateDB,
  textToString,
} from "@/utils/formats";
import { TOKEN_ID } from "@/utils/strings";
import { realtimeDB } from "@firebase/config";
import { RT_ORDER_TABLE_NAME } from "@models/names";
import { Book, Edit, Print, Save } from "@mui/icons-material";
import { Box, Button, Modal, TextField } from "@mui/material";
import { getAuth, signInAnonymously } from "firebase/auth";
import { onValue, ref } from "firebase/database";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  ChangeEvent,
  use,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useReactToPrint } from "react-to-print";

enum EButtonActives {
  EFECTIVE = "EFECTIVO",
  DEBIT = "TARJETA DE DEBITO",
  CREDIT = "TARJETA DE CREDITO",
  VOUCHER = "VALES",
  COUTERSY = "CORTESIA",
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const PrintOrderPage = () => {
  const [information, setInformation] = useState<
    TResponseOrders & { creatAt: string }
  >();
  const [wainterName, setWainterName] = useState("");
  const [clientList, setClientList] = useState<Array<IClientResponse>>([]);
  const [selectedClients, setSelectedClient] = useState<Array<TDirectory>>([]);

  const [total, setTotal] = useState(0);
  const [subtotaly, setSubtotaly] = useState(0);
  const [iva, setIVA] = useState(0);
  //Form controller
  const [propine, setPropine] = useState("0");
  const [payWith, setPayWith] = useState("0");
  const [discount, setDiscount] = useState("0");
  const [shift, setShift] = useState(0);
  const [totalWithPay, setTotalWithPay] = useState(0);
  //Button controller
  const [payment, setPayment] = useState<EButtonActives>(
    EButtonActives.EFECTIVE,
  );
  //Save controller
  const [isSaved, setIsSaved] = useState(false);

  const { query } = useRouter();
  //Print controller
  const componentRef = useRef(null);
  //Add client controller
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const CLIENT_FILTER = (client: TDirectory) =>
    selectedClients.filter((selectedClient) => selectedClient !== client);
  //Calculate Funtion

  const getTotalPlusPropine = (
    totalAccount: number,
    paywith: number,
    propine: number,
    discount: number,
  ) => {
    const totalToPay = totalAccount + propine;
    const cambio = paywith + discount - totalToPay;
    const totalConDescuento = totalAccount - discount + propine;
    return { cambio, totalConDescuento };
  };

  //Handle functions
  const handlePrint = useReactToPrint({ content: () => componentRef.current });
  const handleChangePayment = (val: EButtonActives) => {
    if (val !== EButtonActives.EFECTIVE) {
      setTotalWithPay(0);
      setPayWith("");
      setShift(0);
      if (propine !== "") {
        const newVal = total - parseInt(discount) + parseInt(propine);
        setTotalWithPay(newVal);
      }
    }
    setPayment(val);
  };

  const handleChangePropine = (val: ChangeEvent<HTMLInputElement>) => {
    const value = val.target.value;
    if (value !== "") {
      const { cambio, totalConDescuento } = getTotalPlusPropine(
        total,
        parseInt(payWith),
        parseInt(value),
        parseInt(discount),
      );

      const shiftPay = cambio;
      const subtotal = totalConDescuento;
      setShift(shiftPay);
      setPropine(value);
      setTotalWithPay(subtotal);
    } else {
      const shiftPay = parseInt(payWith) + parseInt(discount) - total;
      const subtotal = parseInt(value) + total - parseInt(discount);
      setShift(shiftPay);
      setPropine(value);
      setTotalWithPay(subtotal);
    }
  };

  const handleChangeDiscount = (val: ChangeEvent<HTMLInputElement>) => {
    const value = val.target.value;
    if (value !== "") {
      const { cambio, totalConDescuento } = getTotalPlusPropine(
        total,
        parseInt(payWith),
        parseInt(propine),
        parseInt(value),
      );

      const shiftPay = cambio;
      const subtotal = totalConDescuento;
      setShift(shiftPay);
      setDiscount(value);
      setTotalWithPay(subtotal);
    } else {
      const shiftPay = parseInt(payWith) + parseInt(propine) - total;
      const subtotal = total + parseInt(propine) - parseInt(payWith);
      setShift(shiftPay);
      setDiscount(value);
      setTotalWithPay(subtotal);
    }
  };

  const handleChangePayWith = (val: ChangeEvent<HTMLInputElement>) => {
    const value = val.target.value;
    if (propine !== "") {
      const { cambio, totalConDescuento } = getTotalPlusPropine(
        total,
        parseInt(value),
        parseInt(propine),
        parseInt(discount),
      );

      const shiftPay = cambio;
      setShift(shiftPay);
      setPayWith(value);
      setTotalWithPay(totalConDescuento);
    } else {
      const shiftPay = parseInt(value) - total;
      setShift(shiftPay);
      setPayWith(value);
    }
  };

  const handleSavePaymentInfo = async () => {
    const token = sessionStorage.getItem(TOKEN_ID);
    const body = {
      modifications: {
        payWith: payWith,
        propine: propine,
        shift: shift,
        paymentType: payment,
        discount: discount,
      },
    };
    const save = await editPaymentInformationService(
      token || "",
      query.id as string,
      body,
    );
    if (save) {
      setIsSaved(true);
    }
  };

  const handleAddClient = async () => {
    setShowAddClientModal(!showAddClientModal);
  };

  // toogle function
  const toogleAddClientModal = () => {
    setShowAddClientModal(!showAddClientModal);
  };

  const getClientList = async () => {
    const token = sessionStorage.getItem(TOKEN_ID);
    if (token) {
      try {
        const client = await listClientService(token);
        setClientList(client);
      } catch {
        console.log("Error al obtener la información");
      }
    }
  };

  const handleCheckboxChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    client: TDirectory,
  ) => {
    if (event.target.checked) {
      setSelectedClient([...selectedClients, client]);
    } else {
      setSelectedClient(CLIENT_FILTER(client));
    }
  };

  useEffect(() => {
    const init = () => {
      track("SHOW-PRINT-ORDERS", { client: CLIENT, enviroment: ENV });
    };
    init();
    getClientList();
  }, []);
  //Initial charger
  const getWinterInformation = useCallback(async () => {
    const token = sessionStorage.getItem(TOKEN_ID);
    if (token !== null) {
      const wainters = await listUserSerive(token);
      const findWaint = wainters.filter(
        (itm: any) => itm.uuid === information?.waiter,
      );
      if (findWaint) {
        const wainter = findWaint[0];
        setWainterName(wainter?.name);
      }
    }
  }, [information?.waiter]);

  const init = useCallback(async () => {
    try {
      const id = query.id as string;
      if (id !== undefined) {
        const auth = getAuth();
        await signInAnonymously(auth);
        const date = getActualDateDB();
        const RT_DB = `${RT_ORDER_TABLE_NAME}/${date.year}/${date.month}/${date.day}`;
        const connection = ref(realtimeDB, RT_DB);
        return onValue(connection, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const select: TResponseOrders = data[id];
            const totaly = select?.dishesDescription.reduce(
              (prev, next) => prev + next.number * next.price,
              0,
            );
            const subTotal = totaly / 1.16;

            if (select.payWith !== undefined) {
              setPayWith(select.payWith.toString());
            }

            if (select.propine !== undefined) {
              setPropine(select.propine.toString());
            }

            if (select.shift !== undefined) {
              setShift(select.shift);
            }

            if (select.discount !== undefined) {
              setDiscount(select.discount.toString());
            }

            if (
              select.payWith !== undefined &&
              select.propine !== undefined &&
              select.paymentType !== undefined &&
              select.discount !== undefined
            ) {
              const totaly =
                parseFloat(total.toString()) +
                parseFloat(select.propine.toString()) -
                parseFloat(select.discount.toString());

              setPayment(select.paymentType);
              setTotalWithPay(totaly);
              setIsSaved(true);
            }

            setInformation(data[id]);
            setTotal(totaly);
            setSubtotaly(subTotal);
            setIVA(totaly - subTotal);
          }
        });
      }
    } catch (e) {
      console.error("Error al cargar la información:", e);
    }
  }, [query, total]);

  useEffect(() => {
    getWinterInformation();
    init();
  }, [query, information?.waiter, total]);

  useEffect(() => {
    init();
  }, []);

  if (information === undefined) {
    return (
      <div className='min-w-[1100px] min-h-[590px] flex justify-center items-center font-primary text-[1.3rem]'>
        <span className='loader mr-4'></span> Cargando Infomración
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Imprimir ticket</title>
      </Head>
      <div className='flex flex-row'>
        <div className='basis-1/2'>
          <div className='p-2'>
            <p className='font-secondary'>Forma de pago</p>
            <div className='flex flex-row'>
              <Button
                className={`${
                  payment === EButtonActives.EFECTIVE
                    ? "!bg-aqua !text-white"
                    : ""
                } !mr-2 !text-[0.75rem]`}
                onClick={() => handleChangePayment(EButtonActives.EFECTIVE)}
                disabled={isSaved}
              >
                Efectivo
              </Button>
              <Button
                className={`${
                  payment === EButtonActives.DEBIT ? "!bg-aqua !text-white" : ""
                } !mr-2 !text-[0.75rem]`}
                onClick={() => handleChangePayment(EButtonActives.DEBIT)}
                disabled={isSaved}
              >
                Tarjeta de debito
              </Button>
              <Button
                className={`${
                  payment === EButtonActives.CREDIT
                    ? "!bg-aqua !text-white"
                    : ""
                } !mr-2 !text-[0.75rem]`}
                onClick={() => handleChangePayment(EButtonActives.CREDIT)}
                disabled={isSaved}
              >
                Tarjeta de credito
              </Button>
              <Button
                className={`${
                  payment === EButtonActives.VOUCHER
                    ? "!bg-aqua !text-white"
                    : ""
                } !mr-2 !text-[0.75rem]`}
                onClick={() => handleChangePayment(EButtonActives.VOUCHER)}
                disabled={isSaved}
              >
                Vales
              </Button>
              <Button
                className={`${
                  payment === EButtonActives.COUTERSY
                    ? "!bg-aqua !text-white"
                    : ""
                } !mr-2 !text-[0.75rem]`}
                onClick={() => handleChangePayment(EButtonActives.COUTERSY)}
                disabled={isSaved}
              >
                Cortesia
              </Button>
            </div>
            <p className='font-secondary'>Infomración de pago</p>
            <div className='flex flex-col py-4'>
              <div className='mb-2 w-full'>
                <TextField
                  label='Total a pagar'
                  className='w-full'
                  value={currencyFormat(total)}
                  disabled
                />
              </div>
              {payment === EButtonActives.EFECTIVE && (
                <div className='mb-2 w-full'>
                  <TextField
                    label='Pago con'
                    className='w-full'
                    value={payWith}
                    onChange={handleChangePayWith}
                    type='number'
                    disabled={isSaved}
                  />
                </div>
              )}
              <div className='mb-2 w-full'>
                <TextField
                  label='Propina'
                  className='w-full'
                  value={propine}
                  onChange={handleChangePropine}
                  type='number'
                  disabled={isSaved}
                />
              </div>
              <div className='mb-2 w-full'>
                <TextField
                  label='Descuento'
                  className='w-full'
                  value={discount}
                  onChange={handleChangeDiscount}
                  type='number'
                  disabled={isSaved}
                />
              </div>
              <TextField
                label='Total a pagar + Propina'
                value={currencyFormat(totalWithPay || total)}
                disabled
              />
              {payment === EButtonActives.EFECTIVE && (
                <div className='mt-2 w-full'>
                  <TextField
                    label='Cambio'
                    className='w-full'
                    value={currencyFormat(shift || 0)}
                    disabled
                  />
                </div>
              )}
              <button
                onClick={handleSavePaymentInfo}
                className='bg-aqua text-white font-secondary p-2 mt-4 disabled:bg-gray'
                disabled={isSaved}
              >
                <Save /> GUARDAR
              </button>
              <button
                onClick={handlePrint}
                className='bg-blue text-white font-secondary p-2 mt-4'
              >
                <Print /> IMPRIMIR
              </button>
              <button
                onClick={handleAddClient}
                className='bg-green-600 text-white font-secondary p-2 mt-4'
              >
                <Book /> CLIENTE
              </button>
            </div>
          </div>
        </div>
        <div ref={componentRef} className='basis-1/2 mb-4 px-4'>
          <div className='flex items-center justify-center'>
            <Image
              src={"/logo_con_fondo.png"}
              width={100}
              height={100}
              alt='Image logo'
            />
          </div>
          <p className='font-primary font-bold text-center mb-2 print-title'>
            MARIS QUERIDA
          </p>
          <p className='font-secondary mb-2 text-center print-text'>
            Valle del vístula esquina Valle de Oaxaca. Valle de Aragon 2da Secc,
            57100 Nezahualcóyotl, Méx., Mexico City, Mexico
          </p>
          <hr className='my-2' />
          <table className='w-full'>
            <tr>
              <td className='print-text-small'>Fecha y hora de entrada:</td>
              <td className='print-text-small text-right'>
                {formatDateTime(information?.creatAt || "")}
              </td>
            </tr>
            <tr>
              <td className='print-text-small'>Mesero:</td>
              <td className='print-text-small text-right'>{wainterName}</td>
            </tr>
            <tr>
              <td className='print-text-small'>Mesa:</td>
              <td className='print-text-small text-right'>
                {information?.tableNumber === DEFAULT_TABLE_LLEVAR
                  ? "PARA LLEVAR"
                  : "MESA " + information.tableNumber}
              </td>
            </tr>
            {information?.tableNumber === DEFAULT_TABLE_LLEVAR && (
              <tr>
                <td className='print-text-small'>Cliente:</td>
                <td className='print-text-small text-right'>
                  {information.name}
                </td>
              </tr>
            )}
          </table>
          <table className='w-full'>
            {selectedClients?.length !== 0 && (
              <thead className='w-full'>
                <tr>
                  <td className='print-text-small'>Cliente:</td>
                  <td className='print-text-small text-right'>
                    {selectedClients[0].name}
                  </td>
                </tr>
                <tr>
                  <td className='print-text-small'>Dirección:</td>
                  <td className='print-text-small text-right'>
                    {selectedClients[0].adress}
                  </td>
                </tr>
                <tr>
                  <td className='print-text-small'>Telefono:</td>
                  <td className='print-text-small text-right'>
                    {selectedClients[0].phone}
                  </td>
                </tr>
              </thead>
            )}
          </table>
          <hr className='my-2' />
          <table className='w-full'>
            <thead>
              <tr>
                <td className='font-bold print-text'>Cant.</td>
                <td className='font-bold print-text'>Descripción</td>
                <td className='font-bold print-text text-left'>Importe</td>
              </tr>
            </thead>
            <tbody>
              {information?.dishesDescription !== undefined ? (
                information?.dishesDescription.map((itm) => (
                  <tr
                    className={`font-secondary print-text ${
                      itm.number === 0 ? "no-print" : ""
                    }} `}
                  >
                    <td className={itm.number === 0 ? "no-print" : ""}>
                      {itm.number}
                    </td>
                    <td className={itm.number === 0 ? "no-print" : ""}>
                      {itm.name}
                    </td>
                    <td className={itm.number === 0 ? "no-print" : "text-left"}>
                      {currencyFormat(itm.price * itm.number)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td></td>
                </tr>
              )}
            </tbody>
          </table>
          <hr className='my-2' />
          <table className='w-full'>
            <tr>
              <td className='print-text-small'>SUBTOTAL:</td>
              <td className='print-text-small text-right'>
                {currencyFormat(subtotaly || 0)}
              </td>
            </tr>
            <tr>
              <td className='print-text-small'>IVA:</td>
              <td className='print-text-small text-right'>
                {currencyFormat(iva || 0)}
              </td>
            </tr>
            <tr>
              <td className='print-text-small'>TOTAL:</td>
              <td className='print-text-small text-right'>
                {currencyFormat(total || 0)}
              </td>
            </tr>
          </table>
          {isSaved && payment === EButtonActives.EFECTIVE && (
            <div className='flex flex-col'>
              <hr />
              <p className='font-bold text-center my-2 print-text'>
                FORMA DE PAGO: {payment}
              </p>
              <hr />
              <table>
                {discount !== "0" && discount !== "" && (
                  <>
                    <tr>
                      <td className='font-bold text-left print-text-small'>
                        (-)Descuento:
                      </td>
                      <td className='text-right print-text-small'>
                        -{currencyFormat(parseInt(discount))}
                      </td>
                    </tr>
                    <tr>
                      <td className='font-bold text-left print-text-small'>
                        Total - Desc:
                      </td>
                      <td className='text-right print-text-small'>
                        {currencyFormat(total - parseInt(discount))}
                      </td>
                    </tr>
                  </>
                )}
                <tr>
                  <td className='font-bold text-left print-text-small'>
                    (+)Propina:
                  </td>
                  <td className='text-right print-text-small'>
                    {currencyFormat(parseInt(propine || "0"))}
                  </td>
                </tr>
                <tr>
                  <td className='font-bold text-left print-text-small'>
                    Gran Total:
                  </td>
                  <td className='text-right print-text-small'>
                    {currencyFormat(totalWithPay)}
                  </td>
                </tr>
                <tr>
                  <td className='font-bold text-left print-text-small'>
                    Pago con:
                  </td>
                  <td className='text-right print-text-small'>
                    {currencyFormat(parseInt(payWith))}
                  </td>
                </tr>
                <tr>
                  <td className='font-bold text-left print-text-small'>
                    Cambio:
                  </td>
                  <td className='text-right print-text-small'>
                    {currencyFormat(shift)}
                  </td>
                </tr>
              </table>
              <div className='font-secondary text-[1.25rem] w-full my-2 print-text'>
                {textToString(totalWithPay)} pesos
              </div>
            </div>
          )}
          {isSaved && payment !== EButtonActives.EFECTIVE && (
            <div className='flex flex-col'>
              <hr />
              <p className='font-bold text-center my-2 print-text'>
                FORMA DE PAGO: {payment}
              </p>
              <hr />
              <table>
                {discount !== "0" && discount !== "" && (
                  <>
                    <tr>
                      <td className='font-bold text-left print-text-small'>
                        (-)Descuento:
                      </td>
                      <td className='text-right print-text-small'>
                        -{currencyFormat(parseInt(discount))}
                      </td>
                    </tr>
                    <tr>
                      <td className='font-bold text-left print-text-small'>
                        Total - Desc:
                      </td>
                      <td className='text-right print-text-small'>
                        {currencyFormat(total - parseInt(discount))}
                      </td>
                    </tr>
                  </>
                )}
                <tr>
                  <td className='font-bold text-left print-text-small'>
                    (+)Propina:
                  </td>
                  <td className='text-right print-text-small'>
                    {currencyFormat(parseInt(propine || "0"))}
                  </td>
                </tr>
                <tr>
                  <td className='font-bold text-left print-text-small'>
                    Gran Total:
                  </td>
                  <td className='text-right print-text-small'>
                    {currencyFormat(totalWithPay)}
                  </td>
                </tr>
              </table>
              <div className='font-secondary text-[1.25rem] w-full my-2 print-text'>
                {textToString(totalWithPay)} pesos
              </div>
            </div>
          )}
        </div>
        <Modal open={showAddClientModal} onClose={toogleAddClientModal}>
          <Box sx={style}>
            <div>
              <div className='flex felx-col bg-blue p-4'>
                <div className='flex items-center font-secondary font-bold text-white  basis-1/4'>
                  Nombre
                </div>
                <div className='flex items-center font-secondary font-bold text-white  basis-1/4'>
                  Direccion
                </div>
                <div className='flex items-center font-secondary font-bold text-white  basis-1/4'>
                  Telefono
                </div>
                <div className='flex items-center font-secondary font-bold text-white  basis-1/4'>
                  Acciones
                </div>
              </div>
              <div>
                {clientList.map((itm, ind) => (
                  <div
                    className={`flex flex-row  ${
                      ind % 2 === 0 ? "bg-enabled-dark" : "bg-enabled-light"
                    } divide-x divide-slate-400`}
                  >
                    <div className='font-secondary basis-1/4 flex items-center p-2'>
                      {itm.name}
                    </div>
                    <div className='font-secondary basis-1/4 flex items-center p-2'>
                      {itm.adress}
                    </div>
                    <div className='font-secondary basis-1/4 flex items-center p-2'>
                      {itm.phone}
                    </div>
                    <div className='font-secondary basis-1/4 flex justify-center p-2'>
                      <input
                        type='checkbox'
                        onChange={(event) => handleCheckboxChange(event, itm)}
                        checked={selectedClients.includes(itm)}
                      ></input>
                    </div>
                  </div>
                ))}
              </div>
              <div className='flex justify-end pt-2'>
                <button
                  onClick={toogleAddClientModal}
                  className='bg-danger text-white font-secondary p-2 rounded-lg'
                >
                  CERRAR
                </button>
              </div>
            </div>
          </Box>
        </Modal>
        <Analytics />
      </div>
    </>
  );
};

export default PrintOrderPage;
