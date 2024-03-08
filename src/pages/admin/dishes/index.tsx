import { ChangeEvent, useCallback, useEffect, useState } from "react";
import {
  createCategoryService,
  createDishService,
  getCategories,
  getDishService,
  updateDishesInformation,
} from "@/services/dishes";
import { TCatalog } from "@/types/catalog.types";
import { TMenuResponse } from "@/types/menu.types";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ListOptionComponent from "@/components/listOption/ListOption";
import MenuAdmin from "../components/menu";
import { useRouter } from "next/router";
import Head from "next/head";
import ProtectPage from "../components/protectPage";
import { ArrowBack, Done, Edit, Save } from "@mui/icons-material";
import EditionTableCol from "../../../components/editionTableCol";
import { Tooltip } from "@mui/material";
import { TOKEN_ID } from "@/utils/strings";
import { ADMIN } from "@/utils/users";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const MessageComponent = withReactContent(Swal);

type TOptionSearcher = {
  children: any;
  onClick: (itm: any) => void;
};

const OptionShearcher = ({ children, onClick }: TOptionSearcher) => {
  return (
    <div
      className='hover:bg-blue-dark hover:text-white hover:cursor-pointer text-secondary px-4 py-2'
      onClick={onClick}
    >
      {children}
    </div>
  );
};

