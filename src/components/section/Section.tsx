import { FC, useEffect } from "react";
import { SectionProps } from "../types/section.type";

const SectionComp: FC<SectionProps> = ({ className, title, description }) => {
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "Section",
    name: title,
    description: description,
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
    <section className={`flex flex-col p-2 ${className}`}>
      <h2>{title}</h2>
      <p>{description}</p>
    </section>
  );
};

export default SectionComp;
