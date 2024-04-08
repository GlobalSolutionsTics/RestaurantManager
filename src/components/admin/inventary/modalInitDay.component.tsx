import TableTitleComponent from "@/components/table-title.component";
import { EMeasurementProducts } from "@/enums/measurement.enum";
import { Add, Search } from "@mui/icons-material";
import {
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
} from "@mui/material";
import { useState } from "react";

type Props = {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
};

const ModalInitialiceDayInventary = ({ isOpen, isLoading, onClose }: Props) => {
  const [productSearch, setProductsSearch] = useState<string>("");

  const handleChangeSearch = (e: any) => {
    const value = e.target.value;
    setProductsSearch(value);
  };
  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className='bg-white w-[60%] h-[70%] rounded-lg fixed top-[calc(50vh_-_35%)] left-[calc(50vw_-_30%)] shadow-lg p-4'>
        <p className='font-primary text-medium text-blue-dark text-left'>
          ¿Estas seguro de que deseas iniciar el día con el inventario actual?
        </p>
        <p className='font-secondary text-small text-steel-70 text-left !mb-2'>
          Verifica correctamente la información ya que una vez iniciado no
          podras editar la información solo al finalizar
        </p>
        <div className='flex flex-col'>
          <FormControl className='w-full !mb-2'>
            <InputLabel htmlFor='input-search' className='!bg-white !px-2'>
              Buscar Producto
            </InputLabel>
            <OutlinedInput
              id='input-search'
              className='w-full'
              value={productSearch}
              onChange={handleChangeSearch}
              endAdornment={
                <InputAdornment position='end'>
                  <Search />
                </InputAdornment>
              }
            />
          </FormControl>
          <TableTitleComponent
            titles={["Nombre", "Cantidad", "Tipo de gramaje"]}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ModalInitialiceDayInventary;
