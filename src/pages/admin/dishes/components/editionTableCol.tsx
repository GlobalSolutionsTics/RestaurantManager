import { TCatalog } from "@/types/catalog.types";
import { TMenuResponse } from "@/types/menu.types";
import {
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { ChangeEvent, useState } from "react";

type TEditTableCol = {
  data: TMenuResponse;
  index: number;
  handleChange: () => void;
  categories: Array<TCatalog>;
};

const EditionTableCol = ({
  index,
  data,
  categories,
  handleChange,
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
  };

  const handleChangePrice = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setPrice(value);
  };

  const handleUniquePrice = (event: SelectChangeEvent) => {
    const value = event.target.value;
    if (value == "0") {
      setIsUnique(false);
    } else {
      setIsUnique(true);
    }
  };

  return (
    <div className='flex flex-row' key={data.uuid}>
      <div className='w-[40px] border-[1px] bg-enabled-light border-[1px] border-enabled'>
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
      <div className='basis-1/5 border-[1px] border-enabled'></div>
    </div>
  );
};

export default EditionTableCol;
