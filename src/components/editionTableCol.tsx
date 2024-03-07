import { TCatalog } from "@/types/catalog.types";
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
  key: string;
  isSelected?: boolean;
  handleChange: (ob: any) => void;
  handleDelete: (ob: any) => void;
};

const EditionTableCol = ({
  index,
  data,
  categories,
  key,
  isSelected,
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
  const [type, setType] = useState(DEFAULT_TYPE);
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

  return (
    <div className='flex flex-row' key={key}>
      <div
        className={`w-[60px] border-[1px] px-2 ${
          isSelected ? "bg-success text-white" : "bg-enabled-light text-black"
        } border-[1px] border-enabled flex flex-row`}
      >
        {isSelected && <ArrowRight />}
        {index + 1}
      </div>
      <OutlinedInput
        value={name}
        className='h-[2rem] outline-none w-full rounded-none bg-white basis-1/5'
        onChange={handleChangeName}
      />
      <OutlinedInput
        value={price}
        className='h-[2rem] outline-none w-full rounded-none bg-white basis-1/5'
        onChange={handleChangePrice}
      />
      <Select
        value={type}
        defaultValue={data.type}
        className='h-[2rem] outline-none w-full rounded-none bg-white basis-1/5'
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
        defaultValue={isUnique === true ? "1" : "0"}
        className='h-[2rem] outline-none w-full rounded-none bg-white basis-1/5'
        onChange={handleUniquePrice}
      >
        <MenuItem value={"0"}>No</MenuItem>
        <MenuItem value={"1"}>Si</MenuItem>
      </Select>
      <div className='basis-1/5 border-[1px] border-enabled'>
        <Tooltip title={`Borrar ${name}`}>
          <Button onClick={handleDelete}>
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
