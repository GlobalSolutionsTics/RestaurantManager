import { Delete } from "@mui/icons-material";
import {
  Button,
  FormControl,
  InputLabel,
  Modal,
  OutlinedInput,
} from "@mui/material";
import { useState } from "react";

type Props = {
  isOpen: boolean;
  formik: any;
  isLoading: boolean;
  onClose: () => void;
};

const ModalDeleteInventaryProduct = ({
  isOpen,
  isLoading,
  onClose,
  formik,
}: Props) => {
  const [nameValue, setNameValue] = useState("");

  const handleChange = (e: any) => {
    const value = e.target.value;
    setNameValue(value);
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className='bg-white w-[400px] h-auto rounded-lg fixed top-[calc(50vh_-_130px)] left-[calc(50vw_-_200px)] shadow-lg p-4'>
        <p className='font-primary text-medium text-blue-dark text-center'>
          <Delete className='!mr-2' fontSize='large' />
          Eliminar producto
        </p>
        <p className='font-secondary text-small text-steel-70 text-left'>
          Para eliminar el producto por favor escriba la siguiente frase
        </p>
        <p className='font-secondary text-small text-steel-70 text-left'>
          <b>{formik.values.name}</b>
        </p>
        <p className='font-secondary text-small text-steel-70 text-left'>
          En el siguiente input correspondiente
        </p>
        <form onSubmit={formik.handleSubmit} className='flex flex-col !mt-4'>
          <FormControl>
            <InputLabel htmlFor='outline-input-name'>
              Clave de validación
            </InputLabel>
            <OutlinedInput
              id='outline-input-name'
              name='name'
              label='Nombre del producto'
              className='rounded-lg'
              type='text'
              value={nameValue}
              onChange={handleChange}
              onBlur={handleChange}
            />
          </FormControl>
          <Button
            className='!mt-4 !bg-blue !text-white hover:!bg-blue-dark disabled:!bg-steel-70 disabled:!text-steel-20'
            type='submit'
            disabled={isLoading || formik.values.name !== nameValue}
          >
            {isLoading ? (
              <>
                <span className='loader-spin'></span> Eliminando
              </>
            ) : (
              <>Eliminar</>
            )}
          </Button>
        </form>
      </div>
    </Modal>
  );
};
export default ModalDeleteInventaryProduct;
