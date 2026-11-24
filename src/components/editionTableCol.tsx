import type { Dispatch } from "react";
import { TCatalog } from "@/types/catalog.types";
import type { KitchenType } from "@/types/kitchen.types";
import { KitchenSelect } from "@/views/admin/dishes/KitchenSelect";
import { TMenuResponse } from "@/types/menu.types";
import { ArrowRight, Delete } from "@mui/icons-material";
import {
  Button,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Tooltip,
} from "@mui/material";
import { ChangeEvent, useState } from "react";

type TEditTableCol = {
  data: TMenuResponse;
  index: number;
  categories: Array<TCatalog>;
  kitchens?: KitchenType[];
  kitchensDisabled?: boolean;
  disabled?: boolean;
  isSelected?: boolean;
  dataTestId?: string;
  handleChange: Dispatch<TMenuResponse>;
  handleDelete: () => void;
};

const EditionTableCol = ({
  index,
  data,
  categories,
  kitchens = [],
  kitchensDisabled,
  disabled,
  isSelected,
  dataTestId,
  handleChange,
  handleDelete,
}: TEditTableCol) => {
  const DEFAULT_NAME = data.name;
  const DEFAULT_PRICE = data.price;
  const DEFAULT_TYPE = data.type;
  const DEFAULT_IS_UNIQUE = data.isUniquePrice;

  //Controllers of inputs
  const [name, setName] = useState(DEFAULT_NAME);
  const [price, setPrice] = useState(DEFAULT_PRICE);

  const [isUnique, setIsUnique] = useState(DEFAULT_IS_UNIQUE);

  const handleChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setName(value);
    handleChange({ ...data, name: value });
  };

  const handleChangePrice = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setPrice(value);
    handleChange({ ...data, price: value });
  };

  const handleUniquePrice = (event: SelectChangeEvent) => {
    const value = event.target.value;
    if (value == "0") {
      setIsUnique(false);
      handleChange({ ...data, isUniquePrice: false });
    } else {
      setIsUnique(true);
      handleChange({ ...data, isUniquePrice: true });
    }
  };

  const handleKitchenChange = (id: string) => {
    const dish = { ...data };
    if (id) dish.kitchenType = id;
    else delete dish.kitchenType;
    handleChange(dish);
  };

  return (
    <div
      className='grid grid-cols-[3rem_minmax(10rem,1.4fr)_minmax(6rem,0.8fr)_minmax(9rem,1fr)_minmax(9rem,1fr)_minmax(12rem,1.3fr)_5rem] items-center gap-2 border-b border-slate-200 px-3 py-2'
      data-testid={dataTestId}
    >
      <div
        className={`rounded-lg px-2 py-1 text-sm ${
          isSelected ? "bg-blue-dark text-white" : "bg-slate-100 text-slate-700"
        } flex items-center`}
      >
        {isSelected && <ArrowRight />}
        {index + 1}
      </div>
      <OutlinedInput
        value={name}
        className='h-9 min-w-0 w-full bg-white'
        onChange={handleChangeName}
        disabled={disabled}
        inputProps={{ "data-testid": "editcol-name" }}
      />
      <OutlinedInput
        value={price}
        className='h-9 min-w-0 w-full bg-white'
        onChange={handleChangePrice}
        disabled={disabled}
      />
      <Select
        value={DEFAULT_TYPE}
        className='h-9 min-w-0 w-full bg-white'
        disabled
      >
        {categories.length > 0 &&
          categories.map((itm, index) => (
            <MenuItem key={"itm-" + itm.id + "-" + index} value={itm.id}>
              {itm.value}
            </MenuItem>
          ))}
      </Select>
      <Select
        value={isUnique === true ? "1" : "0"}
        disabled={disabled}
        className='h-9 min-w-0 w-full bg-white'
        onChange={handleUniquePrice}
      >
        <MenuItem value={"0"}>No</MenuItem>
        <MenuItem value={"1"}>Si</MenuItem>
      </Select>
      <KitchenSelect
        label={`Cocina perteneciente de ${name}`}
        kitchens={kitchens}
        value={data.kitchenType ?? ""}
        onChange={handleKitchenChange}
        disabled={disabled || kitchensDisabled}
      />
      <div>
        <Tooltip title={`Borrar ${name}`}>
          <Button
            onClick={handleDelete}
            disabled={disabled}
            color='error'
            aria-label={`Borrar ${name}`}
          >
            <Delete />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

EditionTableCol.defaultProps = {
  index: 0,
  data: {},
  categories: [],
  handleChange: () => {},
};

export default EditionTableCol;
