import { Modal } from "@mui/material";
import { Props } from "./types";
import { Book, Print, Save } from "@mui/icons-material";
import ModalOptions from "@/components/ModalOptions";
import { useState } from "react";

export const PaymentButtons = ({
  disabledSave,
  onAddClient,
  onPrint,
  onSave,
}: Props) => {
  const [showModal, setShowModal] = useState(false);
  const toggleConfirm = () => setShowModal((state) => !state);

  const _onSave = async () => {
    await onSave();
    toggleConfirm();
  };
  return (
    <div className='px-2'>
      <div className='p-2 bg-aqua mb-4 text-white'>
        <p className='font-secondary'>Información de pago</p>
      </div>
      <div className='flex flex-row justify-between mb-4'>
        <button
          onClick={toggleConfirm}
          className='bg-aqua text-white font-secondary p-2 disabled:bg-gray'
          disabled={disabledSave}
        >
          <Save /> GUARDAR
        </button>
        <button
          onClick={onPrint}
          className='bg-blue text-white font-secondary p-2 '
        >
          <Print /> IMPRIMIR
        </button>
        <button
          onClick={onAddClient}
          className='bg-green-600 text-white font-secondary p-2 '
        >
          <Book /> CLIENTE
        </button>
        <ModalOptions
          description='No podrá realizar cambios despues de guardar'
          title='¿Esta seguro de guardar?'
          show={showModal}
          onAccept={_onSave}
          onCancel={toggleConfirm}
        />
      </div>
    </div>
  );
};
