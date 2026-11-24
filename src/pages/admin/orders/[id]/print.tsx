import { PaymentTicketComponent } from "@/components/PaymentTicketComponent";
import { Analytics } from "@vercel/analytics/react";
import { useWaiterName } from "@/components/waiter/useWaiterName";
import { TDirectory } from "@/types/directory.types";
import { Box, Modal } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { PaymentForm } from "@/components/admin/paymentForm";
import { PaymentButtons } from "@/components/admin/paymentButtons";
import { useOrderPrint } from "@/hooks/Orders/useOrderPrint";
import { useOrderAdminActions } from "@/hooks/Orders/useOrderAdminActions";

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
  const [selectedClients, setSelectedClient] = useState<Array<TDirectory>>([]);
  const { query } = useRouter();
  const { total, information, clientList, initializer } = useOrderPrint();
  const waiterName = useWaiterName(information?.waiter);
  const {
    handleChangePaymentInfo,
    handleSavePaymentInfo,
    isSaved,
    paymentInfo,
  } = useOrderAdminActions({ onReset: initializer, query });

  const componentRef = useRef<HTMLDivElement>(null);
  //Add client controller
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const CLIENT_FILTER = (client: TDirectory) =>
    selectedClients.filter((selectedClient) => selectedClient !== client);

  // toogle function
  const toogleAddClientModal = () => {
    setShowAddClientModal(!showAddClientModal);
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
  const handleAddClient = async () => {
    setShowAddClientModal(!showAddClientModal);
  };

  const handlePrint = useReactToPrint({ content: () => componentRef.current });

  if (information === undefined) {
    return (
      <div className='min-w-[1100px] min-h-[590px] flex justify-center items-center font-primary text-[1.3rem]'>
        <span className='loader mr-4'></span> Cargando Infomración
      </div>
    );
  }

  const DISABLED_SAVE = paymentInfo?.isIncomplete === true || isSaved;
  const IS_WITH_DISCOUNT =
    paymentInfo &&
    paymentInfo?.discount !== undefined &&
    paymentInfo?.discount !== 0;
  const SHOW_PAYMENT_INFO = information?.payment || isSaved;

  return (
    <>
      <Head>
        <title>Imprimir ticket</title>
      </Head>
      <div className='flex flex-row'>
        <div className='basis-1/2 overflow-y-auto overflow-x-hidden'>
          <PaymentButtons
            disabledSave={DISABLED_SAVE}
            onAddClient={handleAddClient}
            onPrint={handlePrint}
            onSave={handleSavePaymentInfo}
          />
          <PaymentForm
            total={total}
            onChange={handleChangePaymentInfo}
            paymentInfo={information?.payment}
          />
        </div>
        <PaymentTicketComponent
          ref={componentRef}
          information={information}
          total={total}
          waiterName={waiterName}
          selectedClients={selectedClients}
          showPaymentInfo={Boolean(SHOW_PAYMENT_INFO)}
          showDiscount={Boolean(IS_WITH_DISCOUNT)}
        />
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
                    key={itm.uuid}
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
