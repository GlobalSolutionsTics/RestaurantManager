import Image from "next/image";
import { Inter } from "next/font/google";
import Head from "next/head";
import SectionComp from "@/components/section/Section";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home(id: string) {
  const [displayStyle, setDisplayStyle] = useState<string | null>(null);

  const displayVisibility = (divId: string) => {
    if (displayStyle === null) {
      setDisplayStyle(divId);
    } else {
      setDisplayStyle(null);
    }
  };

  const [isVisisble, setIsVisible] = useState(false);
  const visible = () => {
    setIsVisible(!isVisisble);
  };
  const changeDisplay = isVisisble ? "grid" : "none";
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Mariquería en Valle del Vístula Esq, Valle de Oaxaca Int 92, Valle de Aragón 2da Secc, 57100 Municipio Nezahualcóyotl, Méx. ¡Disfruta de auténticos mariscos!"
        />
        <meta
          name="keywords"
          content="mariquería, mariscos, Valle del Vístula, Valle de Oaxaca, Valle de Aragón, Nezahualcóyotl, México"
        />
        <meta name="author" content="Marisquerida" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="geo.region" content="MX-MEX" />
        <meta name="geo.placename" content="Valle de Aragón, Nezahualcóyotl" />
        <meta
          name="geo.position"
          content="19.489105132153252;-99.04517983068608"
        />
        <meta name="ICBM" content="19.489105132153252, -99.04517983068608" />
        <meta
          property="og:title"
          content="Mariquería en Valle de Aragón, Nezahualcóyotl"
        />
        <meta
          property="og:description"
          content="¡Disfruta de auténticos mariscos en Valle del Vístula Esq, Valle de Oaxaca Int 92!"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="URL de tu sitio web" />
        <meta property="og:image" content="URL de la imagen representativa" />
        <meta property="og:site_name" content="Nombre de tu empresa" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@tucuenta" />
        <meta
          name="twitter:title"
          content="Mariquería en Valle de Aragón, Nezahualcóyotl"
        />
        <meta
          name="twitter:description"
          content="¡Disfruta de auténticos mariscos en Valle del Vístula Esq, Valle de Oaxaca Int 92!"
        />
        <meta
          name="twitter:image"
          content="URL de la imagen representativa"
        ></meta>
        <title>
          Marisquerida | Marisque&iacute;a en Valle de Arag&oacute;n,
          Nezahualc&oacute;yotl | Delicias del Mar a tu Mesa
        </title>
      </Head>
      <nav className="navbar">
        <Image
          className="logo"
          src="/logo_sin_fondo.png"
          alt="Logo marisquerida"
          width={96}
          height={96}
        />
      </nav>
      <div itemScope className="wood-font p-4 mid">
        <h1 itemProp="name" className="title">
          Marisquerida La Delicia del Mar | Desde 1978
        </h1>
        <h2 className="text-center text-white menu">Menú</h2>
        <button onClick={() => displayVisibility("")}>show</button>
        <div className="flex  md:flex-row flex-wrap">
          <div
            className="text-white basis-full md:basis-1/2 lg:basis-1/2 "
            onClick={(() => displayVisibility("1")) || changeDisplay}
          >
            <SectionComp
              title="Especialidades"
              description="Desde $100.00"
              content=""
              className="container jaiba-bg bg"
            />
            <div
              id="1"
              className="container"
              style={{ display: displayStyle === "1" ? "grid" : "none" }}
            >
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ex iste
              quos asperiores nulla consectetur atque, praesentium sequi!
              Consectetur sed a dolores hic harum maiores magni quos veniam
              possimus. Quaerat, dignissimos?
            </div>
          </div>
          <div
            onClick={(() => displayVisibility("2")) || changeDisplay}
            className="text-white basis-full md:basis-1/2 lg:basis-1/2 "
          >
            <SectionComp
              title="Empanadas"
              description="Desde $40.00"
              content=""
              className="container empanada-bg"
            />
            <div
              id="2"
              className="container"
              style={{ display: displayStyle === "2" ? "grid" : "none" }}
            >
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Est,
              corrupti magni! Fuga, reiciendis eos. Quia earum aliquid cum
              expedita dolores provident, esse blanditiis dolorem maiores
              laudantium, voluptatibus, eveniet eius ea.
            </div>
          </div>
          <SectionComp
            title="Mojarras"
            description="Pregunta por nuestros precios"
            content=""
            className="text-white basis-full md:basis-1/2 lg:basis-1/2 mojarra-bg container"
          />
          <SectionComp
            title="Pulpo"
            description="Desde $180.00"
            content=""
            className="text-white basis-full md:basis-1/2 lg:basis-1/2 pulpo-bg container"
          />
          <SectionComp
            title="Calamar"
            description="Desde $135.00"
            content=""
            className="text-white basis-full md:basis-1/2 lg:basis-1/2 calamar-bg container"
          />
          <SectionComp
            title="Tostadas"
            description="Desde $60.00"
            content=""
            className="text-white basis-full md:basis-1/2 lg:basis-1/2 tostadas-bg container"
          />
          <SectionComp
            title="Cocteles"
            description="Desde $60.00"
            content=""
            className="text-white basis-full md:basis-1/2 lg:basis-1/2 coctel-bg container"
          />
          <SectionComp
            title="Camarones"
            description="Desde $160.00"
            content=""
            className="text-white basis-full md:basis-1/2 lg:basis-1/2 camarones-bg container"
          />
          <SectionComp
            title="Ceviches"
            description="Desde $65.00"
            content=""
            className="text-white basis-full md:basis-1/2 lg:basis-1/2 ceviches-bg container"
          />
          <SectionComp
            title="Caldos"
            description="Desde $25.00"
            content=""
            className="text-white basis-full md:basis-1/2 lg:basis-1/2 caldos-bg container"
          />
          <SectionComp
            title="Filetes de pescado"
            description="Desde $80.00"
            content=""
            className="text-white basis-full md:basis-1/2 lg:basis-1/2 filetes-bg container"
          />
          <SectionComp
            title="Bebidas"
            description="Desde $20.00"
            content=""
            className="text-white basis-full md:basis-1/2 lg:basis-1/2 bebida-bg container"
          />
        </div>
      </div>

      <footer className="p-4 bg-black">
        <section className="flex flex-col md:flex-row">
          <section className="basis-full md:basis-1/2">
            <p className="text-white text-center">Sábados y domingos</p>
            <p className="text-white text-center text-small">
              No dude en pedir nuestrA rica paella
            </p>
          </section>
          <address className="basis-full md:basis-1/2">
            <div className="map__continer">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d235.07779539253391!2d-99.04527852136852!3d19.488104147451946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1fae320e0c44d%3A0xdbe46f7a75737be1!2sMARISQUERIDA!5e0!3m2!1ses-419!2smx!4v1698117503353!5m2!1ses-419!2smx"
                loading="lazy"
                className="map"
              ></iframe>
            </div>
            <div className="address__container">
              <p className="text-white text-small">Mercado Lázaro Cárdenas</p>
              <p className="text-white text-small">Valle de Aragón</p>
              <p className="text-white text-small">
                2da Sección Nezahualcóyotl
              </p>
              <p className="text-white text-small">Lunes a Domingo</p>
              <p className="text-white text-small">
                Horario de 09:30 a 18:00 hrs
              </p>
            </div>
          </address>
        </section>
      </footer>
    </>
  );
}
