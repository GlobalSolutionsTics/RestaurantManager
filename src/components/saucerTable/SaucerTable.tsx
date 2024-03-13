import { FC, useEffect } from "react";
import { SectionProps } from "../types/section.type";

const SaucerTable: FC<SectionProps> = ({
  className,
  title,
  description,
  content,
  row1,
  row2,
  row3,
}) => {
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "Section",
    name: title,
    description: description,
    content: content,
    row1: row1,
    row2: row2,
    row3: row3,
  };

  useEffect(() => {
    // Agregar el script JSON-LD al <head> de la página
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.innerHTML = JSON.stringify(jsonLdData);
    document.head.appendChild(script);

    // Limpiar el script al desmontar el componente
    return () => {
      document.head.removeChild(script);
    };
  }, [jsonLdData]);
  return (
    <section className={`flex p-2 ${className}`}>
      <div className=' flex text-white basis-full md:basis-1/2 lg:basis-1/2 saucer__header'>
        <div>
          <h3>{title}</h3>
          <p className='text-sm p-0'>{content}</p>
        </div>
        <p className='grid text-xs p-0 items-end'>{description}</p>
      </div>
      <div className='flex justify-around justify-items-center text-white basis-full md:basis-1/2 lg:basis-1/2 saucer__header'>
        <p className='flex items-center'>{row1}</p>
        <p className='flex items-center'>{row2}</p>
        <p className='flex items-center'>{row3}</p>
      </div>
    </section>
  );
};

export default SaucerTable;
