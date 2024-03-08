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
import {
  TDishForSales,
  getDishesForSeles,
  getItemsForHours,
  uniquesDays,
} from "@/utils/array";
import ProtectPage from "./components/protectPage";

type TDaysFinance = {
  day: string;
  total: number;
};

type THoursFinance = {
  hour: string;
  total: number;
};

const ContabilityPage = () => {
  const [total, setTotal] = useState(0);
  const [salesForTravel, setSalesForTravel] = useState(0);
  const [averageTable, setAverageTable] = useState(0);
  const [averageDishesTable, setAverageDishesTable] = useState(0);
  const [dishesAttended, setDishesAttended] = useState(0);
  const [orderList, setOrderList] = useState([]);
  const [listSelected, setListSelected] = useState([]);
  //Sales for Dishes
  const [salesForDishes, setSalesForDishes] = useState<Array<TDishForSales>>(
    [],
  );
  //Date manager
  const [initialDate, setInitialDate] = useState("");
  const [finishDate, setFinishDate] = useState("");
  //Manage days
  const [salesForDays, setSalesForDays] = useState<Array<TDaysFinance>>([]);
  const [salesForHours, setSalesForHours] = useState<Array<THoursFinance>>([]);
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

  const datas = [
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
  //Compare dates
  function compararFechas(a: any, b: any) {
    const fechaA: any = new Date(a.creatAt);
    const fechaB: any = new Date(b.creatAt);

    // Ordenar de mayor a menor
    return fechaB - fechaA;
  }

  const compareDays = (a: any, b: any) => {
    return a.day - b.day;
  };

  const compareHours = (a: any, b: any) => {
    return Number(a.hour) - Number(b.hour);
  };

  const compareSalesForDish = (a: any, b: any) => {
    return Number(b.units) - Number(a.units);
  };
  //Functions of dateTime
  const onChangeInitialDate = (val: any) => {
    const date = dayjs(val).format("YYYY/MM/DD");
    setInitialDate(date);
    handleChangeFinance(date, finishDate);
  };

  const onChangeFinishDate = (val: any) => {
    const date = dayjs(val).format("YYYY/MM/DD");
    setFinishDate(date);
    handleChangeFinance(initialDate, date);
  };
  //Handles
  const handleChangeFinance = (_initialDate: any, _finishDate: any) => {
    let filterList: Array<never> = [];
    //Tricotomy of date
    if (_initialDate !== "" && _finishDate === "") {
      filterList = orderList.filter(
        (itm: any) => itm.createdAtTmp == _initialDate,
      );
    } else if (_initialDate === "" && _finishDate !== "") {
      filterList = orderList.filter(
        (itm: any) => itm.createdAtTmp == _finishDate,
      );
    } else {
      const initDay = dayjs(_initialDate + "T00:00:00").valueOf();
      const finDay = dayjs(_finishDate + "T23:59:59").valueOf();
      filterList = orderList.filter(
        (itm: any) => itm.createAtTime >= initDay && itm.createAtTime <= finDay,
      );
    }
    //Get items
    if (filterList.length > 0) {
      const _total = filterList.reduce(
        (prev: any, itm: any) => prev + itm.total,
        0,
      );
      const _dishesAttended = filterList.reduce(
        (prev: any, itm: any) => prev + itm.dishesDescription.length,
        0,
      );
      //Obtain total of sales
      const _filterSales = filterList.filter(
        (itm: any) => itm.tableNumber === DEFAULT_TABLE_LLEVAR,
      );
      const _salesForTravel = _filterSales.reduce(
        (prev: any, itm: any) => prev + itm.total,
        0,
      );

      const averageTab = Math.floor(_total / filterList.length);
      const _dishesForTable = Math.round(_dishesAttended / filterList.length);
      const _arrDays = uniquesDays(filterList).sort(compareDays);
      const _arrHours = getItemsForHours(filterList).sort(compareHours);
      const _dishesForSale =
        getDishesForSeles(filterList).sort(compareSalesForDish);

      setSalesForDishes(_dishesForSale);
      setSalesForTravel(_salesForTravel);
      setSalesForHours(_arrHours);
      setSalesForDays(_arrDays);
      setAverageDishesTable(_dishesForTable);
      setDishesAttended(_dishesAttended);
      setAverageTable(averageTab);
      setTotal(_total);
      setListSelected(filterList);
    } else {
      setSalesForDays([]);
      setAverageDishesTable(0);
      setDishesAttended(0);
      setAverageTable(0);
      setTotal(0);
      setListSelected([]);
    }
  };

  const getDay = (val: number) => {
    switch (val) {
      case 0:
        return "Domingo";
      case 1:
        return "Lunes";
      case 2:
        return "Martes";
      case 3:
        return "Miercoles";
      case 4:
        return "Jueves";
      case 5:
        return "Viernes";
      case 6:
        return "Sabado";
    }
  };

  //Initialice
  const init = useCallback(async () => {
    const token = sessionStorage.getItem(TOKEN_ID);
    if (token) {
      const data = await getFinancialServices(token);
      const listOrdened = data.sort(compararFechas);
      //Obtain total of historic
      const _total = data.reduce((prev: any, itm: any) => prev + itm.total, 0);
      //Obtain total of dishes attended
      const _dishesAttended = data.reduce(
        (prev: any, itm: any) => prev + (itm?.dishesDescription?.length || 0),
        0,
      );
      //Obtain total of sales
      const _filterSales = data.filter(
        (itm: any) => itm.tableNumber === DEFAULT_TABLE_LLEVAR,
      );
      const _salesForTravel = _filterSales.reduce(
        (prev: any, itm: any) => prev + itm.total,
        0,
      );

      //Obtain average of selles
      const averageTab = Math.floor(_total / data.length);
      const _dishesForTable = Math.round(_dishesAttended / data.length);
      const _arrDays = uniquesDays(data).sort(compareDays);
      const _arrHours = getItemsForHours(data).sort(compareHours);
      const _dishesForSale = getDishesForSeles(data).sort(compareSalesForDish);

      setSalesForDishes(_dishesForSale);
      setSalesForTravel(_salesForTravel);
      setSalesForHours(_arrHours);
      setSalesForDays(_arrDays);
      setAverageDishesTable(_dishesForTable);
      setDishesAttended(_dishesAttended);
      setAverageTable(averageTab);
      setListSelected(listOrdened);
      setOrderList(listOrdened);
      setTotal(_total);
    }
  }, []);

  useEffect(() => {
    init();
  }, []);

  return (
    <ProtectPage push={router.push} requiredProfiles={"admin"}>
      <div className='flex flex-row'>
        <MenuAdmin basePath={router.pathname} router={router} />
        <div className='w-full p-4'>
          <div className='flex flex-row justify-between items-center'>
            <p className='font-primary text-[2rem]'>
              Contabilidad de tu negocio
            </p>
            <div className='flex flex-row'>
              <DatePicker
                onChange={onChangeInitialDate}
                format='YYYY/MM/DD'
                label='Fecha inicial'
                className='mr-4'
              />
              <DatePicker
                onChange={onChangeFinishDate}
                format='YYYY/MM/DD'
                label='Fecha final'
              />
            </div>
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
            <div className='flex flex-col basis-1/2 px-4'>
              <div className='w-full'>
                <div className='w-full flex flex-row bg-enabled-dark p-2'>
                  Ventas por dia de la semana
                </div>
                <div className='flex flex-col [&>*]:bg-enabled [&>*:nth-child(odd)]:!bg-blue-dark [&>*:nth-child(odd)]:!text-white overflow-y-auto max-h-[400px]'>
                  {salesForDays.length > 0 &&
                    salesForDays.map((itm) => (
                      <div className='w-full flex flex-row p-2'>
                        <div className='basis-1/2'>
                          {getDay(Number(itm.day))}
                        </div>
                        <div className='basis-1/2'>
                          {currencyFormat(itm.total)}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              <div className='flex flex-row mt-4 text-[0.85rem]'>
                <div className='basis-1/2'>
                  <p>Total vendido: {currencyFormat(total)}</p>
                  <p>Total de platillos expedidos: {dishesAttended}</p>
                  <p>Venta promedio por mesa: {currencyFormat(averageTable)}</p>
                </div>
                <div className='basis-1/2'>
                  <p>Platillos promedio por mesa: {averageDishesTable}</p>
                  <p>Mesas atendidas: {listSelected.length}</p>
                  <p>
                    Ventas ordenes para llevar: {currencyFormat(salesForTravel)}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className='flex flex-row mt-8 '>
            <div className='w-full basis-1/2 mr-4'>
              <div className='w-full flex flex-row bg-enabled-dark p-2'>
                Ventas por hora del dia
              </div>
              <div className='flex flex-col [&>*]:bg-enabled [&>*:nth-child(odd)]:!bg-blue-dark [&>*:nth-child(odd)]:!text-white overflow-y-auto'>
                {salesForHours.length > 0 &&
                  salesForHours.map((itm) => (
                    <div className='w-full flex flex-row p-2'>
                      <div className='basis-1/2'>{itm.hour}</div>
                      <div className='basis-1/2'>
                        {currencyFormat(itm.total)}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <div className='w-full basis-1/2'>
              <div className='w-full flex flex-row bg-enabled-dark p-2'>
                Platillos que más vendieron
              </div>
              <div className='w-full flex flex-row p-2'>
                <div className='basis-1/4 text-center'>Platillo</div>
                <div className='basis-1/4 text-center'>Unidades</div>
                <div className='basis-1/4 text-center'>Precio unit</div>
                <div className='basis-1/4 text-center'>Venta total</div>
              </div>
              <div className='flex flex-col [&>*]:bg-enabled [&>*:nth-child(odd)]:!bg-blue-dark [&>*:nth-child(odd)]:!text-white overflow-y-auto max-h-[400px]'>
                {salesForDishes.length > 0 &&
                  salesForDishes.map((itm) => (
                    <div className='w-full flex flex-row p-2'>
                      <div className='basis-1/4 text-center'>
                        {itm.dishName}
                      </div>
                      <div className='basis-1/4 text-center'>{itm.units}</div>
                      <div className='basis-1/4 text-center'>
                        {currencyFormat(itm.price)}
                      </div>
                      <div className='basis-1/4 text-center'>
                        {currencyFormat(itm.total)}
                      </div>
                    </div>
                  ))}
              </div>
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
    </ProtectPage>
  );
};

export default ContabilityPage;
