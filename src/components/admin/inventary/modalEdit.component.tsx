import { EMeasurementProducts } from "@/enums/measurement.enum";
import { formattingDateTime } from "@/utils/formats";
import { CheckCircle, Delete, Edit } from "@mui/icons-material";
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

const ModalEditInventaryProduct = ({
  isOpen,
  isLoading,
  onClose,
  formik,
}: Props) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className='bg-white w-[400px] h-auto rounded-lg fixed top-[calc(50vh_-_260px)] left-[calc(50vw_-_200px)] shadow-lg p-4'>
        <p className='font-primary text-medium text-blue-dark text-center'>
          <Edit className='mr-2' fontSize='large' />
          Editar producto
        </p>
        <form onSubmit={formik.handleSubmit} className='flex flex-col mt-2'>
          <div className='flex flex-row justify-start'>
            {formik.values.isDeleted ? (
              <div className='flex flex-row bg-danger text-white text-sm py-1 px-2 rounded-lg'>
                <Delete fontSize='small' /> Borrado
              </div>
            ) : (
              <div className='flex flex-row bg-success text-white text-sm py-1 px-2 rounded-lg'>
                <CheckCircle fontSize='small' /> Activo
              </div>
            )}
          </div>
          <p className='text-sm font-secondary mt-2'>ID PRODUCTO</p>
          <p className='text-sm font-secondary'>{formik.values.uuid}</p>
          <div className='flex flex-row mb-4 mt-2 font-secondary'>
            <div className='flex flex-col basis-1/2'>
              <p className='text-sm'>Fecha de creación</p>
              <p className='text-sm'>
                {formattingDateTime(formik.values.createAt)}
              </p>
            </div>
            <div className='flex flex-col basis-1/2'>
              <p className='text-sm text-right'>Fecha de última edición</p>
              <p className='text-sm text-right'>
                {formattingDateTime(formik.values.updateAt)}
              </p>
            </div>
          </div>
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
          <FormControl className='mt-4'>
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
          <FormControl className='mt-4'>
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
            className='mt-4 bg-blue text-white hover:bg-blue-dark disabled:bg-steel-70 disabled:text-steel-20'
            type='submit'
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className='loader-spin'></span> Actualizando información
              </>
            ) : (
              <>Editar producto</>
            )}
          </Button>
        </form>
      </div>
    </Modal>
  );
};
export default ModalEditInventaryProduct;
