import { Modal } from "@mui/material";
import { ModalOptionsProps } from "./types";

const ModalOptions = ({
  description,
  onAccept,
  onCancel,
  title,
  show,
}: ModalOptionsProps) => {
  return (
    <Modal open={show} className='flex flex-col items-center justify-center'>
      <div className='bg-white min-w-[300px]  rounded-lg flex flex-col'>
        <div className='typography-primary px-4 py-2 bg-blue rounded-t-lg'>
          {title}
        </div>
        <div className='typography-secondary-bold p-4'>{description}</div>
        <div className='px-4 pb-4 flex flex-row justify-between'>
          <button className='button-secondary' onClick={onCancel}>
            Cancelar
          </button>
          <button className='button-primary' onClick={onAccept}>
            Aceptar
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalOptions;
