import { FC } from "react";
import { SectionProps } from "../types/section.type";
import { useRouter } from "next/router";
import Image from "next/image";
import { URL_BASE } from "@/utils/urls";

type TComp = {
  onClick: () => void;
};

const TypeComp: FC<SectionProps & TComp> = ({
  className,
  title,
  description,
  image,
  onClick,
}) => {
  return (
    <section onClick={onClick} className={`grid ${className} m-4 relative`}>
      {image && (
        <Image
          src={"/" + image}
          width={200}
          height={200}
          alt={image}
          className={"h-[200px] m-auto absolute bg-scroll"}
        />
      )}
      <div className='grid absolute h-[200px] w-[200px] text-white'>
        <h1 className='m-auto'>{title}</h1>
      </div>
    </section>
  );
};

export default TypeComp;
