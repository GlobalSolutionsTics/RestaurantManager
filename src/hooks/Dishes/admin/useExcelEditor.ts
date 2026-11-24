import { getDishService, updateDishesInformation } from "@/services/dishes";
import { TCatalog } from "@/types/catalog.types";
import { TMenuResponse } from "@/types/menu.types";
import { TOKEN_ID } from "@/utils/strings";
import { SelectChangeEvent } from "@mui/material";
import { ChangeEvent, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useDishes } from "../useDishes";

const MessageComponent = withReactContent(Swal);

export const useExcelEditor = () => {
  const [isChangesItems, setIsChangesItems] = useState(false);
  const [isErrorModal, setIsErrorModal] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [categorySelect, setCategorySelect] = useState("");
  const [dishes, setDishes] = useState<Array<TMenuResponse>>([]);
  const [loading, setLoading] = useState(false);
  const [posibleOptions, setPosibleOptions] = useState<Array<TMenuResponse>>(
    [],
  );
  const [textToSearch, setTextToSearch] = useState("");
  const [idItemSelect, setIdItemSelect] = useState("");

  const { categories, searcherItems } = useDishes();

  const handleBackEditSection = () => {
    if (isChangesItems) {
      setIsErrorModal(true);
    } else {
      setOpenEdit(false);
    }
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

  const handleEditingCategory = (e: SelectChangeEvent) => {
    const value = e.target.value;

    setDishes([]);
    setCategorySelect("");
    setIsChangesItems(false);
    setCategorySelect(value);
    getDishForId(value);
  };

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

  return {
    isErrorModal,
    openEdit,
    isChangesItems,
    loading,
    categories,
    searcherItems,
    posibleOptions,
    textToSearch,
    idItemSelect,
    categorySelect,
    dishes,
    handleOptionSelected,
    handleBackEditSection,
    handleSaveChanges,
    handleEditingCategory,
    handleSearch,
    handleChangeEditCol,
    handleDeleteColum,
  };
};
