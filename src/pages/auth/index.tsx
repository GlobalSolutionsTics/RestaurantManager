import Head from "next/head";

const IndexComp = () => {
  const handleUser = (e: any) => {
    e.preventDefault();
    console.log(e.data);
  };

  return (
    <>
      <Head>
        <title>Inicio</title>
      </Head>
      <section>
        <div className='saucer__font'>
          <div className='container__auth'>
            <div className='flex justify-center'>
              <img src='./logo_con_fondo.png' alt='' className='w-44' />
            </div>
            <form className='auth__form' onSubmit={handleUser}>
              <ul>
                <li className='grid my-2'>
                  <label className='name__label' htmlFor='name'>
                    Nombre:
                  </label>
                  <input
                    className='rounded-full name__input'
                    placeholder='Nombre'
                    type='text'
                    name='name'
                    id='user_name'
                  />
                </li>
                <li className='grid my-2'>
                  <label className='password__label' htmlFor='password'>
                    Contraseña:
                  </label>
                  <input
                    className='rounded-full password__input'
                    placeholder='Contraseña'
                    type='password'
                    name='password'
                    id='user_password'
                  />
                </li>
                <li>
                  <button className='rounded-full submit__btn' type='submit'>
                    Ingresar
                  </button>
                </li>
              </ul>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default IndexComp;
