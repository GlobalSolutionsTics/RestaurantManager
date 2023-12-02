import ListOptionComponent from "@/components/listOption/ListOption";
import { realtimeDB } from "@firebase/config";
import { RT_ORDER_TABLE_NAME } from "@models/names";
import { getAuth, signInAnonymously } from "firebase/auth";
import { onValue, ref } from "firebase/database";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";

const HomeOrderPage = () => {
  const [orders, setOrders] = useState<Array<any>>([]);
  const [orderDetail, setOrderDetail] = useState<Array<any> | null>(null);
  const [orderSelected, setOrderSelected] = useState<any>({});
  const [uuidSelected, setUUIDSelected] = useState("");
  const [numberTable, setNumberTable] = useState("");

  const findByUUID = (uuid: string) => {
    const find = orders.find((itm) => itm.uuid == uuid);
    console.log(find.waiter);
    if (find) {
      setOrderDetail(find.dishesDescription);
      setUUIDSelected(uuid);
      setNumberTable(find.tableNumber);
      setOrderSelected(find);
    } else {
      setOrderDetail(null);
    }
  };

  const autheticate = useCallback(async () => {
    const auth = getAuth();
    await signInAnonymously(auth);
  }, []);

  useEffect(() => {
    autheticate();
    const connection = ref(realtimeDB, RT_ORDER_TABLE_NAME);
    return onValue(connection, (snapshot) => {
      const data = snapshot.val();
      if (snapshot.exists()) {
        const elements = Object.values(data).sort(
          (a: any, b: any) => a.orderId - b.orderId,
        );
        setOrders(elements);
      }
    });
  }, []);
  return (
    <div className='flex flex-row flex-start w-full h-[100vh]'>
      <div className='flex flex-col flex-start basis-1/3 bg-enabled'>
        <div className='bg-blue text-white typography-primary h-normal py-2 px-4'>
          Ordenes
        </div>
        {orders.length > 0 ? (
          orders
            .sort((el) => el.orderId)
            .map((el) => (
              <ListOptionComponent
                key={el.tableNumber}
                onClick={() => findByUUID(el.uuid)}
                isSelected={el.uuid === uuidSelected}
              >
                Mesa {el.tableNumber}
              </ListOptionComponent>
            ))
        ) : (
          <b>Sin ordenes</b>
        )}
      </div>
      <div className='flex flex-col basis-2/3'>
        <div className='h-normal bg-blue-dark text-white pt-2 pl-4 text-[2rem] typography-secondary-light'>
          Orden de la Mesa {numberTable} | Platillos: {orderSelected?.dishes}
        </div>
        <div className='w-full p-4'>
          <div className='grid gap-8 grid-cols-2 w-full'>
            {orderDetail &&
              orderDetail.map((itm, i) => (
                <div
                  key={"itm-" + i}
                  className={`w-[400px] h-[160px] bg-enabled-light rounded-lg relative`}
                >
                  <Image
                    src={"/" + itm.image}
                    alt='Imagen producto'
                    width={400}
                    height={160}
                    className='rounded-lg'
                    style={{ width: "400px", height: "160px" }}
                  />
                  <div className='absolute top-0 bottom-0 bg-black content-space w-full rounded-lg opacity-40'></div>
                  <div className='absolute top-0 bottom-0 w-full flex flex-col px-4 py-3 justify-between'>
                    <div className='typography-secondary-light text-white text-[2rem]'>
                      {itm.name}
                    </div>
                    <div className='typography-secondary-light text-white text-[2rem]'>
                      Cantidad: {itm.number}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeOrderPage;
