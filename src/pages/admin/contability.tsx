import { useRouter } from "next/router";
import MenuAdmin from "./components/menu";
import Chart from "react-google-charts";

const ContabilityPage = () => {
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

  return (
    <div className='flex flex-row'>
      <MenuAdmin basePath={router.pathname} router={router} />
      <div className='w-full p-4'>
        <p className='font-primary text-[2rem]'>Contabilidad de tu negocio</p>
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
      </div>
    </div>
  );
};

export default ContabilityPage;
