import { FC } from "react";
import { SectionProps } from "../types/section.type";
import { useRouter } from "next/router";

const TypeComp: FC<SectionProps> = ({
  className,
  title,
  description,
  content,
}) => {
  const router = useRouter();
  const handleNavigation = () => {
    router.push(`/orders/dishes/${description}`);
  };
  return (
    <section onClick={handleNavigation} className={`grid ${className} m-4`}>
      <div className='m-auto'>
        <h1>{title}</h1>
      </div>
    </section>
  );
};

export default TypeComp;
