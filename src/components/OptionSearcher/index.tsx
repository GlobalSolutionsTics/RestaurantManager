import { TOptionSearcher } from "@/pages/admin/dishes/type";

const OptionSearcher = ({ children, onClick }: TOptionSearcher) => {
  return (
    <div
      className='hover:bg-blue-dark hover:text-white hover:cursor-pointer text-secondary px-4 py-2'
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default OptionSearcher;
