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

  console.log(typeDishes);

  return (
    <>
      <div className='flex flex-col'>
        <p className='h-10 text-2xl font-medium p-10 w-screen'>
          Seleccione un tipo de platillo
        </p>
        <div className='flex flex-wrap h-[200px] w-[200px]'>
          {typeDishes?.map((dishes) => (
            <div className=''>
              <TypeComp
                key={dishes.id}
                title={`${dishes.value}`}
                description=''
                content={`${dishes.image}`}
                className={`h-[200px] w-[200px] `}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
