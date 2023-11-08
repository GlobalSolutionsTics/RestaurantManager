import Dishes from "@/components/dishes/Dishes";
import TypeComp from "@/components/typeSelector/TypeComponent";
import { getCategories } from "@/services/dishes";
import { TCatalog } from "@/types/catalog.types";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

export default function typeSelector() {
  const router = useRouter();
  const [typeDishes, setTypeDishes] = useState<Array<TCatalog>>([]);

  const obtainCategories = useCallback(async () => {
    const obtainCategories = await getCategories();
    if (obtainCategories) {
      setTypeDishes(obtainCategories);
    }
  }, []);

  useEffect(() => {
    obtainCategories();
  }, []);

  return (
    <>
      <div className=''>
        <p className='text-5xl font-normal h-[120px] grid content-center px-10 w-screen'>
          Seleccione un tipo de platillo
        </p>
        <div className='flex content-center items-center flex-wrap justify-center'>
          {typeDishes?.map((dishes) => (
            <div className=' max-w-max justify-center'>
              <TypeComp
                key={dishes.image}
                title={`${dishes.value}`}
                description={`${dishes.id}`}
                content={`${dishes.image}`}
                className={`h-[200px] w-[200px] bg-neutral-400 text-2xl p-2 text-center`}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
