import { FC, useEffect } from "react";
import { SectionProps } from "../types/section.type";

const SaucerComp: FC<SectionProps> = ({
  className,
  title,
  description,
  content,
}) => {
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "Section",
    name: title,
    description: description,
    content: content,
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
    <section className="p-2">
      <div className={`flex p-2 ${className}`}>
        <div className={` basis-full md:basis-1/2 lg:basis-1/2 saucer__header ${className}`}>
          <h3 className="saucer__title text">{title}</h3>
          <p className="text-sm p-0">{description}</p>
        </div>
        <div className="saucer__content">{content}</div>
      </div>
    </section>
  );
};

export default SaucerComp;
