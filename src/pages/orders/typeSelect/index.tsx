import Dishes from "@/components/dishes/Dishes";
import TypeComp from "@/components/typeSelector/TypeComponent";
import ProtectPage from "@/pages/admin/components/protectPage";
import { getCategories, getDishService } from "@/services/dishes";
import {
  setDishesDescriptionRedux,
  setDishesNumberRedux,
} from "@/store/slices/orders.slice";
import { TCatalog } from "@/types/catalog.types";
import { TMenuResponse } from "@/types/menu.types";
import { Backspace, CheckOutlined } from "@mui/icons-material";
import { Modal } from "@mui/material";
import Box from "@mui/material/Box";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Joyride from "react-joyride";

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

export default function typeSelector() {
  const router = useRouter();
  const [typeDishes, setTypeDishes] = useState<Array<TCatalog>>([]);
  const [dishesList, setDishesList] = useState<Array<TMenuResponse>>([]);
  const [showItems, setShowItems] = useState(false);
  const [titleItems, setTitleItems] = useState("");
  const [imageItem, setImageItem] = useState("");
  const [openCalculator, setOpenCalculator] = useState(false);
  const [dishesDescription, setDishesDescription] = useState<
    Array<TMenuResponse & { number?: number; image?: string }>
  >([]);
  const [dishSelectDescription, setDishSelectDescription] = useState<
    TMenuResponse & { number?: number; image?: string }
  >();
  const [dishesNumber, setDishesNumber] = useState(0);
  const [load, setLoad] = useState(true);
  const [tour, setTour] = useState(false);
  const [run, setRun] = useState(false);
  const [steps, setSteps] = useState<any>([]);

  const dispatch = useDispatch();

  const finishOrder = () => {
    const numberOfDishes = dishesDescription.reduce((prev, itm) => {
      if (itm?.number) {
        return prev + itm?.number;
      }
      return prev;
    }, 0);
    dispatch(setDishesNumberRedux(numberOfDishes));
    dispatch(setDishesDescriptionRedux(dishesDescription));
    router.push("/orders/finishOrder");
  };

  console.log("Dishes description:", dishesDescription);

  const toggleMenu = () => setShowItems(!showItems);
  /**
   * Calculator actions
   */
  const acceptDishesNumber = () => {
    const newList = [...dishesDescription];
    if (dishSelectDescription && dishesNumber !== 0) {
      const newDish = {
        ...dishSelectDescription,
        number: dishesNumber,
        image: imageItem,
      };
      newList.push(newDish);
      setDishesDescription(newList);
    }
    setDishesNumber(0);
    setOpenCalculator(false);
  };
  const toggleCalculator = () => setOpenCalculator(!openCalculator);

  const obtainCategories = useCallback(async () => {
    const obtainCategories = await getCategories();
    if (obtainCategories) {
      setTypeDishes(obtainCategories);
    }
  }, []);

  const getDishesInfo = async (dish: TCatalog) => {
    toggleMenu();
    setDishesList([]);
    setTitleItems(dish.value.toUpperCase());
    if (dish.image) {
      setImageItem(dish.image);
    }
    try {
      setLoad(true);
      const dishes = await getDishService(dish.id);
      if (dishes) {
        setDishesList(dishes);
      }
    } finally {
      setLoad(false);
    }
  };

  const handleDishSelect = (dishSelected: TMenuResponse) => {
    const find = dishesDescription.findIndex(
      (itm) => itm.uuid === dishSelected.uuid,
    );
    if (find === -1) {
      setDishSelectDescription(dishSelected);
      toggleCalculator();
    } else {
      const newList = [...dishesDescription];
      newList.splice(find, 1);
      setDishesDescription(newList);
    }
  };

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

  useEffect(() => {
    obtainCategories();
  }, []);

  const handleTour = useCallback(() => {
    setTour(true);
  }, []);

  useEffect(() => {
    const joyrideSteps = [
      {
        content: (
          <h2 className='text-2xl'>
            Esta ventana nos ayudará a capturar el pedido del cliente
          </h2>
        ),
        locale: { skip: <strong>OMITIR</strong> },
        placement: "center",
        target: "body",
      },
      {
        content: (
          <h2 className='text-2xl'>Aquí encontramos los tipo de platillos.</h2>
        ),
        locale: { skip: <strong>OMITIR</strong> },
        placement: "bottom",
        target: "#first-step",
        title: "Tipos de platillos",
      },
      {
        content: (
          <h2 className='text-2xl'>
            Al terminar de tomar la orden, este boton nos llevará a la
            confirmacion de la orden
          </h2>
        ),
        locale: { skip: <strong>OMITIR</strong> },
        placement: "bottom",
        target: "#second-step",
        title: "Mis ordenes",
      },
    ];

    setRun(tour);
    setSteps(joyrideSteps);
  }, [tour]);

  return (
    <ProtectPage push={router.push}>
      <Joyride
        continuous
        callback={() => {}}
        run={run}
        steps={steps}
        scrollToFirstStep
        hideCloseButton
        showSkipButton
        showProgress
      />
      <div className='relative overflow-x-hidden'>
        <p className='text-[2rem] font-primary h-[120px] grid content-center px-10 w-screen'>
          Seleccione un tipo de platillo
        </p>
        <button
          className='w-full bg-success text-white text-[2rem] font-secondary'
          onClick={finishOrder}
          id='second-step'
        >
          Cerrar Orden
        </button>
        <button
          className='bg-red-800 text-white w-20 h-8 rounded mx-2 my-2'
          onClick={handleTour}
        >
          Tutorial
        </button>
        <div
          className='flex content-center items-center flex-wrap justify-center'
          id='first-step'
        >
          {typeDishes?.map((dishes) => (
            <div className=' max-w-max justify-center'>
              <TypeComp
                key={"t-" + dishes.id}
                image={dishes.image}
                title={`${dishes.value}`}
                description={`${dishes.id}`}
                content={`${dishes.image}`}
                onClick={() => getDishesInfo(dishes)}
                className={`h-[150px] w-[150px] bg-neutral-400 text-2xl p-2 text-center`}
              />
            </div>
          ))}
        </div>
        {showItems && (
          <>
            <div
              className='fixed w-full h-full bg-black content-space top-0 right-0 opacity-40'
              onClick={toggleMenu}
            ></div>
            <div className='fixed w-[90%] h-full bg-white top-0 right-0 overflow-y-auto overflow-x-hidden z-30'>
              <div className='w-full h-full bg-white top-0'>
                <div className='relative font-normal h-[120px] grid content-center w-screen px-10 bg-neutral-300'>
                  <Image src={"/" + imageItem} fill alt='' />
                  <div className='absolute opacity-60 bg-black top-0 bottom-0 w-full'></div>
                  <div className='absolute w-full top-0 bottom-0 flex flex-col py-4 px-6'>
                    <p className='text-2xl md:text-3xl lg:text-5xl text-white font-secondary'>
                      {titleItems}
                    </p>
                    <p className='text-3xl text-white font-primary'>
                      Seleccione sus platillos
                    </p>
                  </div>
                </div>
                <div className='w-full grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3 lg:grid-cols-4 lg:gap-4 p-4 md:p-6'>
                  {load && (
                    <div className='fixed w-full h-full bg-white top-0 left-0 flex items-center justify-center'>
                      <div className='grid justify-items-center'>
                        <div className='my-2'>Cargando...</div>
                        <div className='loader my-2'></div>
                      </div>
                    </div>
                  )}
                  {dishesList.length > 0 ? (
                    dishesList.map((dish) => (
                      <Dishes
                        key={dish.uuid}
                        title={`${dish!.name}`}
                        onClick={() => handleDishSelect(dish)}
                        isSelected={
                          dishesDescription.findIndex(
                            (itm) => itm.uuid === dish.uuid,
                          ) !== -1
                        }
                      />
                    ))
                  ) : (
                    <div>Sin platillo </div>
                  )}
                </div>
                <div className='flex flex-row items-center justify-center m-4 p-4'>
                  <button
                    className=' bg-blue text-white font-primary text-[2rem] font-primary font-bold w-[250px]'
                    onClick={toggleMenu}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <Modal open={openCalculator} onClose={toggleCalculator}>
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
              onClick={acceptDishesNumber}
            >
              <CheckOutlined className='fill-success-dark' />
            </button>
          </div>
        </Box>
      </Modal>
    </ProtectPage>
  );
}
