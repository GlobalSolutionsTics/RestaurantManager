import { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";

type Porps = {
  isSelected?: boolean;
  children: any;
  isDot?: boolean;
  onClick?: () => void;
  onCreate?: (title: string) => void;
  key?: string;
};
const ListOptionComponent = ({
  isSelected,
  children,
  key,
  isDot,
  onClick,
  onCreate,
}: Porps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isCreated, setIsCreated] = useState(false);
  const [title, setTitle] = useState("");
  const handleOnCreate = () => {
    if (title && onCreate) {
      onCreate(title);
      reset();
    }
  };

  const reset = () => {
    setTitle("");
    setIsCreated(false);
  };

  useEffect(() => {
    if (inputRef.current !== null) {
      inputRef.current.focus();
    }
  }, [isCreated]);
  if (isDot) {
    return (
      <>
        {!isCreated ? (
          <button
            className={`bg-white text-center text-blue border-dashed border-2 border-blue h-normal py-4 typography-secondary-bold text-[1.5rem]  `}
            key={key}
            onClick={() => setIsCreated(true)}
          >
            {children}
          </button>
        ) : (
          <div className='flex flex-row flex-start bg-white'>
            <div className={`w-sm h-normal content-space bg-black`}></div>
            <input
              className={`typography-secondary-light text-[1.5rem] ml-6 text-blue-dark w-full outline-0`}
              onChange={(event: any) => setTitle(event.target.value)}
              ref={inputRef}
              value={title}
            />
            <Button
              variant='outlined'
              className='bg-danger'
              onClick={handleOnCreate}
            >
              <CheckIcon />
            </Button>
            <Button
              variant='contained'
              className='bg-danger'
              onClick={() => reset()}
            >
              <DeleteIcon />
            </Button>
          </div>
        )}
      </>
    );
  }

  return (
    <button
      className={`flex flex-row flex-start ${
        isSelected ? "bg-blue-dark" : "bg-white"
      }`}
      key={key}
      onClick={onClick}
    >
      <div
        className={`w-sm h-normal content-space ${
          isSelected ? "bg-blue" : "bg-gray"
        }`}
      ></div>
      <span
        className={`typography-secondary-light text-[1.5rem] ml-6 mt-4 ${
          isSelected ? "text-white" : "text-blue-dark"
        }`}
      >
        {children}
      </span>
    </button>
  );
};

export default ListOptionComponent;
