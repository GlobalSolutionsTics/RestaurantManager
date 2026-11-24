import { Backspace, CheckOutlined } from "@mui/icons-material";
import { Box, Modal } from "@mui/material";
import { useCallback, useEffect, useState } from "react";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

type TPropsCalculator = {
  show: boolean;
  initialValues?: number;
  onClose: () => void;
  onAccept: (value: number) => void;
};

const CalculatorComp = ({
  show,
  initialValues,
  onClose,
  onAccept,
}: TPropsCalculator) => {
  const DEFAULT_INITAL_VALUE = initialValues !== undefined ? initialValues : 0;
  const [dishesNumber, setDishesNumber] = useState(DEFAULT_INITAL_VALUE);
  //Handlers
  const handleChangeDishesNumber = (number: number) => {
    if (dishesNumber === 0 && number === 0) {
      setDishesNumber(0);
    } else if (dishesNumber === 0) {
      setDishesNumber(number);
    } else {
      const preNumber = dishesNumber.toString();
      const nextNumber = preNumber + number.toString();
      const newNumber = Number(nextNumber);
      setDishesNumber(newNumber);
    }
  };

  const handleDeleteDishesNumber = () => {
    const strDishes = dishesNumber.toString();
    if (strDishes.length === 1) {
      setDishesNumber(0);
    } else {
      const arrDishesNumber = strDishes.split("");
      arrDishesNumber.pop();
      const nextDishes = Number(arrDishesNumber.join(""));
      setDishesNumber(nextDishes);
    }
  };

  const handleAccept = () => {
    return onAccept(dishesNumber);
  };
  //Initial values
  const initCalculator = useCallback(() => {
    if (initialValues !== undefined) {
      setDishesNumber(initialValues);
    } else {
      setDishesNumber(0);
    }
  }, [initialValues]);

  useEffect(() => {
    initCalculator();
    return () => {
      setDishesNumber(0);
    };
  }, [initialValues]);

  return (
    <Modal open={show} onClose={onClose}>
      <Box sx={style}>
        <span className='flex text-[1.5rem] font-primary'>
          Seleccione la cantidad de platillos
        </span>
        <div className=' w-full text-[2rem] text-center font-secondary'>
          {dishesNumber}
        </div>
        <div className='flex content-center items-center flex-wrap justify-center '>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((itm) => {
            return (
              <button
                key={itm}
                onClick={() => handleChangeDishesNumber(itm)}
                className='basis-1/4 w-[100px] h-[100px] text-center bg-enabled my-2 mx-2 text-[2rem]'
              >
                {itm}
              </button>
            );
          })}
          <button
            onClick={handleDeleteDishesNumber}
            className='basis-1/4 w-[100px] h-[100px] text-center my-2 mx-2 bg-danger'
          >
            <Backspace className='fill-white' sx={{ fill: "#fff" }} />
          </button>
          <button
            className='basis-1/4 w-[100px] h-[100px] text-center bg-enabled my-2 mx-2 bg-success-light'
            onClick={handleAccept}
          >
            <CheckOutlined className='fill-success-dark' />
          </button>
        </div>
      </Box>
    </Modal>
  );
};

export default CalculatorComp;
