import { useRouter } from "next/router";
import MenuAdmin from "./components/menu";
import Chart from "react-google-charts";
import { useCallback, useEffect, useState } from "react";
import { getFinancialServices } from "@/services/finance";
import { TOKEN_ID } from "@/utils/strings";
import { currencyFormat } from "@/utils/formats";
import { DEFAULT_TABLE_LLEVAR } from "@/utils/constants";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

const ContabilityPage = () => {
  const [total, setTotal] = useState(0);
  const [orderList, setOrderList] = useState([]);
  const [listSelected, setListSelected] = useState([]);
  //Router
  const router = useRouter();
  const options = {
    title: "Ventas mes de diciembre",
    hAxis: { title: "Fecha", viewWindow: { min: 0 } },
    vAxis: { title: "Ventas", viewWindow: { min: 0 } },
    legend: "hola",
    animation: {
      duration: 1000,
      easing: "lineal",
    },
  };

  const optionsBills = {
    title: "Gastos mes de diciembre",
    hAxis: { title: "Fecha", viewWindow: { min: 0 } },
    vAxis: { title: "Gastos", viewWindow: { min: 0 } },
    series: {
      0: { color: "#e2431e" },
    },
    animation: {
      duration: 1000,
      easing: "lineal",
    },
  };

  const optionsSalesvsBills = {
    title: "Gastos mes de diciembre",
    hAxis: { title: "Fecha", viewWindow: { min: 0 } },
    vAxis: { title: "Gastos", viewWindow: { min: 0 } },

    animation: {
      duration: 1000,
      easing: "lineal",
    },
  };

  const data = [
    ["Fecha", "Venta"],
    ["01", 120000],
    ["02", 50000],
    ["03", 14000],
    ["04", 25000],
    ["05", 100000],
    ["06", 70000],
  ];

  const dataBills = [
    ["Fecha", "Gastos"],
    ["01", 12000],
    ["02", 5000],
    ["03", 1400],
    ["04", 35000],
    ["05", 10000],
    ["06", 7000],
  ];

  const dataSalesvsBills = [
    ["Fecha", "Venta", "Gastos"],
    ["01", 120000, 12000],
    ["02", 50000, 5000],
    ["03", 14000, 1400],
    ["04", 25000, 35000],
    ["05", 100000, 10000],
    ["06", 70000, 7000],
  ];

  const onChangeDate = (val: any) => {
    const date = dayjs(val).format("YYYY/MM/DD");
    const filterList = orderList.filter((itm: any) => itm.createdAtTmp == date);
    if (filterList.length > 0) {
      const subTotal = filterList.reduce(
        (prev: any, itm: any) => prev + itm.total,
        0,
      );
      setTotal(subTotal);
      setListSelected(filterList);
    } else {
      setTotal(0);
      setListSelected([]);
    }
  };

  function compararFechas(a: any, b: any) {
    const fechaA: any = new Date(a.creatAt);
    const fechaB: any = new Date(b.creatAt);

    // Ordenar de mayor a menor
    return fechaB - fechaA;
  }

  //Initialice
  const init = useCallback(async () => {
    const token = sessionStorage.getItem(TOKEN_ID);
    if (token) {
      const data = await getFinancialServices(token);
      const subtotal = data.reduce(
        (prev: any, itm: any) => prev + itm.total,
        0,
      );
      const listOrdened = data.sort(compararFechas);

      setListSelected(listOrdened);
      setOrderList(listOrdened);
      setTotal(subtotal);
    }
  }, []);

  useEffect(() => {
    init();
  }, []);

  return (
    <div className='flex flex-row'>
      <MenuAdmin basePath={router.pathname} router={router} />
      <div className='w-full p-4'>
        <div className='flex flex-row justify-between items-center'>
          <p className='font-primary text-[2rem]'>Contabilidad de tu negocio</p>
          <DatePicker
            onChange={onChangeDate}
            format='YYYY/MM/DD'
            label='Fecha a consultar'
          />
        </div>
        <div className='flex flex-row mt-4'>
          <div className='basis-1/2'>
            <div className='w-full flex flex-row bg-enabled-dark p-2'>
              <div className='basis-1/4'>Fecha</div>
              <div className='basis-1/4'>Mesa</div>
              <div className='basis-1/4'>Platillos</div>
              <div className='basis-1/4'>Total</div>
            </div>
            <div className='flex flex-col [&>*]:bg-enabled [&>*:nth-child(odd)]:!bg-blue-dark [&>*:nth-child(odd)]:!text-white overflow-y-auto max-h-[400px]'>
              {listSelected.length > 0 &&
                listSelected.map((itm: any) => (
                  <div className='w-full flex flex-row p-2'>
                    <div className='basis-1/4'>{itm?.createdAtTmp}</div>
                    <div className='basis-1/4'>
                      {itm?.tableNumber === DEFAULT_TABLE_LLEVAR
                        ? "PARA LLEVAR"
                        : "MESA " + itm?.tableNumber}
                    </div>
                    <div className='basis-1/4'>
                      {itm?.dishesDescription?.length}
                    </div>
                    <div className='basis-1/4'>
                      {currencyFormat(itm?.total)}
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className='basis-1/2 py-2 px-4'>
            <p>Total vendido: {currencyFormat(total)}</p>
          </div>
        </div>
        {/**
        <div className='w-full md:w-[80%] lg:w-[70%]'>
          <Chart
            chartType='AreaChart'
            data={data}
            options={options}
            width='100%'
            height='400px'
          />
        </div>
        <div className='w-full md:w-[80%] lg:w-[70%]'>
          <Chart
            chartType='AreaChart'
            data={dataBills}
            options={optionsBills}
            width='100%'
            height='400px'
          />
        </div>
        <div className='w-full md:w-[80%] lg:w-[70%]'>
          <Chart
            chartType='Bar'
            data={dataSalesvsBills}
            options={optionsSalesvsBills}
            width='100%'
            height='400px'
          />
        </div>
                      */}
      </div>
    </div>
  );
};

export default ContabilityPage;
