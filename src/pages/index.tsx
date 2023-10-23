import Image from "next/image";
import { Inter } from "next/font/google";
import Head from "next/head";
import SectionComp from "@/components/section/Section";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
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
          src="/logo_sin_fondo.png"
          alt="Logo marisquerida"
          width={64}
          height={64}
        />
      </nav>
      <div itemScope className="wood-font p-4">
        <h1 itemProp="name" className="title">
          Marisquerida La Delicia del Mar | Desde 1978
        </h1>
        <h2 className="text-center text-white">Menú</h2>
        <div className="flex flex-col md:flex-row flex-wrap">
          <SectionComp
            title="Especialidades"
            description="Desde $100.00"
            className="text-white basis-full md:basis-1/2 lg:basis-1/3 jaiba-bg"
          />
          <SectionComp
            title="Empanadas"
            description="Desde $40.00"
            className="text-white basis-full md:basis-1/2 lg:basis-1/3"
          />
          <SectionComp
            title="Mojarras"
            description="Pregunta por nuestros precios"
            className="text-white basis-full md:basis-1/2 lg:basis-1/3"
          />
          <SectionComp
            title="Pulpo"
            description="Desde $180.00"
            className="text-white basis-full md:basis-1/2 lg:basis-1/3"
          />
          <SectionComp
            title="Calamar"
            description="Desde $135.00"
            className="text-white basis-full md:basis-1/2 lg:basis-1/3"
          />
          <SectionComp
            title="Tostadas"
            description="Desde $60.00"
            className="text-white basis-full md:basis-1/2 lg:basis-1/3"
          />
          <SectionComp
            title="Cocteles"
            description="Desde $60.00"
            className="text-white basis-full md:basis-1/2 lg:basis-1/3"
          />
          <SectionComp
            title="Camarones"
            description="Desde $160.00"
            className="text-white basis-full md:basis-1/2 lg:basis-1/3"
          />
          <SectionComp
            title="Ceviches"
            description="Desde $65.00"
            className="text-white basis-full md:basis-1/2 lg:basis-1/3"
          />
          <SectionComp
            title="Caldos"
            description="Desde $25.00"
            className="text-white basis-full md:basis-1/2 lg:basis-1/3"
          />
          <SectionComp
            title="Filetes de pescado"
            description="Desde $80.00"
            className="text-white basis-full md:basis-1/2 lg:basis-1/3"
          />
          <SectionComp
            title="Bebidas"
            description="Desde $20.00"
            className="text-white basis-full md:basis-1/2 lg:basis-1/3"
          />
        </div>
      </div>

      <footer className="p-4 bg-black">
        <section className="flex flex-col md:flex-row">
          <section className="basis-full md:basis-1/2">
            <p className="text-white text-center">Sábados y domingos</p>
            <p className="text-white text-center text-small">
              No dude en pedir nuestrá rica paella
            </p>
          </section>
          <address className="basis-full md:basis-1/2">
            <p className="text-white text-small">Mercado Lázaro Cárdenas</p>
            <p className="text-white text-small">Valle de Aragón</p>
            <p className="text-white text-small">2da Sección Nezahualcóyotl</p>
            <p className="text-white text-small">
              Horario de 09:30 a 18:00 hrs
            </p>
          </address>
        </section>
      </footer>
    </>
  );
}
