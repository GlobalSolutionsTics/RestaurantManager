import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { getFinancialServices } from "@/services/finance";
import { TOKEN_ID } from "@/utils/strings";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { ADMIN, TOKEN } from "@/utils/users";
import { RequestQuote } from "@mui/icons-material";
import { Button } from "@mui/material";
import ProtectPage from "../components/protectPage";
import MenuAdmin from "../components/menu";
import TableDishes from "@ui/financial/components/tableDishes";
import { FinancialResponse, Order } from "@ui/financial/type";
import { TableSalesForDays } from "@ui/financial/components/tableSalesForDay";
import PanelStatisticsFinancial from "@ui/financial/components/panelStatistics";
import { TableSalesForHour } from "@ui/financial/components/tableSalesForHour";
import { TicketModalCheck } from "@ui/financial/components/ticketModalCheck";
import { TicketCheck } from "@ui/financial/components/ticketCheck";
import { TableSalesForDishes } from "@ui/financial/components/tableSalesForDishes";
import { TableSalesForWaiter } from "@/ui/financial/components/tableSalesForWaiter";

const ContabilityPage = () => {
  const [listSelected, setListSelected] = useState<FinancialResponse[]>([]);
  const [openModalCheck, setOpenModalCheck] = useState(false);
  const [orderToCheck, setOrderToCheck] = useState<Order>();
  const [initialDate, setInitialDate] = useState(dayjs().format("YYYY/MM/DD"));
  const [finishDate, setFinishDate] = useState(dayjs().format("YYYY/MM/DD"));

  const toggleModal = () => setOpenModalCheck(!openModalCheck);
  const router = useRouter();

  const onChangeInitialDate = (val: any) => {
    const date = dayjs(val).format("YYYY/MM/DD");
    setInitialDate(date);
  };

  const onChangeFinishDate = (val: any) => {
    const date = dayjs(val).format("YYYY/MM/DD");
    setFinishDate(date);
  };

  const handleCheck = (data: Order) => {
    toggleModal();
    setOrderToCheck(data);
  };

  const onSearch = async () => {
    const token = sessionStorage.getItem(TOKEN_ID);
    if (token) {
      const data: FinancialResponse[] = await getFinancialServices(
        token,
        initialDate,
        finishDate,
      );
      if (data.length > 0) {
        setListSelected(data);
      }
    }
  };

  const init = useCallback(async () => {
    const token = sessionStorage.getItem(TOKEN_ID);
    if (token) {
      const data: FinancialResponse[] = await getFinancialServices(
        token,
        initialDate,
        finishDate,
      );
      if (data.length > 0) setListSelected(data);
    }
  }, []);

  useEffect(() => {
    init();
  }, []);

  return (
    <ProtectPage push={router.push} requiredProfiles={ADMIN}>
      <div className='flex flex-row'>
        <MenuAdmin basePath={router.pathname} router={router} />
        <div className='w-full p-4'>
          <div className='flex flex-row justify-between items-center'>
            <div className='flex flex-col w-full'>
              <p className='flex flex-row font-primary text-[2rem] text-blue-dark'>
                <RequestQuote fontSize='large' className='mr-2' />
                Contabilidad de tu negocio
              </p>
              <p className='font-secondary text-[1rem] text-steel-70'>
                Aquí puedes ver la contabilidad de tu negocio, filtrar por
                fechas y ver los empleados con mejor desempeño en un periodo de
                tiempo
              </p>
            </div>
            <div className='flex flex-col'>
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
              <Button
                onClick={onSearch}
                variant='contained'
                className='bg-blue !text-white mt-2 mb-1'
              >
                Ver periodo
              </Button>
            </div>
          </div>
          <PanelStatisticsFinancial list={listSelected} />
          <div className='grid grid-cols-3 gap-3 mt-4'>
            <div className='col-span-2'>
              <TableDishes list={listSelected} onCheck={handleCheck} />
            </div>
            <TableSalesForDays list={listSelected} />
          </div>
          <div className='grid grid-cols-3 gap-4 mt-8 '>
            <TableSalesForWaiter list={listSelected} />
            <TableSalesForHour list={listSelected} />
            <TableSalesForDishes list={listSelected} />
          </div>
          <TicketModalCheck isOpen={openModalCheck} onClose={toggleModal}>
            <TicketCheck order={orderToCheck} />
          </TicketModalCheck>
        </div>
      </div>
    </ProtectPage>
  );
};

export default ContabilityPage;
