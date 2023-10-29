import Image from "next/image";
import { Inter } from "next/font/google";
import Head from "next/head";
import SectionComp from "@/components/section/Section";
import { useState } from "react";
import SaucerComp from "@/components/saucer/Saucer";
import SaucerTable from "@/components/saucerTable/SaucerTable";

const inter = Inter({ subsets: ["latin"] });

export default function Home(id: string) {
  
  const [displayStyle, setDisplayStyle] = useState<string | null>(null);
  const displayVisibility = (divId: string) => {
    if (displayStyle === null || displayStyle !== divId ) {
      setDisplayStyle(divId);
    } else {
      setDisplayStyle(null);
    }
  };

  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <meta
          name='description'
          content='Marisquería en Valle del Vístula Esq, Valle de Oaxaca Int 92, Valle de Aragón 2da Secc, 57100 Municipio Nezahualcóyotl, Méx. ¡Disfruta de auténticos mariscos!'
        />
        <meta
          name='keywords'
          content='mariquería, mariscos, Valle del Vístula, Valle de Oaxaca, Valle de Aragón, Nezahualcóyotl, México'
        />
        <meta name='author' content='Marisquerida' />
        <meta name='robots' content='index, follow' />
        <meta name='googlebot' content='index, follow' />
        <meta name='geo.region' content='MX-MEX' />
        <meta name='geo.placename' content='Valle de Aragón, Nezahualcóyotl' />
        <meta
          name='geo.position'
          content='19.489105132153252;-99.04517983068608'
        />
        <meta name='ICBM' content='19.489105132153252, -99.04517983068608' />
        <meta
          property='og:title'
          content='Marisquería en Valle de Aragón, Nezahualcóyotl'
        />
        <meta
          property='og:description'
          content='¡Disfruta de auténticos mariscos en Valle del Vístula Esq, Valle de Oaxaca Int 92!'
        />
        <meta property='og:type' content='website' />
        <meta property='og:url' content='URL de tu sitio web' />
        <meta property='og:image' content='URL de la imagen representativa' />
        <meta property='og:site_name' content='Nombre de tu empresa' />
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:site' content='@tucuenta' />
        <meta
          name='twitter:title'
          content='Marisquería en Valle de Aragón, Nezahualcóyotl'
        />
        <meta
          name='twitter:description'
          content='¡Disfruta de auténticos mariscos en Valle del Vístula Esq, Valle de Oaxaca Int 92!'
        />
        <meta
          name='twitter:image'
          content='URL de la imagen representativa'
        ></meta>
        <title>
          Marisquerida | Marisque&iacute;a en Valle de Arag&oacute;n,
          Nezahualc&oacute;yotl | Delicias del Mar a tu Mesa
        </title>
      </Head>
      <nav className='navbar'>
        <Image
          className='logo'
          src='/logo_sin_fondo.png'
          alt='Logo marisquerida'
          width={96}
          height={96}
        />
      </nav>
      <div itemScope className='wood-font p-4 mid'>
        <h1 itemProp='name' className='title'>
          Marisquerida La Delicia del Mar | Desde 1978
        </h1>
        <h2 className='text-center text-white menu'>Menú</h2>
        <div className='flex justify-around md:flex-row flex-wrap'>
          <div
            className='text-white basis-full md:basis-1/3 lg:basis-1/3 m-2 saucer__style'
            onClick={() => displayVisibility("1")}
          >
            <SectionComp
              title='Especialidades'
              description='Desde $100.00'
              content=''
              className='container jaiba-bg bg'
            />
            <div
              id='1'
              className={`text-white basis-full md:basis-1/2 lg:basis-1/2`}
              style={{ display: displayStyle === "1" ? "block" : "none" }}
            >
              <SaucerComp
                title='Ensalada griega'
                description=''
                content='$150'
                className='saucer'
              />
              <SaucerComp
                title='Alambre de mariscos'
                description='Exquisita combinación de jaiba, camarón, pulpo y surimi'
                content='$200'
                className='saucer'
              />
              <SaucerComp
                title='Jaibas rellenas (2)'
                description='200gr'
                content='$135'
                className='saucer'
              />
              <SaucerComp
                title='Chile relleno de mariscos'
                description=''
                content='$110'
                className='saucer'
              />
              <SaucerComp
                title='Chile relleno de minilla'
                description=''
                content='$100'
                className='saucer'
              />
              <SaucerComp
                title='Langosta o Langostino'
                description='Sobre pedido (Precios según tamaño y temporada'
                content='$110'
                className='saucer'
              />
            </div>
          </div>
          <div
            onClick={(() => displayVisibility("2"))}
            className='text-white basis-full md:basis-1/3 lg:basis-1/3 m-2 saucer__style'
          >
            <SectionComp
              title='Empanadas'
              description='Desde $40.00'
              content=''
              className='container empanada-bg bg'
            />
            <div
              id='2'
              className='saucer__container'
              style={{ display: displayStyle === "2" ? "grid" : "none" }}
            >
              <SaucerComp
                title='Empanada de pescado'
                description=''
                content='$40'
                className='saucer'
              />
              <SaucerComp
                title='Empanada de camarón'
                description=''
                content='$40'
                className='saucer'
              />
              <SaucerComp
                title='Empanada de Jaiba'
                description=''
                content='$50'
                className='saucer'
              />
              <SaucerComp
                title='Empanada de pulpo'
                description=''
                content='$60'
                className='saucer'
              />
            </div>
          </div>
          <div
            onClick={() => displayVisibility("3")}
            className='text-white basis-full md:basis-1/3 lg:basis-1/3 m-2 saucer__style'
          >
            <SectionComp
              title='Mojarras'
              description='Pregunta por nuestros precios'
              content=''
              className='container mojarra-bg bg'
            />
            <div
              id='3'
              className='saucer__container'
              style={{ display: displayStyle === "3" ? "grid" : "none" }}
            >
              <SaucerComp
                title='Mojarra frita'
                description=''
                content=''
                className='saucer'
              />
              <SaucerComp
                title='Mojarra a la diabla'
                description=''
                content=''
                className='saucer'
              />
              <SaucerComp
                title='Mojarra al mojo de ajo'
                description=''
                content=''
                className='saucer'
              />
              <SaucerComp
                title='Mojarra al chipotle'
                description=''
                content=''
                className='saucer'
              />
              <SaucerComp
                title='Mojarra a la mantequilla'
                description=''
                content=''
                className='saucer'
              />
              <SaucerComp
                title='Mojarra empapelada o rellena'
                description=''
                content=''
                className='saucer'
              />
              <SaucerComp
                title='Acompañadas de arroz y ensalada'
                description=''
                content=''
                className='saucer'
              />
              <SaucerComp
                title='Chica 500gr'
                description=''
                content=''
                className='saucer text-red-400 p-0'
              />
              <SaucerComp
                title='Mediana 601 gr - 800 gr'
                description=''
                content=''
                className='saucer text-red-400 p-0'
              />
              <SaucerComp
                title='Grande 801 gr - 1Kg'
                description=''
                content=''
                className='saucer text-red-400 p-0'
              />
              <SaucerComp
                title='Extra Grande 1.1 kg - más'
                description=''
                content=''
                className='saucer text-red-400 p-0 '
              />
            </div>
          </div>
          <div
            onClick={() => displayVisibility("4")}
            className='text-white basis-full md:basis-1/3 lg:basis-1/3 m-2 saucer__style'
          >
            <SectionComp
              title='Pulpo'
              description='Desde $180.00'
              content=''
              className='container pulpo-bg bg'
            />
            <div
              id='4'
              className='saucer__container'
              style={{ display: displayStyle === "4" ? "grid" : "none" }}
            >
              <SaucerComp
                title='Pulpo al chipotle'
                description=''
                content='$180'
                className='saucer'
              />
              <SaucerComp
                title='Pulpo a la mantequilla'
                description=''
                content='$180'
                className='saucer'
              />
              <SaucerComp
                title='Pulpo a la diabla'
                description=''
                content='$180'
                className='saucer'
              />
              <SaucerComp
                title='Pulpo al mojo de ajo'
                description=''
                content='$180'
                className='saucer'
              />
              <SaucerComp
                title='Pulpo al ajillo'
                description=''
                content='$180'
                className='saucer'
              />
              <SaucerComp
                title='Pulpo en su tinta'
                description=''
                content='$180'
                className='saucer'
              />
              <SaucerComp
                title=''
                description=''
                content='Acompañados con arroz y ensalada.Cada platillo contiene 200 gr de pulpo.'
                className='saucer text-red-400 p-0'
              />
            </div>
          </div>
          <div
            onClick={() => displayVisibility("5")}
            className='text-white basis-full md:basis-1/3 lg:basis-1/3 m-2 saucer__style'
          >
            <SectionComp
              title='Calamar'
              description='Desde $135.00'
              content=''
              className='container calamar-bg bg'
            />
            <div
              id='5'
              className='saucer__container'
              style={{ display: displayStyle === "5" ? "grid" : "none" }}
            >
              <SaucerComp
                title='Calamar al chipotle'
                description=''
                content='$135'
                className='saucer'
              />
              <SaucerComp
                title='Calamar a la manteuilla'
                description=''
                content='$135'
                className='saucer'
              />
              <SaucerComp
                title='Calamar a la diabla'
                description=''
                content='$135'
                className='saucer'
              />
              <SaucerComp
                title='Calamar al mojo de ajo'
                description=''
                content='$135'
                className='saucer'
              />
              <SaucerComp
                title='Calamar al ajillo'
                description=''
                content='$135'
                className='saucer'
              />
              <SaucerComp
                title=''
                description=''
                content='Acompañados con arroz y ensalada.Cada platillo contiene 200 gr de calamar.'
                className='saucer text-red-400 p-0 basis-full md:basis-1/2 lg:basis-1/2'
              />
            </div>
          </div>
          <div
            onClick={() => displayVisibility("6")}
            className='text-white basis-full md:basis-1/3 lg:basis-1/3 m-2 saucer__style'
          >
            <SectionComp
              title='Tostadas'
              description='Desde $60.00'
              content=''
              className='container tostadas-bg bg'
            />
            <div
              id='6'
              className='saucer__container'
              style={{ display: displayStyle === "6" ? "grid" : "none" }}
            >
              <SaucerComp
                title='Tostadas de pescado'
                description=''
                content='$60'
                className='saucer'
              />
              <SaucerComp
                title='Tostadas de surimi'
                description=''
                content='$60'
                className='saucer'
              />
              <SaucerComp
                title='Tostadas de calamar'
                description=''
                content='$60'
                className='saucer'
              />
              <SaucerComp
                title='Tostadas de almeja'
                description=''
                content='$60'
                className='saucer'
              />
              <SaucerComp
                title='Tostadas de caracol'
                description=''
                content='$70'
                className='saucer'
              />
              <SaucerComp
                title='Tostadas de jaiba'
                description=''
                content='$70'
                className='saucer'
              />
              <SaucerComp
                title='Tostadas de camarón'
                description=''
                content='$70'
                className='saucer'
              />
              <SaucerComp
                title='Tostadas de pulpo'
                description=''
                content='$80'
                className='saucer'
              />
            </div>
          </div>
          <div
            onClick={() => displayVisibility("7")}
            className='text-white basis-full md:basis-1/3 lg:basis-1/3 m-2 saucer__style'
          >
            <SectionComp
              title='Cocteles'
              description='Desde $60.00'
              content=''
              className='container coctel-bg bg'
            />
            <div
              id='7'
              className='saucer__container'
              style={{ display: displayStyle === "7" ? "grid" : "none" }}
            >
              <SaucerTable
                title='Cocteles'
                description=''
                content=''
                row1='Ch'
                row2='Med'
                row3='Gde'
                className='text-xl'
              />
              <SaucerTable
                title='Pulpo'
                description=''
                content=''
                row1='$80'
                row2='$120'
                row3='$160'
              />
              <SaucerTable
                title='Camaron'
                description=''
                content=''
                row1='$65'
                row2='$100'
                row3='$135'
              />
              <SaucerTable
                title='Ostión'
                description=''
                content=''
                row1='$65'
                row2='$100'
                row3='$135'
              />
              <SaucerTable
                title='Campechana'
                description=''
                content=''
                row1='$65'
                row2='$100'
                row3='$135'
              />
              <SaucerTable
                title='Pata de mula'
                description=''
                content=''
                row1='$60'
                row2='$90'
                row3='$125'
              />
              <SaucerTable
                title='Vuelve a la vida'
                description=''
                content=''
                row1=''
                row2='$100'
                row3='$150'
              />
              <SaucerTable
                title=''
                description=''
                content=''
                row1=''
                row2='6 pzas'
                row3='12 pzas'
              />
              <SaucerTable
                title='Ostión en su concha'
                description=''
                content=''
                row1=''
                row2='$100'
                row3='$140'
              />
              <SaucerTable
                title='Ostión Rocketfeller'
                description='(10pzs)'
                content=''
                row1=''
                row2='$190'
                row3=''
              />
            </div>
          </div>
          <div
            onClick={() => displayVisibility("8")}
            className='text-white basis-full md:basis-1/3 lg:basis-1/3 m-2 saucer__style'
          >
            <SectionComp
              title='Camarones'
              description='Desde $160.00'
              content=''
              className='container camarones-bg bg'
            />
            <div
              id='8'
              className='saucer__container'
              style={{ display: displayStyle === "8" ? "grid" : "none" }}
            >
              <SaucerComp
                title='Camarones a la mexicana'
                description=''
                content='$160'
                className='saucer'
              />
              <SaucerComp
                title='Camarones al chipotle'
                description=''
                content='$190'
                className='saucer'
              />
              <SaucerComp
                title='Camarones a la mantequilla'
                description=''
                content='$190'
                className='saucer'
              />
              <SaucerComp
                title='Camarones a la diabla'
                description=''
                content='$190'
                className='saucer'
              />
              <SaucerComp
                title='Camarones al mojo de ajo'
                description=''
                content='$190'
                className='saucer'
              />
              <SaucerComp
                title='Camarones empanizados'
                description=''
                content='$190'
                className='saucer'
              />
              <SaucerComp
                title='Camarones al ajillo'
                description=''
                content='$190'
                className='saucer'
              />
              <SaucerComp
                title='Camarones para pelar'
                description=''
                content='$165'
                className='saucer'
              />
              <SaucerComp
                title='Camarones a la gabardina'
                description=''
                content='$190'
                className='saucer'
              />
              <SaucerComp
                title=''
                description=''
                content='Acompañados con arroz y ensalada.Cada platillo contiene 200gr de camarones.'
                className='saucer text-red-400 p-0'
              />
            </div>
          </div>
          <div
            onClick={() => displayVisibility("9")}
            className='text-white basis-full md:basis-1/3 lg:basis-1/3 m-2 saucer__style'
          >
            <SectionComp
              title='Ceviches'
              description='Desde $65.00'
              content=''
              className='container ceviches-bg bg'
            />
            <div
              id='9'
              className='saucer__container'
              style={{ display: displayStyle === "9" ? "grid" : "none" }}
            >
              <SaucerTable
                title='Ceviches'
                description=''
                content=''
                row1='Ch'
                row2='Med'
                row3='Gde'
                className='text-xl'
              />
              <SaucerTable
                title='De calamar'
                description=''
                content=''
                row1='$65'
                row2='$100'
                row3='$135'
              />
              <SaucerTable
                title='De surimi'
                description=''
                content=''
                row1='$65'
                row2='$100'
                row3='135'
              />
              <SaucerTable
                title='De pescado'
                description=''
                content=''
                row1='$65'
                row2='$100'
                row3='$135'
              />
              <SaucerTable
                title='De jaiba'
                description=''
                content=''
                row1='$65'
                row2='$100'
                row3='$135'
              />
              <SaucerTable
                title='De caracol'
                description=''
                content=''
                row1='$65'
                row2='$100'
                row3='$135'
              />
              <SaucerTable
                title='De pulpo'
                description=''
                content=''
                row1='$70'
                row2='$110'
                row3='$145'
              />
              <SaucerTable
                title='De almeja'
                description=''
                content=''
                row1='$65'
                row2='$100'
                row3='$135'
              />
            </div>
          </div>
          <div
            onClick={() => displayVisibility("10")}
            className='text-white basis-full md:basis-1/3 lg:basis-1/3 m-2 saucer__style'
          >
            <SectionComp
              title='Caldos'
              description='Desde $25.00'
              content=''
              className='container caldos-bg bg'
            />
            <div
              id='10'
              className='saucer__container'
              style={{ display: displayStyle === "10" ? "grid" : "none" }}
            >
              <SaucerTable
                title='Caldos'
                description=''
                content=''
                row1='Ch'
                row2='Med'
                row3='Gde'
                className='text-xl'
              />
              <SaucerTable
                title='De camarón'
                description=''
                content=''
                row1='$35'
                row2='$70'
                row3='$90'
              />
              <SaucerTable
                title='De pescado'
                description=''
                content=''
                row1='$30'
                row2='$60'
                row3='$80'
              />
              <SaucerTable
                title='Campechano'
                description=''
                content=''
                row1='$30'
                row2='$80'
                row3='$120'
              />
              <SaucerTable
                title='Sopa de mariscos'
                description=''
                content='(Rica combinación de pescado, ostión, camarón, almeja, jaiba y pulpo)'
                row1=''
                row2='$200'
                row3=''
              />
              <SaucerTable
                title='Caldo de jarrito s/camarón'
                description=''
                content=''
                row1=''
                row2='$25'
                row3=''
              />
            </div>
          </div>
          <div
            onClick={() => displayVisibility("11")}
            className='text-white basis-full md:basis-1/3 lg:basis-1/3 m-2 saucer__style'
          >
            <SectionComp
              title='Filetes de pescado'
              description='Desde $80.00'
              content=''
              className='container filetes-bg bg'
            />
            <div
              id='11'
              className='saucer__container'
              style={{ display: displayStyle === "11" ? "grid" : "none" }}
            >
              <SaucerComp
                title='Filete a la mexicana.'
                description='200gr.'
                content='$90'
                className='saucer'
              />
              <SaucerComp
                title='Filete asado.'
                description='200gr.'
                content='$90'
                className='saucer'
              />
              <SaucerComp
                title='Filete empanizado.'
                description='120gr.'
                content='$80'
                className='saucer'
              />
              <SaucerComp
                title='Filete al mojo de ajo.'
                description='200gr.'
                content='$90'
                className='saucer'
              />
              <SaucerComp
                title='Filete a la diabla.'
                description='200gr.'
                content='$90'
                className='saucer'
              />
              <SaucerComp
                title='Filete al chipotle.'
                description='200gr.'
                content='$90'
                className='saucer'
              />
              <SaucerComp
                title='Filete a la mantequilla.'
                description='200gr.'
                content='$90'
                className='saucer'
              />
              <SaucerComp
                title='*Filete relleno.'
                description='200gr.'
                content='$190'
                className='saucer'
              />
              <SaucerComp
                title='*Filete light con queso.'
                description='200gr.'
                content='$135'
                className='saucer'
              />
            </div>
          </div>
          <div
            onClick={() => displayVisibility("12")}
            className='text-white basis-full md:basis-1/3 lg:basis-1/3 m-2 saucer__style'
          >
            <SectionComp
              title='Tacos'
              description='Desde $135.00'
              content=''
              className='container tacos-bg bg'
            />
            <div
              id='12'
              className='saucer__container'
              style={{ display: displayStyle === "12" ? "grid" : "none" }}
            >
              <SaucerComp
                title='Tacos gobernador de camarón o marlín'
                description='(camarones o marlín guisados y gratinados con queso).'
                content='$180'
                className='saucer'
              />
              <SaucerComp
                title=''
                description='Acompañados con rico guacamole'
                content=''
                className='saucer'
              />
            </div>
          </div>
          <div
            onClick={() => displayVisibility("13")}
            className='text-white basis-full md:basis-1/3 lg:basis-1/3 m-2 saucer__style'
          >
            <SectionComp
              title='Otros'
              description='Desde $55.00/Orden'
              content=''
              className='container otros-bg bg'
            />
            <div
              id='13'
              className='saucer__container'
              style={{ display: displayStyle === "13" ? "grid" : "none" }}
            >
              <SaucerTable
                title='Otros'
                description=''
                content=''
                row1='Orden(3)'
                row2=''
                row3='Pza.'
                className='text-lg'
              />
              <SaucerTable
                title='Filetitos fritos'
                description=''
                content=''
                row1='$70'
                row2=''
                row3='$26'
              />
              <SaucerTable
                title='Quesadilla de Minilla'
                description=''
                content=''
                row1='$55'
                row2=''
                row3='$23'
              />
              <SaucerTable
                title='Quesadilla de Camarón'
                description=''
                content=''
                row1='$75'
                row2=''
                row3='$28'
              />
              <SaucerTable
                title='Quesadilla de Jaiba'
                description=''
                content=''
                row1='$75'
                row2=''
                row3='$28'
              />
            </div>
          </div>
          <div
            onClick={() => displayVisibility("14")}
            className='text-white basis-full md:basis-1/3 lg:basis-1/3 m-2 saucer__style'
          >
            <SectionComp
              title='Bebidas'
              description='Desde $20.00'
              content=''
              className='container bebida-bg bg'
            />
            <div
              id='14'
              className='saucer__container'
              style={{ display: displayStyle === "14" ? "grid" : "none" }}
            >
              <SaucerComp
                title='Refrescos'
                description=''
                content='$20'
                className=''
              />
              <SaucerComp
                title='Refrescos preparados'
                description=''
                content='$35 '
                className=''
              />
              <SaucerComp
                title='Limonada o Naranjada'
                description=''
                content='$35'
                className=''
              />
              <SaucerComp
                title='Michelada'
                description=''
                content='$40'
                className=''
              />
              <SaucerComp
                title='Cerveza'
                description=''
                content='$33'
                className=''
              />
              <SaucerComp
                title='Michelada con clamato'
                description=''
                content='$45'
                className=''
              />
              <SaucerComp
                title='Michelada con camaron'
                description=''
                content='$90'
                className=''
              />
              <SaucerComp
                title='Michelada con ostión'
                description=''
                content='$90'
                className=''
              />
              <SaucerComp
                title='Michelada especial'
                description='(Camarón, ostión y clamato)'
                content='$100'
                className=''
              />
              <SaucerComp
                title='Querida michelada'
                description=''
                content='$180'
                className=''
              />
            </div>
          </div>
          <div
            onClick={() => displayVisibility("15")}
            className='text-white basis-full md:basis-1/3 lg:basis-1/3 m-2 saucer__style'
          >
            <SectionComp
              title='Postres'
              description='Desde $40.00'
              content=''
              className='container postres-bg bg'
            />
            <div
              id='15'
              className='saucer__container'
              style={{ display: displayStyle === "15" ? "grid" : "none" }}
            >
              <SaucerComp
                title='Duraznos con crema'
                description=''
                content='$40'
                className='saucer'
              />
              <SaucerComp
                title='Chongos Zamoranos'
                description=''
                content='$40'
                className='saucer'
              />
              <SaucerComp
                title='Flan Horneado'
                description=''
                content='$40'
                className='saucer'
              />
              <SaucerComp
                title='Mousse de Yogurth'
                description=''
                content='$40'
                className='saucer'
              />
              <SaucerComp
                title='Fresas con Crema'
                description=''
                content='$40'
                className='saucer'
              />
              <SaucerComp
                title='Arroz con Leche'
                description=''
                content='$40'
                className='saucer'
              />
            </div>
          </div>
        </div>
      </div>

      <footer className='p-4 bg-black'>
        <section className='flex flex-col md:flex-row'>
          <section className='basis-full md:basis-1/2'>
            <p className="text-white text-center text-xl">Visítanos!</p>
            <div className="py-2">
              <p className='text-white text-center'>Lunes a Domingo</p>
              <p className='text-white text-small text-center'>
              Horario de 09:30 a 18:00 hrs
            </p>
            </div>
            <div className="py-2">
              <p className='text-white text-center'>Sábados y Domingos</p>
              <p className='text-white text-center text-small'>
              No dude en pedir nuestra rica paella
            </p>
            </div>
          </section>
          <section className='basis-full md:basis-1/2'>
              <div className="flex justify-center">
                <img src="./logo_con_fondo.png" alt="" className="footer__logo"/>
              </div>
            <div className="py-4">
              <p className='text-white text-center text-xl py-2'>No olvides seguirnos!!</p>
              <p className='text-white text-center'>Nuestras redes Sociales:</p>
              <ul className="flex justify-center p-2 md:flex-row flex-wrap">
                <li className="px-4">
                  <a href="https://www.facebook.com/MarisQuerida/" className="social__media fb" target="_blank">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z"></path></svg>
                  </a>
                </li>
                <li className="px-4">
                  <a href="https://www.instagram.com/marisquerida/" className="social__media ig" target="_blank">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M20.947 8.305a6.53 6.53 0 0 0-.419-2.216 4.61 4.61 0 0 0-2.633-2.633 6.606 6.606 0 0 0-2.186-.42c-.962-.043-1.267-.055-3.709-.055s-2.755 0-3.71.055a6.606 6.606 0 0 0-2.185.42 4.607 4.607 0 0 0-2.633 2.633 6.554 6.554 0 0 0-.419 2.185c-.043.963-.056 1.268-.056 3.71s0 2.754.056 3.71c.015.748.156 1.486.419 2.187a4.61 4.61 0 0 0 2.634 2.632 6.584 6.584 0 0 0 2.185.45c.963.043 1.268.056 3.71.056s2.755 0 3.71-.056a6.59 6.59 0 0 0 2.186-.419 4.615 4.615 0 0 0 2.633-2.633c.263-.7.404-1.438.419-2.187.043-.962.056-1.267.056-3.71-.002-2.442-.002-2.752-.058-3.709zm-8.953 8.297c-2.554 0-4.623-2.069-4.623-4.623s2.069-4.623 4.623-4.623a4.623 4.623 0 0 1 0 9.246zm4.807-8.339a1.077 1.077 0 0 1-1.078-1.078 1.077 1.077 0 1 1 2.155 0c0 .596-.482 1.078-1.077 1.078z"></path><circle cx="11.994" cy="11.979" r="3.003"></circle></svg>
                  </a>
                </li>
              </ul>
            </div>
          </section>
          <address className='basis-full md:basis-1/2'>
            <div className='map__continer'>
              <iframe
                src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d235.07779539253391!2d-99.04527852136852!3d19.488104147451946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1fae320e0c44d%3A0xdbe46f7a75737be1!2sMARISQUERIDA!5e0!3m2!1ses-419!2smx!4v1698117503353!5m2!1ses-419!2smx'
                loading='lazy'
                className='map'
              ></iframe>
            </div>
            <div className='address__container'>
              <p className='text-white text-small'>Mercado Lázaro Cárdenas</p>
              <p className='text-white text-small'>Valle de Aragón</p>
              <p className='text-white text-small'>
                2da Sección Nezahualcóyotl
              </p>
            </div>
          </address>
        </section>
      </footer>
    </>
  );
}
