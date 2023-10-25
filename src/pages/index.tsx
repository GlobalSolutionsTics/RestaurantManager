import Image from "next/image";
import { Inter } from "next/font/google";
import Head from "next/head";
import SectionComp from "@/components/section/Section";
import { useState } from "react";
import SaucerComp from "@/components/section/saucer";

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
              className="text-white basis-full md:basis-1/2 lg:basis-1/2"
              style={{ display: displayStyle === "1" ? "grid" : "none" }}
            >
              <SaucerComp
                title="Ensalada griega"
                description=""
                content="$150"
                className="saucer"
              />
              <SaucerComp
                title="Alambre de mariscos"
                description="Exquisita combinación de jaiba, camarón, pulpo y surimi"
                content="$200"
                className="saucer"
              />
              <SaucerComp
                title="Jaibas rellenas (2)"
                description="200gr"
                content="$135"
                className="saucer"
              />
              <SaucerComp
                title="Chile relleno de mariscos"
                description=""
                content="$110"
                className="saucer"
              />
              <SaucerComp
                title="Chile relleno de minilla"
                description=""
                content="$100"
                className="saucer"
              />
              <SaucerComp
                title="Langosta o Langostino"
                description="Sobre pedido (Precios según tamaño y temporada"
                content="$110"
                className="saucer"
              />
            </div>
          </div>
          <div
            onClick={() => displayVisibility("2")}
            className="text-white basis-full md:basis-1/2 lg:basis-1/2 "
          >
            <SectionComp
              title="Empanadas"
              description="Desde $40.00"
              content=""
              className="container empanada-bg bg"
            />
            <div
              id="2"
              className="saucer__container"
              style={{ display: displayStyle === "2" ? "grid" : "none" }}
            >
              <SaucerComp
                title="Empanada de pescado"
                description=""
                content="$40"
                className="saucer"
              />
              <SaucerComp
                title="Empanada de camarón"
                description=""
                content="$40"
                className="saucer"
              />
              <SaucerComp
                title="Empanada de Jaiba"
                description=""
                content="$50"
                className="saucer"
              />
              <SaucerComp
                title="Empanada de pulpo"
                description=""
                content="$60"
                className="saucer"
              />
            </div>
          </div>
          <div
            onClick={() => displayVisibility("3")}
            className="text-white basis-full md:basis-1/2 lg:basis-1/2"
          >
            <SectionComp
              title="Mojarras"
              description="Pregunta por nuestros precios"
              content=""
              className="container mojarra-bg bg"
            />
            <div
              id="3"
              className="saucer__container"
              style={{ display: displayStyle === "3" ? "grid" : "none" }}
            >
              <SaucerComp
                title="Mojarra frita"
                description=""
                content=""
                className="saucer"
              />
              <SaucerComp
                title="Mojarra a la diabla"
                description=""
                content=""
                className="saucer"
              />
              <SaucerComp
                title="Mojarra al mojo de ajo"
                description=""
                content=""
                className="saucer"
              />
              <SaucerComp
                title="Mojarra al chipotle"
                description=""
                content=""
                className="saucer"
              />
              <SaucerComp
                title="Mojarra a la mantequilla"
                description=""
                content=""
                className="saucer"
              />
              <SaucerComp
                title="Mojarra empapelada o rellena"
                description=""
                content=""
                className="saucer"
              />
              <SaucerComp
                title="Acompañadas de arroz y ensalada"
                description=""
                content=""
                className="saucer"
              />
              <SaucerComp
                title=""
                description=""
                content="Chica 500gr"
                className="saucer text-red-400 p-0 font-light note"
              />
              <SaucerComp
                title=""
                description=""
                content="Mediana 601 gr - 800 gr"
                className="saucer text-red-400 p-0"
              />
              <SaucerComp
                title=""
                description=""
                content="Grande 801 gr - 1Kg"
                className="saucer text-red-400 p-0"
              />
              <SaucerComp
                title=""
                description=""
                content="Extra Grande 1.1 kg - más"
                className="saucer text-red-400 p-0 text-end"
              />
            </div>
          </div>
          <div
            onClick={() => displayVisibility("4")}
            className="text-white basis-full md:basis-1/2 lg:basis-1/2"
          >
            <SectionComp
              title="Pulpo"
              description="Desde $180.00"
              content=""
              className="container pulpo-bg bg"
            />
            <div
              id="4"
              className="saucer__container"
              style={{ display: displayStyle === "4" ? "grid" : "none" }}
            >
              <SaucerComp
                title="Pulpo al chipotle"
                description=""
                content="$180"
                className="saucer"
              />
              <SaucerComp
                title="Pulpo a la mantequilla"
                description=""
                content="$180"
                className="saucer"
              />
              <SaucerComp
                title="Pulpo a la diabla"
                description=""
                content="$180"
                className="saucer"
              />
              <SaucerComp
                title="Pulpo al mojo de ajo"
                description=""
                content="$180"
                className="saucer"
              />
              <SaucerComp
                title="Pulpo al ajillo"
                description=""
                content="$180"
                className="saucer"
              />
              <SaucerComp
                title="Pulpo en su tinta"
                description=""
                content="$180"
                className="saucer"
              />
              <SaucerComp
                title=""
                description=""
                content="Acompañados con arroz y ensalada.Cada platillo contiene 200 gr de pulpo."
                className="saucer text-red-400 p-0 basis-full md:basis-1/2 lg:basis-1/2"
              />
            </div>
          </div>
          <div
            onClick={() => displayVisibility("5")}
            className="text-white basis-full md:basis-1/2 lg:basis-1/2"
          >
            <SectionComp
              title="Calamar"
              description="Desde $135.00"
              content=""
              className="container calamar-bg bg"
            />
            <div
              id="5"
              className="saucer__container"
              style={{ display: displayStyle === "5" ? "grid" : "none" }}
            >
              <SaucerComp
                title="Calamar al chipotle"
                description=""
                content="$135"
                className="saucer"
              />
              <SaucerComp
                title="Calamar a la manteuilla"
                description=""
                content="$135"
                className="saucer"
              />
              <SaucerComp
                title="Calamar a la diabla"
                description=""
                content="$135"
                className="saucer"
              />
              <SaucerComp
                title="Calamar al mojo de ajo"
                description=""
                content="$135"
                className="saucer"
              />
              <SaucerComp
                title="Calamar al ajillo"
                description=""
                content="$135"
                className="saucer"
              />
              <SaucerComp
                title=""
                description=""
                content="Acompañados con arroz y ensalada.Cada platillo contiene 200 gr de calamar."
                className="saucer text-red-400 p-0 basis-full md:basis-1/2 lg:basis-1/2"
              />
            </div>
          </div>
          <div
            onClick={() => displayVisibility("6")}
            className="text-white basis-full md:basis-1/2 lg:basis-1/2"
          >
            <SectionComp
              title="Tostadas"
              description="Desde $60.00"
              content=""
              className="container tostadas-bg bg"
            />
            <div
              id="6"
              className="saucer__container"
              style={{ display: displayStyle === "6" ? "grid" : "none" }}
            >
              <SaucerComp
                title="Tostadas de pescado"
                description=""
                content="$60"
                className="saucer"
              />
              <SaucerComp
                title="Tostadas de surimi"
                description=""
                content="$60"
                className="saucer"
              />
              <SaucerComp
                title="Tostadas de calamar"
                description=""
                content="$60"
                className="saucer"
              />
              <SaucerComp
                title="Tostadas de almeja"
                description=""
                content="$60"
                className="saucer"
              />
              <SaucerComp
                title="Tostadas de caracol"
                description=""
                content="$70"
                className="saucer"
              />
              <SaucerComp
                title="Tostadas de jaiba"
                description=""
                content="$70"
                className="saucer"
              />
              <SaucerComp
                title="Tostadas de camarón"
                description=""
                content="$70"
                className="saucer"
              />
              <SaucerComp
                title="Tostadas de pulpo"
                description=""
                content="$80"
                className="saucer"
              />
            </div>
          </div>
          <div
            onClick={() => displayVisibility("7")}
            className="text-white basis-full md:basis-1/2 lg:basis-1/2"
          >
            <SectionComp
              title="Cocteles"
              description="Desde $60.00"
              content=""
              className="container coctel-bg bg"
            />
            <div
              id="7"
              className="saucer__container"
              style={{ display: displayStyle === "7" ? "grid" : "none" }}
            ></div>
          </div>
          <div
            onClick={() => displayVisibility("8")}
            className="text-white basis-full md:basis-1/2 lg:basis-1/2"
          >
            <SectionComp
              title="Camarones"
              description="Desde $160.00"
              content=""
              className="container camarones-bg bg"
            />
            <div
              id="8"
              className="saucer__container"
              style={{ display: displayStyle === "8" ? "grid" : "none" }}
            ></div>
          </div>
          <div
            onClick={() => displayVisibility("9")}
            className="text-white basis-full md:basis-1/2 lg:basis-1/2"
          >
            <SectionComp
              title="Ceviches"
              description="Desde $65.00"
              content=""
              className="container ceviches-bg bg"
            />
            <div
              id="9"
              className="saucer__container"
              style={{ display: displayStyle === "9" ? "grid" : "none" }}
            ></div>
          </div>
          <div
            onClick={() => displayVisibility("10")}
            className="text-white basis-full md:basis-1/2 lg:basis-1/2"
          >
            <SectionComp
              title="Caldos"
              description="Desde $25.00"
              content=""
              className="container caldos-bg bg"
            />
            <div
              id="10"
              className="saucer__container"
              style={{ display: displayStyle === "10" ? "grid" : "none" }}
            ></div>
          </div>
          <div
            onClick={() => displayVisibility("11")}
            className="text-white basis-full md:basis-1/2 lg:basis-1/2"
          >
            <SectionComp
              title="Filetes de pescado"
              description="Desde $80.00"
              content=""
              className="container filetes-bg bg"
            />
            <div
              id="11"
              className="saucer__container"
              style={{ display: displayStyle === "11" ? "grid" : "none" }}
            ></div>
          </div>
          <div
            onClick={() => displayVisibility("12")}
            className="text-white basis-full md:basis-1/2 lg:basis-1/2"
          >
            <SectionComp
              title="Bebidas"
              description="Desde $20.00"
              content=""
              className="container bebida-bg bg"
            />
            <div
              id="12"
              className="saucer__container"
              style={{ display: displayStyle === "12" ? "grid" : "none" }}
            ></div>
          </div>
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
