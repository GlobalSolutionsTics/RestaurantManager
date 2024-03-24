import { EMeasurementProducts } from "@/enums/measurement.enum";
import { Add } from "@mui/icons-material";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
} from "@mui/material";

type Props = {
  isOpen: boolean;
  formik: any;
  isLoading: boolean;
  onClose: () => void;
};

const ModalCreateInventaryProduct = ({
  isOpen,
  isLoading,
  onClose,
  formik,
}: Props) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className='bg-white w-[400px] h-auto rounded-lg fixed top-[calc(50vh_-_230px)] left-[calc(50vw_-_200px)] shadow-lg p-4'>
        <p className='font-primary text-medium text-blue-dark text-center'>
          <Add className='!mr-2' fontSize='large' />
          Añadir nuevo producto
        </p>
        <p className='font-secondary text-small text-steel-70 text-left'>
          Añade un nuevo producto, podrás usarlo para las recetas o mantener de
          forma manual el inventario
        </p>
        <form onSubmit={formik.handleSubmit} className='flex flex-col !mt-6'>
          <FormControl>
            <InputLabel htmlFor='outline-input-name'>
              Nombre del producto
            </InputLabel>
            <OutlinedInput
              id='outline-input-name'
              name='name'
              label='Nombre del producto'
              className='rounded-lg'
              type='text'
              value={formik.values.name}
              onChange={formik.handleChange("name")}
              onBlur={formik.handleBlur("name")}
            />
          </FormControl>
          <FormControl className='!mt-4'>
            <InputLabel htmlFor='outline-input-cant'>
              Cantidad de producto
            </InputLabel>
            <OutlinedInput
              id='outline-input-cant'
              name='cant'
              label='Nombre del producto'
              className='rounded-lg'
              type='text'
              value={formik.values.cant}
              onChange={formik.handleChange("cant")}
              onBlur={formik.handleBlur("cant")}
            />
          </FormControl>
          <FormControl className='!mt-4'>
            <InputLabel htmlFor='outline-input-cant'>
              Tipo de gramaje
            </InputLabel>
            <Select
              id='outline-input-cant'
              name='cant'
              label='Tipo de gramaje'
              className='rounded-lg'
              type='text'
              value={formik.values.measurement}
              onChange={formik.handleChange("measurement") as any}
              onBlur={formik.handleBlur("measurement")}
            >
              <MenuItem value={EMeasurementProducts.GR} className='capitalize'>
                {EMeasurementProducts.GR}
              </MenuItem>
              <MenuItem value={EMeasurementProducts.KG} className='capitalize'>
                {EMeasurementProducts.KG}
              </MenuItem>
              <MenuItem value={EMeasurementProducts.ML} className='capitalize'>
                {EMeasurementProducts.ML}
              </MenuItem>
              <MenuItem value={EMeasurementProducts.LT} className='capitalize'>
                {EMeasurementProducts.LT}
              </MenuItem>
              <MenuItem value={EMeasurementProducts.PZ} className='capitalize'>
                {EMeasurementProducts.PZ}
              </MenuItem>
              <MenuItem value={EMeasurementProducts.U} className='capitalize'>
                {EMeasurementProducts.U}
              </MenuItem>
            </Select>
          </FormControl>
          <Button
            className='!mt-4 !bg-blue !text-white hover:!bg-blue-dark disabled:!bg-steel-70 disabled:!text-steel-20'
            type='submit'
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className='loader-spin'></span> Agregando
              </>
            ) : (
              <>Agregar producto</>
            )}
          </Button>
        </form>
      </div>
    </Modal>
  );
};
export default ModalCreateInventaryProduct;
