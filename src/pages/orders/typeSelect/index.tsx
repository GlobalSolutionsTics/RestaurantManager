import Dishes from "@/components/dishes/Dishes";
import TypeComp from "@/components/typeSelector/TypeComponent";
import { getCategories, getDishService } from "@/services/dishes";
import { TCatalog } from "@/types/catalog.types";
import { TMenuResponse } from "@/types/menu.types";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function typeSelector() {
  const router = useRouter();
  const [typeDishes, setTypeDishes] = useState<Array<TCatalog>>([]);
  const [dishesList, setDishesList] = useState<Array<TMenuResponse>>([]);
  const [showItems, setShowItems] = useState(false);
  const [titleItems, setTitleItems] = useState("");
  const [imageItem, setImageItem] = useState("");
  const [dishesDescription, setDishesDescription] = useState<
    Array<TMenuResponse>
  >([]);

  const orderStore = useSelector((store: any) => store.ordersDishes);

  const toggleMenu = () => setShowItems(!showItems);

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
    const dishes = await getDishService(dish.id);
    if (dishes) {
      setDishesList(dishes);
    }
  };

  const handleDishSelect = (dishSelected: TMenuResponse) => {
    const find = dishesDescription.findIndex(
      (itm) => itm.uuid === dishSelected.uuid,
    );
    if (find === -1) {
      const newList = [...dishesDescription];
      newList.push(dishSelected);
      setDishesDescription(newList);
    } else {
      const newList = [...dishesDescription];
      newList.splice(find, 1);
      setDishesDescription(newList);
    }
  };

  useEffect(() => {
    obtainCategories();
  }, []);

  return (
    <>
      <div className='relative'>
        <p className='text-5xl font-normal h-[120px] grid content-center px-10 w-screen'>
          Seleccione un tipo de platillo
        </p>
        <div className='flex content-center items-center flex-wrap justify-center'>
          {typeDishes?.map((dishes) => (
            <div className=' max-w-max justify-center'>
              <TypeComp
                key={"t-" + dishes.id}
                image={dishes.image}
                title={`${dishes.value}`}
                description={`${dishes.id}`}
                content={`${dishes.image}`}
                onClick={() => getDishesInfo(dishes)}
                className={`h-[200px] w-[200px] bg-neutral-400 text-2xl p-2 text-center`}
              />
            </div>
          ))}
        </div>
        {showItems && (
          <>
            <div
              className='absolute w-full h-full bg-black content-space top-0 right-0 opacity-40'
              onClick={toggleMenu}
            ></div>
            <div className='absolute w-[90%] h-full bg-white top-0 right-0'>
              <div className='relative font-normal h-[120px] grid content-center w-screen px-10 bg-neutral-300'>
                <Image src={"/" + imageItem} fill alt='' />
                <div className='absolute opacity-60 bg-black top-0 bottom-0 w-full'></div>
                <div className='absolute w-full top-0 bottom-0 flex flex-col py-4 px-6'>
                  <p className='text-5xl text-white font-secondary'>
                    {titleItems}
                  </p>
                  <p className='text-3xl text-white font-primary'>
                    Seleccione sus platillos
                  </p>
                </div>
              </div>
              <div className='flex content-center items-center flex-wrap justify-center'>
                {dishesList.length > 0 ? (
                  dishesList.map((dish) => (
                    <div>
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
                    </div>
                  ))
                ) : (
                  <div>Sin platillo </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
