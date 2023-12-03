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
    <section onClick={onClick} className={`relative grid ${className} m-4`}>
      {image && <Image src={"/" + image} alt={image} layout='fill' />}
      <div className='absolute top-0 bottom-o bg-black z-10 content-space w-full h-full opacity-60'></div>
      <div className='m-auto absoulte w-full h-full z-20 font-primary font-bold text-white'>
        {title}
      </div>
    </section>
  );
};

export default TypeComp;
