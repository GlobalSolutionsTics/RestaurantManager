import { FC } from "react";
import { SectionProps } from "../types/section.type";

const TypeComp: FC<SectionProps> = ({
  className,
  title,
  description,
  content,
}) => {
  return (
    <section className={`flex ${className}`}>
      <div className='m-auto'>
        <h1>{title}</h1>
      </div>
    </section>
  );
};

export default TypeComp;
