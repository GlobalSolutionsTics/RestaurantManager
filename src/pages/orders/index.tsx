import { realtimeDB } from "@firebase/config";
import { RT_ORDER_TABLE_NAME } from "@models/names";
import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";

const HomeOrderPage = () => {
  const [orders, setOrders] = useState<Array<any>>([]);
  const [orderDetail, setOrderDetail] = useState<Array<any> | null>(null);

  const findByUUID = (uuid: string) => {
    const find = orders.find((itm) => itm.uuid == uuid);
    console.log(find.dishesDescription);
    if (find) {
      setOrderDetail(find.dishesDescription);
    } else {
      setOrderDetail(null);
    }
  };
  useEffect(() => {
    const connection = ref(realtimeDB, RT_ORDER_TABLE_NAME);
    return onValue(connection, (snapshot) => {
      const data = snapshot.val();
      if (snapshot.exists()) {
        const elements = Object.values(data).sort(
          (a: any, b: any) => a.orderId - b.orderId
        );
        setOrders(elements);
      }
    });
  }, []);
  return (
    <div>
      <h2>Ordenes pendientes</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col px-4">
          {orders.length > 0 ? (
            orders
              .sort((el) => el.orderId)
              .map((el) => (
                <div
                  className="flex flex-col bg-white text-black my-2"
                  key={el.uuid}
                  onClick={() => findByUUID(el.uuid)}
                >
                  <h2>Orden mesa {el.tableNumber}</h2>
                  <div>Platillos a preparar: {el.dishes}</div>
                </div>
              ))
          ) : (
            <b>Sin ordenes</b>
          )}
        </div>
        <div>
          {orderDetail &&
            orderDetail.map((itm) => (
              <div>
                <div>Platillo: {itm.name}</div>
                <div>Numero de platillos: {itm.numberOfDishes}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default HomeOrderPage;
