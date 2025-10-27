// import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom'; 
import Bg from '../../assets/Images/login/ImageToStl.com_backgroundLogin.avif'
import LoginLogo from '../../assets/Images/login/logo-Isotopo.avif'
import googleIcon from '../../assets/Images/login/googleIcon.avif'
import { useLogin } from '../../hooks/useLogin';
import { AlertCircle, CheckCircle } from 'lucide-react';

function Login( { setUser } ) {
  const {
    email,
    password,
    setEmail,
    setPassword,
    isLoading,
    error,
    success,
    fieldErrors,
    handleLogin,
    validateFields,
  } = useLogin(setUser);

const handleGoogleLogin = () => {
    // Ahora apunta a la ruta que INICIA el flujo de Auth0
    window.location.href = "http://localhost:3000/api/auth/google/login"; 
};

  // Función para manejar el Enter en los inputs
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleLogin();
    }
  };

  //verified if the function exists
  //console.log("useLogin hook:", useLogin);


  return (
    <main
      className="w-screen h-screen bg-amber-700 bg-cover bg-center overflow-hidden z-0 relative justify-start"
      style={{ backgroundImage: `url(${Bg})` }}
    >
      {/*----------------login container------------------ */}
      <div className='w-[464px] h-screen gap-[var(--marging-section-M)] flex flex-col justify-center items-center 
      px-[var(--marging-section-M)] pt-[var(--marging-section-M)] pb-[var(--marging-section-S)]
      bg-[var(--color-bg-white)] border-[1.5px] border-[var(--color-border-gray)]'>

        {/*---------------Header--------------- */}
        <div className='flex flex-row w-full justify-between items-center'>
          <h1 className='heading1 text-[var(--color-text-black)]'>Login</h1>
          <img
            className='w-[230.18px]'
            src={LoginLogo}
            alt="Main logo"
            loading='lazy' // Corregido: era lazy='loading', debe ser loading='lazy'
          />
        </div>

        {/*---------------Formulario completo--------------- */}
        <div className='gap-[var(--marging-section-M)] flex flex-col items-start w-full'>

          {/*---------------User name--------------- */}
          <div className='gap-[var(--marging-S)] flex flex-col items-start w-full'>
            <h2 className='heading2 text-[var(--color-text-black)]'>User</h2>
            <div className='relative w-full'>

              <input
                type="text" // Cambiado de "email" a "text" porque es un username
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Correcto: actualiza username
                onBlur={validateFields} // Valida cuando el usuario sale del campo
                onKeyPress={handleKeyPress} // Permite enviar con Enter
                className={`block supportingText text-[var(--color-text-black)] w-full p-[var(--marging-M)] bg-white rounded-[var(--radius-xl)] focus:ring-2 focus:ring-blue-500 focus:border-transparent ${fieldErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Enter your email address"
                disabled={isLoading}
              />
            </div>

            {/* Mostrar error de validación del username si existe */}
            {fieldErrors.email && (
              <p className="text-red-600 text-sm">{fieldErrors.email}</p>
            )}
          </div>

          {/*-----------------Password-------------------- */}
          <div className='gap-[var(--marging-S)] flex flex-col items-start w-full'>
            <h2 className='heading2 text-[var(--color-text-black)]'>Password</h2>
            <div className='relative w-full'>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // CORREGIDO: era setUsername, debe ser setPassword
                onBlur={validateFields} // Valida cuando el usuario sale del campo
                onKeyPress={handleKeyPress} // Permite enviar con Enter
                className={`block supportingText text-[var(--color-text-black)] w-full p-[var(--marging-M)] bg-white rounded-[var(--radius-xl)] focus:ring-2 focus:ring-blue-500 focus:border-transparent ${fieldErrors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Enter your password"
                disabled={isLoading}
              />
            </div>

            {/* Mostrar error de validación del password si existe */}
            {fieldErrors.password && (
              <p className="text-red-600 text-sm">{fieldErrors.password}</p>
            )}

            {/*---------------Link de recuperación de contraseña (opcional)--------------- */}
            <div className="w-full h-[34px] item-start pt-[var(--marging-M)]">
              <button
                type="button"
                className="bodyText text-[var(--color-text-purple)] hover:underline"
                onClick={() => {
                  // Aquí podrías navegar a una página de recuperación
                  // navigate('/forgot-password');
                  console.log('Ir a recuperar contraseña');
                }}
              >
                Forgot password?
              </button>
            </div>
          </div>

          {/*---------------Mensajes de error/éxito generales--------------- */}
          {/* Mensaje de error general (problemas de servidor, red, etc.) */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-800 w-full">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Mensaje de éxito */}
          {success && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 text-green-800 w-full">
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">¡Login exitoso! Bienvenido {email}</p>
            </div>
          )}

          {/*---------------Botón de login--------------- */}
          <div className='flex flex-col gap-[var(--marging-section-S)] w-full'>
            <button
              type="button"
              onClick={handleLogin} // Llama a la función de login del hook
              disabled={isLoading} // Deshabilita el botón mientras está cargando
              className="supportingText w-full text-[var(--color-text-white)] py-[17px] px-[115px] rounded-[50px]
               disabled:opacity-50 disabled:cursor-not-allowed bg-conic-180 from-purple-500 via-neutral-900 to-purple-500"
              style={{
                background:
                  ''
              }}
            >
              {isLoading ? 'Loggin in' : 'Login'}
            </button>

            <button
              type="button"
              onClick={handleGoogleLogin } // Llama a la función de login del hook
              disabled={isLoading} // Deshabilita el botón mientras está cargando
              className="supportingText felx items-center justify-center inline-flex w-full text-[var(--color-text-black)] py-[17px] px-[12px] rounded-[50px]
               disabled:opacity-50 disabled:cursor-not-allowed bg-white gap-[var(--marging-S)] border-[1px] border-[var(--color-border-gray)]"
              style={{
                background:
                  ''
              }}
            > <img src={googleIcon} alt="" className='w-[18px] ' />
              {isLoading ? 'Signning up' : 'Sign in with Google'}
            </button>
          </div>
        </div>
        {/*------------------Sign up link-------------------- */}
        <div className=' flex flex-row gap-[var(--padding-s)] justify-center items-center w-full px-[var(--marging-section-M)] pt-[var(--marging-section-M)] h-auto'>
          <p className='bodyText text-[var(--color-text-black)]'>
            Don’t have an account?
          </p>
          <Link to="/signUp" className='bodyText text-[var(--color-text-purple)] hover:underline'>
          Sign up
          </Link>
        </div>
      </div>
    </main>
  );


}

export default Login;