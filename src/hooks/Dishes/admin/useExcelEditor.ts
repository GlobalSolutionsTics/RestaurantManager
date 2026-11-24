import { getDishService, updateDishesInformation } from "@/services/dishes";
import { TMenuResponse } from "@/types/menu.types";
import { TOKEN_ID } from "@/utils/strings";
import { ChangeEvent, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useDishes } from "../useDishes";

const MessageComponent = withReactContent(Swal);

export const useExcelEditor = () => {
  const [isChangesItems, setIsChangesItems] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categorySelect, setCategorySelect] = useState("");
  const [dishes, setDishes] = useState<Array<TMenuResponse>>([]);
  const [loading, setLoading] = useState(false);
  const [posibleOptions, setPosibleOptions] = useState<Array<TMenuResponse>>(
    [],
  );
  const [textToSearch, setTextToSearch] = useState("");
  const [idItemSelect, setIdItemSelect] = useState("");

  const { categories, searcherItems } = useDishes();

  const confirmDiscardChanges = async () => {
    if (!isChangesItems) return true;

    const confirmation = await MessageComponent.fire({
      icon: "warning",
      title: "¿Descartar cambios?",
      text: "Los cambios de esta categoría se perderán.",
      showCancelButton: true,
      confirmButtonText: "Descartar",
      cancelButtonText: "Seguir editando",
      focusCancel: true,
    });
    return confirmation.isConfirmed;
  };

  const handleSaveChanges = async () => {
    const token = sessionStorage.getItem(TOKEN_ID);
    setSaving(true);
    const payload = {
      category: categorySelect,
      dishes: dishes.map(({ kitchenType, ...dish }) =>
        kitchenType ? { ...dish, kitchenType } : dish,
      ),
    };
    const update = await updateDishesInformation(payload, token);
    setSaving(false);
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
    if (Array.isArray(dishesObtained)) {
      setDishes(dishesObtained);
      return true;
    }
    return false;
  };

  const handleEditingCategory = async (id: string) => {
    if (!(await confirmDiscardChanges())) return;

    setCategorySelect(id);
    setIsChangesItems(false);
    setIdItemSelect("");
    setPosibleOptions([]);
    setTextToSearch("");
    await getDishForId(id);
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

  const handleOptionSelected = async (dish: TMenuResponse) => {
    if (dish.type !== categorySelect) {
      if (!(await confirmDiscardChanges())) return;
      setCategorySelect(dish.type);
      setIsChangesItems(false);
      void getDishForId(dish.type);
    }
    setTextToSearch(dish.name);
    setPosibleOptions([]);
    setIdItemSelect(dish.uuid ?? "");
  };

  const handleChangeEditCol = (index: number, dish: TMenuResponse) => {
    setDishes((current) =>
      current.map((item, row) => (row === index ? dish : item)),
    );
    setIsChangesItems(true);
  };

  const handleDeleteColum = (index: number) => {
    setDishes((current) => current.filter((_, row) => row !== index));
    setIsChangesItems(true);
  };

  return {
    saving,
    confirmDiscardChanges,
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
    handleSaveChanges,
    handleEditingCategory,
    handleSearch,
    handleChangeEditCol,
    handleDeleteColum,
  };
};
