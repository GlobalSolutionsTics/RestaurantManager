import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import MenuAdmin from "../components/menu";
import ProtectPage from "../components/protectPage";
import { ADMIN } from "@/utils/users";
import {
  Add,
  Delete,
  Edit,
  Inventory,
  PlayCircleFilled,
  Search,
} from "@mui/icons-material";
import { useState } from "react";
import { TInventoryProduct } from "@/pages/api/types/product.type";
import {
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { useFormik } from "formik";
import { EMeasurementProducts } from "@/enums/measurement.enum";
import ModalCreateInventaryProduct from "@/components/admin/inventary/modalCreate.component";
import {
  createInventaryProductService,
  deleteInventaryProductService,
  getAllInventaryProductService,
  updateInventaryProductService,
} from "@/services/inventary";
import { TOKEN_ID } from "@/utils/strings";
import Head from "next/head";
import ModalEditInventaryProduct from "@/components/admin/inventary/modalEdit.component";
import ModalDeleteInventaryProduct from "@/components/admin/inventary/modalDelete.component";

const MessageComponent = withReactContent(Swal);

export const getServerSideProps = async () => {
  const URL = process.env.NEXT_PUBLIC_URL_SERVICES + "/api/inventary";
  const petition = await fetch(URL);
  const response = await petition.json();
  const data: TInventoryProduct[] = response.data.filter(
    (itm: TInventoryProduct) => itm.isDeleted === false,
  );
  return {
    props: {
      products: data,
    },
  };
};

const InventoryPage = (ctx: any) => {
  const [initalValuesProduct, setInitialValuesProduct] = useState<
    TInventoryProduct & { action: string }
  >({
    name: "",
    cant: 0,
    measurement: EMeasurementProducts.GR,
    action: "create",
  });
  const [products, setProducts] = useState<TInventoryProduct[]>(ctx.products);
  const [productSearch, setProductSearch] = useState<string>("");
  const [productsFilters, setProductsFilter] = useState<TInventoryProduct[]>(
    ctx.products,
  );
  //Loader controll and modal controll
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpenCreate, setIsOpenCreate] = useState<boolean>(false);
  const [isOpenEdit, setIsOpenEdit] = useState<boolean>(false);
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);

  const router = useRouter();

  const handleGetAllProdcuts = async () => {
    const token = sessionStorage.getItem(TOKEN_ID);
    setIsLoading(true);
    if (token !== null) {
      const data = await getAllInventaryProductService(token);
      setProducts(data);
      setProductsFilter(data);
      formik.resetForm();
    }
    setIsLoading(false);
  };

  const handleResetFormik = () => {
    setInitialValuesProduct({
      name: "",
      cant: 0,
      measurement: EMeasurementProducts.GR,
      action: "create",
    });
  };

  //Handler actions

  const handleCreateProduct = async (
    payload: TInventoryProduct,
    token: string,
  ) => {
    const create = await createInventaryProductService(token, payload);
    if (create) {
      handleResetFormik();
      toggleCreateModal();
      handleGetAllProdcuts();
      MessageComponent.fire({
        icon: "success",
        title: "Producto Añadido",
        confirmButtonText: "Entendido",
        showLoaderOnConfirm: false,
        showLoaderOnDeny: false,
      });
    }
  };

  const handleEditProduct = async (
    payload: TInventoryProduct,
    token: string,
  ) => {
    const create = await updateInventaryProductService(token, payload);
    if (create) {
      handleResetFormik();
      toggleEditModal();
      handleGetAllProdcuts();
      MessageComponent.fire({
        icon: "success",
        title: "Producto actualizado",
        confirmButtonText: "Entendido",
        showLoaderOnConfirm: false,
        showLoaderOnDeny: false,
      });
    }
  };

  const handleDeleteProduct = async (
    payload: { uuid: string | undefined; type: string },
    token: string,
  ) => {
    const create = await deleteInventaryProductService(token, payload);
    if (create) {
      handleResetFormik();
      toggleDeleteModal();
      handleGetAllProdcuts();
      MessageComponent.fire({
        icon: "success",
        title: "Producto actualizado",
        confirmButtonText: "Entendido",
        showLoaderOnConfirm: false,
        showLoaderOnDeny: false,
      });
    }
  };

  const handleSubmit = async (e: TInventoryProduct & { action: string }) => {
    const token = sessionStorage.getItem(TOKEN_ID);
    setIsLoading(true);
    if (token !== null) {
      switch (e.action) {
        case "create":
          const payload = {
            name: e.name,
            cant: e.cant,
            measurement: e.measurement,
            type: "product",
          };
          await handleCreateProduct(payload, token);
          break;
        case "edit":
          const payloadEdit = {
            name: e.name,
            cant: e.cant,
            measurement: e.measurement,
            uuid: e.uuid,
            type: "product",
          };
          await handleEditProduct(payloadEdit, token);
          break;
        case "delete":
          const payloadDelete = {
            uuid: e.uuid,
            type: "product",
          };
          await handleDeleteProduct(payloadDelete, token);
          break;
      }
    }
    setIsLoading(false);
  };

  const handleChangeSearch = (e: any) => {
    const value = e.target.value;
    setProductSearch(value);
    const filter = products.filter((itm) =>
      itm.name.toLowerCase().includes(value.toLowerCase()),
    );
    setProductsFilter(filter);
  };

  const handleOpenEdit = (itm: TInventoryProduct) => {
    formik.setFieldValue("cant", itm.cant);
    formik.setFieldValue("createAt", itm.createAt);
    formik.setFieldValue("isDeleted", itm.isDeleted);
    formik.setFieldValue("measurement", itm.measurement);
    formik.setFieldValue("name", itm.name);
    formik.setFieldValue("updateAt", itm.updateAt);
    formik.setFieldValue("uuid", itm.uuid);
    formik.setFieldValue("action", "edit");
    toggleEditModal();
  };

  const handleOpenDelete = (itm: TInventoryProduct) => {
    formik.setFieldValue("cant", itm.cant);
    formik.setFieldValue("createAt", itm.createAt);
    formik.setFieldValue("isDeleted", itm.isDeleted);
    formik.setFieldValue("measurement", itm.measurement);
    formik.setFieldValue("name", itm.name);
    formik.setFieldValue("updateAt", itm.updateAt);
    formik.setFieldValue("uuid", itm.uuid);
    formik.setFieldValue("action", "delete");
    toggleDeleteModal();
  };

  const formik = useFormik({
    initialValues: initalValuesProduct,
    onSubmit: handleSubmit,
  });

  const toggleCreateModal = () => setIsOpenCreate(!isOpenCreate);
  const toggleDeleteModal = () => setIsOpenDelete(!isOpenDelete);
  const toggleEditModal = () => setIsOpenEdit(!isOpenEdit);

  return (
    <ProtectPage push={router.push} requiredProfiles={ADMIN}>
      <Head>
        <title>Administrador | Inventario de productos</title>
      </Head>
      <div className='flex flex-row'>
        <MenuAdmin basePath={router.pathname} router={router} />
        <div className='w-full p-4 flex flex-col'>
          <div className='flex flex-row justify-between items-center'>
            <div className='flex flex-col w-full'>
              <p className='flex flex-row font-primary text-[2rem] !text-blue-dark'>
                <Inventory fontSize='large' className='mr-2' />
                Inventario de tu negocio
              </p>
              <p className='font-secondary text-[1rem] !text-steel-70'>
                Aquí puedes meter los productos que ocupas para tu operación
                diaria, ¡Estos los puedes usar en el modulo de recetarios!
              </p>
            </div>
          </div>
          <div className='!py-4 flex flex-row w-full'>
            <div className='basis-1/2'>
              <FormControl className='w-full'>
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
            </div>
            <div className='flex flex-row justify-end items-center basis-1/2'>
              <Button
                className='!bg-blue !text-white hover:!bg-blue-dark !max-h-[40px] !mr-4'
                onClick={toggleCreateModal}
              >
                Agregar <Add />
              </Button>
              <Button className='!bg-success !text-white hover:!bg-success-dark max-h-[40px]'>
                <PlayCircleFilled className='mr-2' />
                Iniciar día
              </Button>
            </div>
          </div>
          <div className='w-full flex flex-col'>
            <div className='w-full flex flex-row bg-blue p-4'>
              <div className='font-secondary text-white font-bold basis-1/4'>
                Nombre
              </div>
              <div className='font-secondary text-white font-bold basis-1/4'>
                Cantidad
              </div>
              <div className='font-secondary text-white font-bold basis-1/4'>
                Tipo de gramaje
              </div>
              <div className='font-secondary text-white font-bold basis-1/4'>
                Acciones
              </div>
            </div>
            {productsFilters.length > 0
              ? productsFilters.map((itm, index) => (
                  <div
                    className={`flex fle-row p-4 ${
                      index % 2 === 0 ? "bg-enabled-dark" : "bg-enabled-light"
                    }`}
                    key={"indx-" + index}
                  >
                    <div className='font-secondary basis-1/4'>{itm.name}</div>
                    <div className='font-secondary basis-1/4'>{itm.cant}</div>
                    <div className='font-secondary basis-1/4'>
                      {itm.measurement}
                    </div>
                    <div className='flex flex-row'>
                      <Button
                        onClick={() => handleOpenEdit(itm)}
                        className='!bg-blue !text-white hover:!bg-blue-dark !mr-4'
                      >
                        <Edit />
                      </Button>
                      <Button
                        onClick={() => handleOpenDelete(itm)}
                        className='!bg-danger !text-white hover:!bg-danger-dark'
                      >
                        <Delete />
                      </Button>
                    </div>
                  </div>
                ))
              : "No hay productos guardados"}
          </div>
        </div>
      </div>
      <ModalCreateInventaryProduct
        isOpen={isOpenCreate}
        isLoading={isLoading}
        onClose={toggleCreateModal}
        formik={formik}
      />
      <ModalEditInventaryProduct
        isOpen={isOpenEdit}
        isLoading={isLoading}
        onClose={toggleEditModal}
        formik={formik}
      />
      <ModalDeleteInventaryProduct
        isOpen={isOpenDelete}
        isLoading={isLoading}
        onClose={toggleDeleteModal}
        formik={formik}
      />
    </ProtectPage>
  );
};

export default InventoryPage;
