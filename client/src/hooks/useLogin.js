import { useNavigate } from "react-router-dom";
import { useState, useCallback } from 'react'; // ✅ Agregado useCallback
import { jwtDecode } from "jwt-decode";

import {
    validateLoginForm,
    loginRequest,
    saveAuthToken,
    saveUserData,
    formatErrorMessage
} from '../helper/authHelpers.js';

/**
 * Hook personalizado que maneja toda la lógica del login
 * Este hook encapsula el estado y las operaciones relacionadas
 * con el proceso de autenticación
 */
export const useLogin = (setUser) => {
    const navigate = useNavigate();
    // Estados para manejar los datos del formulario
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Estados para manejar el flujo de la aplicación
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Estados para mostrar errores de validación en tiempo real
    const [fieldErrors, setFieldErrors] = useState({});

    /**
     * Función que valida los campos en tiempo real
     * Se puede llamar cuando el usuario deja un campo (onBlur)
     * ✅ Ahora envuelta en useCallback para evitar re-renders innecesarios
     */
    const validateFields = useCallback(() => {
        const validation = validateLoginForm(email, password);
        setFieldErrors(validation.errors);
        return validation.isValid;
    }, [email, password]); // ✅ Solo se recrea si cambia email o password

    /**
     * Función principal que maneja el proceso completo de login
     * ✅ Ahora envuelta en useCallback para evitar re-renders innecesarios
     */
    const handleLogin = useCallback(async () => {
        console.log('🔐 Iniciando login...'); // ✅ Debug
        // Limpia errores previos
        setError(null);
        setFieldErrors({});

        // PASO 1: Valida los campos usando el helper
        const validation = validateLoginForm(email, password);

        if (!validation.isValid) {
            setFieldErrors(validation.errors);
            return; // Sale de la función si hay errores de validación
        }

        // PASO 2: Inicia el proceso de carga
        setIsLoading(true);

        try {
            // PASO 3: Hace la petición al servidor usando el helper
            const response = await loginRequest(email, password);
            console.log('📩 Respuesta del servidor:', response); // ✅ Debug

            // PASO 4: Si fue exitoso, guarda el token usando el helper
            if (response.token) {
                saveAuthToken(response.token);
                const decoded = jwtDecode(response.token);
                console.log('🔓 Token decodificado:', decoded); // ✅ Debug

                // Guarda los datos del usuario (incluyendo rol)
                const userData = {
                    ...response.user,
                    role: decoded.role || response.user.role
                };

                saveUserData(userData);
                setUser(decoded); // ✅ setUser ahora es estable gracias a useCallback en App.jsx
                
                // PASO 5: Marca el login como exitoso
                setSuccess(true);

                console.log(`✅ Redirigiendo a /dashboard/${decoded.role}`); // ✅ Debug
                
                // ✅ REDIRIGE SEGÚN EL ROL sin setTimeout
                navigate(`/dashboard/${decoded.role}`, { replace: true });
            }

            return response; // Retorna los datos para que el componente pueda usarlos

        } catch (err) {
            console.error('❌ Error en login:', err); // ✅ Debug
            // Maneja errores usando el helper para formatear el mensaje
            const errorMessage = formatErrorMessage(err);
            setError(errorMessage);
            setSuccess(false);

            throw err; // Re-lanza el error por si alguien más quiere manejarlo

        } finally {
            // SIEMPRE ejecuta esto, haya error o no
            setIsLoading(false);
        }
    }, [email, password, navigate, setUser]); // ✅ Todas las dependencias necesarias

    /**
     * Función para limpiar el formulario después de un login exitoso
     * o si el usuario quiere empezar de nuevo
     * ✅ Ahora envuelta en useCallback
     */
    const resetForm = useCallback(() => {
        setEmail('');
        setPassword('');
        setError(null);
        setSuccess(false);
        setFieldErrors({});
    }, []); // ✅ No tiene dependencias, siempre es la misma función

    /**
     * Retorna todo lo que el componente necesita para funcionar
     * El componente no necesita saber cómo funciona internamente,
     * solo usa estas propiedades y funciones
     */
    return {
        // Estados del formulario
        email,
        password,
        setEmail,
        setPassword,

        // Estados de la UI
        isLoading,
        error,
        success,
        fieldErrors,

        // Funciones para interactuar
        handleLogin,
        validateFields,
        resetForm,
    };
};