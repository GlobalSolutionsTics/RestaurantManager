import React, { FC, useEffect } from "react";
import { SectionProps } from "../types/section.type";

interface ComponentsDishes {
  order: string;
  setOrder: React.Dispatch<React.SetStateAction<string>>;
}
const Dishes: FC<SectionProps & ComponentsDishes> = ({
  className,
  title,
  description,
  content,
  order,
  setOrder,
}) => {
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "Section",
    name: title,
    description: description,
    content: content,
    order: order,
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

  const handleOrder = () => {
    setOrder(title);
  };

  return (
    <section onClick={handleOrder} className={`grid ${className} m-4`}>
      <div className='flex m-auto'>
        <p className='p-4 text-center'>{title}</p>
      </div>
    </section>
  );
};

export default Dishes;
