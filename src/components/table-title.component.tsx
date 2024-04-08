type Props = {
  titles: Array<string>;
};
const TableTitleComponent = ({ titles }: Props) => {
  return (
    <div className='w-full flex flex-row bg-blue p-4'>
      {titles.map((itm, i) => (
        <div
          key={"idx-" + i}
          className={`font-secondary text-white font-bold basis-1/${titles.length}`}
        >
          {itm}
        </div>
      ))}
    </div>
  );
};

export default TableTitleComponent;
