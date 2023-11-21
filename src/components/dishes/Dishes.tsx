import React, { FC, useEffect } from "react";
import { SectionProps } from "../types/section.type";

interface ComponentsDishes {
  title: string;
  isSelected: boolean;
  onClick: () => void;
}
const Dishes: FC<ComponentsDishes> = ({ title, isSelected, onClick }) => {
  return (
    <section
      onClick={onClick}
      className={`grid h-[200px] w-[200px] ${
        isSelected ? "bg-success" : "bg-neutral-300"
      } text-2xl m-4`}
    >
      <div className='flex m-auto'>
        <p className='p-4 text-center font-secundary'>{title}</p>
      </div>
    </section>
  );
};

export default Dishes;