const DishesAdminPage = () => {
  //List controlls
  const [titleCategory, setTitleCategory] = useState("");

  const [idCategory, setIdCategory] = useState("");
  const [isUniquePrice, setIsUniquePrice] = useState("1");
  const [nameDish, setNameDish] = useState("");
  const [priceDish, setPriceDish] = useState("");

  const [categories, setCategories] = useState<Array<TCatalog>>([]);
  const [dishes, setDishes] = useState<Array<TMenuResponse>>([]);
  const [loading, setLoading] = useState(false);

  //Modals shower controll
  const [isOpenModalDish, setOpenModalDish] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  //Controlls of editing section
  const [categorySelect, setCategorySelect] = useState("");
  //Controlls of edited column
  const [isChangesItems, setIsChangesItems] = useState(false);
  const [isErrorModal, setIsErrorModal] = useState(false);
  //Searcher controller
  const [searcherItems, setSearcherItems] = useState<Array<TMenuResponse>>([]);
  const [posibleOptions, setPosibleOptions] = useState<Array<TMenuResponse>>(
    [],
  );
  const [textToSearch, setTextToSearch] = useState("");
  const [idItemSelect, setIdItemSelect] = useState("");

  const router = useRouter();

  const toggleModalDish = () => setOpenModalDish(!isOpenModalDish);

  //Services
  const getAllCategories = useCallback(async () => {
    const obtainCategories = await getCategories();
    if (obtainCategories) {
      setCategories(obtainCategories);
      getAllDishes(obtainCategories);
    }
  }, []);

  const getAllDishes = async (categories: TCatalog[]) => {
    let dishesForCategory: Array<any> = [];
    const promises = [];
    for (let a = 0; a < categories.length; a++) {
      const promise = await getDishService(categories[a].id);
      promises.push(promise);
    }
    const responses = await Promise.all(promises);
    if (responses) {
      responses.map((itm) => {
        dishesForCategory = dishesForCategory.concat(itm);
        return itm;
      });
      setSearcherItems(dishesForCategory);
    }
  };

  const getDishForId = async (id: string) => {
    setLoading(true);
    setDishes([]);
    const dishesObtained = await getDishService(id);
    setLoading(false);
    if (dishesObtained) {
      setDishes(dishesObtained);
      return true;
    }
    return false;
  };

  const showMessage = (title: string, description: string, okText?: string) => {
    MessageComponent.fire({
      icon: "success",
      title: title,
      text: description,
      timer: 1500,
      confirmButtonText: okText,
      showConfirmButton: false,
      showLoaderOnConfirm: false,
      showLoaderOnDeny: false,
    });
  };
  /**
   * Handle functions
   */
  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const value: string = event.target.value;
    if (value !== "") {
      const options = searcherItems.filter(
        (itm) =>
          itm.name.toLowerCase().startsWith(value.toLowerCase()) ||
          itm.name.toLowerCase().endsWith(value.toLowerCase()),
      );
      setTextToSearch(value);
      if (options !== undefined) {
        setPosibleOptions(options);
      }
    } else {
      setTextToSearch("");
      setPosibleOptions([]);
    }
  };

  const handleOptionSelected = (itm: TMenuResponse) => {
    const categoryId = itm.type;
    setCategorySelect(categoryId);
    setTextToSearch(itm.name);
    setPosibleOptions([]);
    setIdItemSelect(itm.uuid || "");
    getDishForId(categoryId);
    console.log(itm);
  };

  const _hanldeChangeCategorieId = async (id: string, title: string) => {
    const dishesObtained = await getDishForId(id);
    if (dishesObtained) {
      setIdCategory(id);
      setTitleCategory(title);
    }
  };

  const handleChangeCategory = (event: SelectChangeEvent) => {
    const value: string = event.target.value;
    setIdCategory(value);
  };

  const handleChangeUniquePrice = (event: SelectChangeEvent) => {
    const value: string = event.target.value;
    setIsUniquePrice(value);
  };

  const handleChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    const value: string = event.target.value;
    setNameDish(value);
  };

  const handleChangePrice = (event: ChangeEvent<HTMLInputElement>) => {
    const value: string = event.target.value;
    setPriceDish(value);
  };

  const handleEditingCategory = (e: SelectChangeEvent) => {
    const value = e.target.value;

    setDishes([]);
    setCategorySelect("");
    setIsChangesItems(false);
    setCategorySelect(value);
    console.log("value:", value);
    getDishForId(value);
  };

  const handleCreateCategory = async (title: string) => {
    const id = title.toLowerCase().replace(" ", "_");
    const payload: TCatalog = {
      id: id,
      value: title,
    };
    const isCreated = await createCategoryService(payload);
    if (isCreated) {
      showMessage("Categoría creada", "Se creo exitosamente la categoría");
      getAllCategories();
    }
  };

  const handleBackEditSection = () => {
    if (isChangesItems) {
      setIsErrorModal(true);
    } else {
      setOpenEdit(false);
    }
  };

  const handleErrorModalGotoEditSection = () => {
    setOpenEdit(false);
    setIsChangesItems(false);
    setIsErrorModal(false);
    setDishes([]);
    setCategorySelect("");
  };

  const handleChangeEditCol = (obj: any) => {
    const newItems = [...dishes];
    const mapper = newItems.map((itm) => {
      if (itm.uuid === obj.uuid) {
        return obj;
      }
      return itm;
    });
    setDishes(mapper);
    setIsChangesItems(true);
  };

  const handleDeleteColum = (obj: any) => {
    const idToken = obj.uuid;
    const newItems = [...dishes];
    const findIndex = newItems.findIndex((itm) => itm.uuid === idToken);
    newItems.splice(findIndex, 1);
    setDishes(newItems);
    setIsChangesItems(true);
  };

  const handleSaveChanges = async () => {
    const token = sessionStorage.getItem(TOKEN_ID);
    const payload = {
      category: categorySelect,
      dishes: dishes,
    };
    const update = await updateDishesInformation(payload, token);
    if (update) {
      MessageComponent.fire({
        icon: "success",
        title: "Actualizado",
        text: "Los datos se han actualizado correctamente",
        confirmButtonText: "Aceptar",
      });
      setIsChangesItems(false);
    } else {
      MessageComponent.fire({
        icon: "error",
        title: "Ocurrio un error",
        text: "No se pudo actualizar la información, intente de nuevo mas tarde | ERR: DS0001",
        timer: 1500,
        confirmButtonText: "Aceptar",
        showConfirmButton: true,
        showLoaderOnConfirm: false,
        showLoaderOnDeny: false,
      });
    }
  };

  //Principal functions

  const resetNewDishForm = () => {
    setIsUniquePrice("1");
    setNameDish("");
    setPriceDish("");
  };

  const createDish = async () => {
    const dishPayload: TMenuResponse = {
      isUniquePrice: isUniquePrice === "0" ? false : true,
      name: nameDish,
      price: Number(priceDish),
      type: idCategory,
    };
    const payload = {
      collection: idCategory,
      dish: dishPayload,
    };
    const isCreated = await createDishService(payload);
    if (isCreated) {
      setOpenModalDish(false);
      resetNewDishForm();
      showMessage("Platillo creado", "Se creo exitosamente el platillo");
      const dishesObtained = await getDishService(idCategory);
      if (dishesObtained) {
        setDishes(dishesObtained);
      }
    } else {
      alert("Error al crear el platillo");
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  return (
    <ProtectPage push={router.push} requiredProfiles={ADMIN}>
      <Head>
        <title>Administrador | Listado de platillos</title>
      </Head>
      <div className='flex flex-row'>
        <MenuAdmin router={router} basePath={router.pathname} />
        {openEdit ? (
          <div className='flex flex-col w-full'>
            <div className='bg-blue font-secondary text-[1.25rem] w-full p-4 flex justify-between'>
              <div className='flex flex-row items-center'>
                <div className='flex items-center justify-center mr-4'>
                  <Tooltip title='Regresar' arrow>
                    <button
                      onClick={handleBackEditSection}
                      className='text-white'
                    >
                      <ArrowBack />
                    </button>
                  </Tooltip>
                </div>
                <div className='text-white flex items-center'>
                  Editar precios
                </div>
              </div>
              {isChangesItems && (
                <div className='text-white text-[1.25rem]'>
                  Tienes platillos con cambios sin guardar
                </div>
              )}
              <div className='flex items-center justify-center mr-4'>
                {isChangesItems ? (
                  <Tooltip title='Guardar precios' arrow>
                    <button onClick={handleSaveChanges} className='text-white'>
                      <Save />
                    </button>
                  </Tooltip>
                ) : (
                  <Tooltip title='Precios guardados' arrow>
                    <span className='text-white'>
                      <Done />
                    </span>
                  </Tooltip>
                )}
              </div>
            </div>
            <div className='flex flex-row p-4 bg-enabled'>
              <Select
                className='h-[2rem] outline-none w-full basis-1/6 rounded-none mr-4'
                placeholder='Categoría'
                onChange={handleEditingCategory}
              >
                {categories.length > 0 &&
                  categories.map((itm, index) => (
                    <MenuItem
                      key={"itm-" + itm.id + "-" + index}
                      value={itm.id}
                    >
                      {itm.value}
                    </MenuItem>
                  ))}
              </Select>
              <div className='w-full basis-5/6 relative'>
                <OutlinedInput
                  className='h-[2rem] outline-none w-full rounded-none bg-white'
                  id='outline-input-platillo'
                  placeholder='Buscar platillo'
                  value={textToSearch}
                  onChange={handleSearch}
                />
                {posibleOptions.length > 0 && (
                  <div
                    className={`w-full absolute ${
                      posibleOptions.length >= 4
                        ? "h-[10rem]"
                        : posibleOptions.length === 3
                          ? "h-[7.5rem]"
                          : posibleOptions.length === 2
                            ? "h-[5rem]"
                            : "h-[2.5rem]"
                    } bg-white overflow-y-auto z-[20]`}
                  >
                    {posibleOptions.map((itm, idx) => (
                      <OptionShearcher
                        onClick={() => handleOptionSelected(itm)}
                        key={"id-" + idx}
                      >
                        {itm.type.replace("_", " ").toUpperCase()} - {itm.name}
                      </OptionShearcher>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className='text-center'>
              {categorySelect !== "" ? (
                <div className='flex flex-col'>
                  <div className='flex flex-row w-full bg-enabled-light'>
                    <div className='w-[60px] bg-white'></div>
                    <div className='basis-1/5 text-left px-4 py-2 border-[1px] border-enabled'>
                      Nombre
                    </div>
                    <div className='basis-1/5 text-left px-4 py-2 border-[1px] border-enabled'>
                      Precio
                    </div>
                    <div className='basis-1/5 text-left px-4 py-2 border-[1px] border-enabled'>
                      Categoría
                    </div>
                    <div className='basis-1/5 text-left px-4 py-2 border-[1px] border-enabled'>
                      ¿Es precio único?
                    </div>
                    <div className='basis-1/5 text-left px-4 py-2 border-[1px] border-enabled'>
                      Acciones
                    </div>
                  </div>
                  {dishes.map((itm, index) => (
                    <EditionTableCol
                      index={index}
                      key={"key-" + index}
                      data={itm}
                      categories={categories}
                      handleChange={handleChangeEditCol}
                      handleDelete={() => handleDeleteColum(itm)}
                      isSelected={itm.uuid === idItemSelect}
                    />
                  ))}
                </div>
              ) : loading ? (
                <div className='flex items-center p-2 font-secondary'>
                  <span className='loader mr-4'></span> Cargando catálogo
                </div>
              ) : (
                <span>Seleccione una categoría</span>
              )}
            </div>
          </div>
        ) : (
          <div className='flex flex-col w-full h-[100vh] py-8'>
            <div className='flex justify-end'>
              <button
                onClick={() => setOpenEdit(true)}
                className='mx-8 p-2 bg-success-dark text-white font-primary mb-4 hover:bg-success'
              >
                <Edit /> Editar precios
              </button>
            </div>
            <div className='flex flex-row w-full h-full'>
              <div className='flex flex-col basis-2/5 bg-enabled mr-8 ml-8'>
                <div className='p-2 bg-blue h-[64px]'>
                  <h2 className='typography-primary text-white'>Categorías</h2>
                </div>
                <div className='flex flex-col overflow-x-hidden'>
                  {categories.length > 0 &&
                    categories.map((itm, index) => (
                      <ListOptionComponent
                        isSelected={idCategory === itm.id}
                        key={"ind-" + index + "-" + itm.id}
                        onClick={() =>
                          _hanldeChangeCategorieId(itm.id, itm.value)
                        }
                      >
                        {itm.value}
                      </ListOptionComponent>
                    ))}
                  <ListOptionComponent isDot onCreate={handleCreateCategory}>
                    Agregar
                  </ListOptionComponent>
                </div>
              </div>
              <div className='flex flex-col overflow-x-hidden basis-3/5 bg-enabled mr-8'>
                {titleCategory !== "" && (
                  <div className='h-norma w-full px-8 py-2 bg-aqua font-secondary font-bold text-white text-[2rem] uppercase'>
                    {titleCategory}
                  </div>
                )}
                {dishes.length > 0 ? (
                  <div className='grid grid-cols-3 gap-4 w-[408px] mt-8 ml-8'>
                    {dishes.map((itm, key) => (
                      <button
                        key={key}
                        className='w-[120px] h-[120px] bg-blue text-white font-secondary font-bold p-4'
                      >
                        {itm.name}
                      </button>
                    ))}
                    <button
                      onClick={toggleModalDish}
                      className='w-[120px] h-[120px] bg-white border-dashed border-2 border-blue text-blue p-4'
                    >
                      Agregar
                    </button>
                  </div>
                ) : (
                  <div className='mt-8 ml-8 flex flex-col items-center w-[408px]'>
                    <p className='typography-primary !text-[1rem]'>
                      Aun no tienes platillos en esta categoría
                    </p>
                    <button
                      onClick={toggleModalDish}
                      className='w-[120px] h-[120px] bg-white border-dashed border-2 border-blue text-blue mt-8 p-4'
                    >
                      Agregar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <Modal open={isErrorModal} onClose={() => setIsErrorModal(false)}>
        <Box sx={style}>
          <div className='flex flex-col items-center'>
            <h2 className='text-[1.5rem] mb-4'>
              ¿Estas seguro de realizar esta acción?
            </h2>
            <span className='text-center mb-4'>
              Tienes platillos con cambios sin guardar, si continuas perderás
              dichos cambios
            </span>
            <div className='flex w-full justify-between'>
              <Button
                variant='outlined'
                className='bg-gray text-white basis-1/2 mr-4'
                onClick={() => setIsErrorModal(false)}
              >
                Cancelar
              </Button>
              <Button
                variant='outlined'
                className='bg-blue text-white basis-1/2'
                onClick={handleErrorModalGotoEditSection}
              >
                Aceptar
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
      <Modal open={isOpenModalDish} onClose={() => toggleModalDish()}>
        <Box sx={style}>
          <div className='flex flex-col'>
            <h2>Añadir platillo</h2>
            <div className='flex flex-row !mt-4'>
              <FormControl fullWidth className='basis-1/2 !mr-4'>
                <InputLabel htmlFor='outlined-adornment-name'>
                  Nombre
                </InputLabel>
                <OutlinedInput
                  id='outlined-adornment-name'
                  label='Precio'
                  inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                  value={nameDish}
                  onChange={handleChangeName}
                />
              </FormControl>
              <FormControl fullWidth className='basis-1/2'>
                <InputLabel htmlFor='outlined-adornment-amount'>
                  Precio
                </InputLabel>
                <OutlinedInput
                  id='outlined-adornment-amount'
                  startAdornment={
                    <InputAdornment position='start'>$</InputAdornment>
                  }
                  label='Precio'
                  type='number'
                  inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                  value={priceDish}
                  onChange={handleChangePrice}
                />
              </FormControl>
            </div>
            <div className='flex flex-row !mt-4'>
              <FormControl fullWidth className='basis-1/2 !mr-4'>
                <InputLabel htmlFor='select-category'>Categoría</InputLabel>
                <Select
                  labelId='select-category-label'
                  id='select-category'
                  value={idCategory}
                  label='Categoría'
                  disabled
                  onChange={handleChangeCategory}
                >
                  {categories.length > 0 &&
                    categories.map((itm, index) => (
                      <MenuItem
                        key={"itm-" + itm.id + "-" + index}
                        value={itm.id}
                      >
                        {itm.value}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              <FormControl fullWidth className='basis-1/2'>
                <InputLabel htmlFor='is-unique-price'>
                  ¿El precio es fijo?
                </InputLabel>
                <Select
                  labelId='is-unique-price-label'
                  id='is-unique-price'
                  value={isUniquePrice}
                  label='¿El precio es fijo?'
                  onChange={handleChangeUniquePrice}
                >
                  <MenuItem value={"0"}>No</MenuItem>
                  <MenuItem value={"1"}>Si</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className='flex flex-col flex-end mt-4'>
              <Button variant='outlined' onClick={createDish}>
                Añadir
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </ProtectPage>
  );
};

export default DishesAdminPage;
