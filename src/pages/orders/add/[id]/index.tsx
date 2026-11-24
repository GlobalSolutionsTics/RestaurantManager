import CalculatorComp from "@/components/calculator";
import Dishes from "@/components/dishes/Dishes";
import TypeComp from "@/components/typeSelector/TypeComponent";
import ProtectPage from "@/pages/admin/components/protectPage";
import { getCategories, getDishService } from "@/services/dishes";
import { useOrderForEditing } from "@/hooks/Orders/useOrderForEditing";
import { setAdditionDraft } from "@/store/slices/orders.slice";
import { v4 as uuidv4 } from "uuid";
import { TCatalog } from "@/types/catalog.types";
import { TMenuResponse } from "@/types/menu.types";
import { DEFAULT_TABLE_LLEVAR } from "@/utils/constants";
import { CHECKS } from "@/utils/users";
import { ArrowBack, DoneAll, RoomService } from "@mui/icons-material";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

type TDish = TMenuResponse & { number?: number; image?: string };

type TDishesDescription = Array<TDish>;

const AddOrderDishes = ({ orderId }: { orderId: string }) => {
  const order = useOrderForEditing(orderId);
  const tableNumber = order?.tableNumber;
  const [showItems, setShowItems] = useState(false);
  //Dishes states
  const [imageItem, setImageItem] = useState("");
  const [titleItems, setTitleItems] = useState("");
  const [typeDishes, setTypeDishes] = useState<Array<TCatalog>>([]);
  const [dishesList, setDishesList] = useState<Array<TMenuResponse>>([]);
  const [dishesDescription, setDishesDescription] =
    useState<TDishesDescription>([]);
  const [uuidDish, setUUIDDish] = useState("");
  const [dishSelect, setDishSelect] = useState<TDish>({
    name: "",
    uuid: "",
    isUniquePrice: false,
    type: "",
    price: 0,
  });
  //Calculator controllers
  const [showCalculator, setShowCalculator] = useState(false);
  const [showCalculatorNew, setShowCalculatorNew] = useState(false);
  const [calculatorVal, setCalculatorVal] = useState(0);

  const router = useRouter();

  //Redux handlers
  const dispatch = useDispatch();
  //Taggle
  const toggleMenu = () => setShowItems(!showItems);
  const toggleCalculatorNew = () => {
    setCalculatorVal(0);
    setShowCalculatorNew(!showCalculatorNew);
  };
  const toggleCalculator = () => {
    if (showCalculator) {
      setCalculatorVal(0);
    }
    setShowCalculator(!showCalculator);
  };

  //Handlers
  const handleDishSelect = (uuid: string | undefined, itm: TDish) => {
    setDishSelect(itm);
    if (uuid) {
      setUUIDDish(uuid);
      const findDish = dishesDescription.find((itm) => itm.uuid === uuid);
      if (findDish !== undefined) {
        if (findDish.number) setCalculatorVal(findDish.number);
        toggleCalculator();
      } else {
        setCalculatorVal(0);
        toggleCalculatorNew();
      }
    }
  };

  const handleAccept = (value: number) => {
    if (uuidDish !== "" && value !== 0) {
      const find = dishesDescription.map((itm) => {
        if (itm.uuid === uuidDish) {
          return { ...itm, number: value };
        }
        return itm;
      });
      setDishesDescription(find);
      toggleCalculator();
    } else if (value === 0) {
      const findIndex = dishesDescription.findIndex(
        (itm) => itm.uuid === uuidDish,
      );
      const newArray = [...dishesDescription];
      newArray.splice(findIndex, 1);
      setDishesDescription(newArray);
      toggleCalculator();
    }
  };

  const handleCreateNew = (value: number) => {
    if (uuidDish !== "" && value !== 0) {
      const newOrder = { ...dishSelect, number: value };
      setDishesDescription((current) =>
        current.some((dish) => dish.uuid === uuidDish)
          ? current
          : [...current, newOrder],
      );
      toggleCalculatorNew();
    } else {
      toggleCalculatorNew();
    }
  };

  const handleSendModification = () => {
    if (!order || dishesDescription.length === 0) return;
    dispatch(
      setAdditionDraft({
        orderId,
        submissionId: uuidv4(),
        dishes: dishesDescription,
      }),
    );
    router.push(`/orders/add/${orderId}/send`);
  };
  //Getter
  const getDishesInfo = async (dish: TCatalog) => {
    toggleMenu();
    setDishesList([]);
    setTitleItems(dish.value.toUpperCase());
    if (dish.image) {
      setImageItem(dish.image);
    }
    const dishes = await getDishService(dish.id);
    if (dishes) {
      setDishesList(dishes);
    }
  };
  //Booleans
  const isThisSelected = (id: string): boolean => {
    const find = dishesDescription.findIndex((itm) => itm.type === id);
    if (find !== -1) return true;
    return false;
  };
  //Initialize Data
  const obtainCategories = useCallback(async () => {
    const obtainCategories = await getCategories();
    if (obtainCategories) {
      setTypeDishes(obtainCategories);
    }
  }, []);
  useEffect(() => {
    obtainCategories();
  }, [obtainCategories]);

  return (
    <ProtectPage push={router.push} requiredProfiles={CHECKS}>
      <Head>
        <title>Listado Ordenes</title>
      </Head>
      <div className='w-full fixed z-30 bg-white'>
        <div className='px-2 py-2 text-center bg-blue'>Añadir a la orden</div>
        <div className='font-primary text-[1.5rem] p-4 flex flex-row'>
          <div className='basis-1/5'>
            <button onClick={router.back}>
              <ArrowBack fontSize='large' />
            </button>
          </div>
          <div className='basis-2/5 flex items-center font-bold'>
            <RoomService fontSize='small' className='mr-4' />
            {tableNumber === DEFAULT_TABLE_LLEVAR
              ? "Para llevar"
              : "MESA " + tableNumber}
          </div>
          <div className='!text-[0.75rem] !font-bold basis-2/5'>
            <p className='text-center'>Estatus:</p>
            <p className='text-center'>{order?.status}</p>
          </div>
        </div>
      </div>
      <div className='flex content-center items-center flex-wrap justify-center mt-[7rem] mb-16'>
        {typeDishes?.map((dishes) => (
          <div key={"t-" + dishes.id} className=' max-w-max justify-center'>
            <TypeComp
              key={"t-" + dishes.id}
              image={dishes.image}
              title={`${dishes.value}`}
              description={`${dishes.id}`}
              content={`${dishes.image}`}
              onClick={() => getDishesInfo(dishes)}
              className={`h-[150px] w-[150px] bg-neutral-400 text-2xl p-2 text-center`}
              isSelected={isThisSelected(dishes.id)}
            />
          </div>
        ))}
      </div>
      {showItems && (
        <>
          <div
            className='fixed w-full h-full bg-black content-space top-0 right-0 opacity-40 z-[39]'
            onClick={toggleMenu}
          ></div>
          <div className='fixed w-[90%] h-full bg-white top-0 right-0 overflow-y-auto overflow-x-hidden z-40'>
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
                {dishesList.length > 0 ? (
                  dishesList.map((dish) => (
                    <Dishes
                      key={dish.uuid}
                      title={`${dish!.name}`}
                      onClick={() => handleDishSelect(dish.uuid, dish)}
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
      <CalculatorComp
        key={"normal-calc"}
        show={showCalculator}
        initialValues={calculatorVal}
        onAccept={handleAccept}
        onClose={toggleCalculator}
      />
      <CalculatorComp
        key={"new-calc"}
        show={showCalculatorNew}
        onAccept={handleCreateNew}
        onClose={toggleCalculatorNew}
      />
      <button
        className='w-full fixed bottom-0 z-20 bg-success text-white text-[1.5rem] itmes-center justify-center flex font-secondary py-2'
        disabled={!order || dishesDescription.length === 0}
        onClick={handleSendModification}
      >
        <DoneAll /> Revisar adición
      </button>
    </ProtectPage>
  );
};

export default function AddOrderPage() {
  const { query } = useRouter();
  return typeof query.id === "string" ? (
    <AddOrderDishes key={query.id} orderId={query.id} />
  ) : null;
}
