import { useRouter } from "next/router";
import ProtectPage from "../admin/components/protectPage";
import {
  ArrowBack,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import { useCallback, useEffect, useState } from "react";
import { getApplicationList } from "@/services/order";
import { TOKEN_ID } from "@/utils/strings";
import { DEFAULT_TABLE_LLEVAR } from "@/utils/constants";
import { CHECKS, TOKEN } from "@/utils/users";

type PropsColumn = {
  tableNumber: number;
  status: string;
  detail: Array<any>;
};

const ColColumn = ({ tableNumber, status, detail }: PropsColumn) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDetail = () => setIsOpen(!isOpen);
  return (
    <>
      <div
        className='px-4 py-2 flex flex-row justify-between hover:cursor-pointer'
        onClick={toggleDetail}
      >
        {tableNumber === DEFAULT_TABLE_LLEVAR && <div>Para llevar</div>}
        {tableNumber !== DEFAULT_TABLE_LLEVAR && <div>Mesa {tableNumber}</div>}
        <div>Estatus:{status}</div>
        {!isOpen ? <KeyboardArrowDown /> : <KeyboardArrowUp />}
      </div>
      {isOpen && (
        <div className='px-8 py-4'>
          {detail.map((itm: any) => (
            <div className='flex flex-row justify-between'>
              <div>{itm.name}</div>
              <div>{itm.number}</div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

const MyApplicationsPage = () => {
  const [listApplications, setListApplications] = useState([]);
  const router = useRouter();
  //Initial Orders
  const init = useCallback(async () => {
    const token = sessionStorage.getItem(TOKEN_ID);
    if (token) {
      const data = await getApplicationList(token);
      setListApplications(data);
    }
  }, []);

  useEffect(() => {
    init();
  }, []);
  return (
    <ProtectPage push={router.push} requiredProfiles={CHECKS}>
      <div className='font-primary text-[1.5rem] p-4 flex flex-row'>
        <div className='basis-1/6'>
          <button onClick={router.back}>
            <ArrowBack fontSize='large' />
          </button>
        </div>
        <div className='basis-5/6 flex text-center justify-center items-center font-bold'>
          Mis solicitudes
        </div>
      </div>
      <div className='min-h-[calc(100vh_-_70px)] flex flex-col [&>*:nth-child(odd)]:bg-blue [&>*:nth-child(odd)]:text-white [&>*]:bg-blue-light'>
        {listApplications.map((itm: any, index) => (
          <ColColumn
            key={"id-" + index}
            tableNumber={itm.modifications.tableNumber}
            status={itm.applicationStatus}
            detail={itm.modifications.dishesDescription}
          />
        ))}
      </div>
    </ProtectPage>
  );
};

export default MyApplicationsPage;
