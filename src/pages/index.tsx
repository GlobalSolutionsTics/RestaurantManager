import Image from "next/image";
import { Inter } from "next/font/google";
import Head from "next/head";

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
      <nav>
        <Image
          src="/logo_sin_fondo.png"
          alt="Logo marisquerida"
          width={100}
          height={100}
        />
      </nav>
    </>
  );
}
