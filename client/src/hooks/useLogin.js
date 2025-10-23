import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import {
    validateLoginForm,
    loginRequest,
    saveAuthToken,
    formatErrorMessage
} from '../helper/authHelpers.js';

/**
 * Hook personalizado que maneja toda la lógica del login
 * Este hook encapsula el estado y las operaciones relacionadas
 * con el proceso de autenticación
 */
export const useLogin = () => {
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
     */
    const validateFields = () => {
        const validation = validateLoginForm(email, password);
        setFieldErrors(validation.errors);
        return validation.isValid;
    };

    /**
     * Función principal que maneja el proceso completo de login
     */
    const handleLogin = async () => {
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

            // PASO 4: Si fue exitoso, guarda el token usando el helper
            if (response.token) {
                saveAuthToken(response.token);
                navigate("/admin-dashboard");
            }

            // PASO 5: Marca el login como exitoso
            setSuccess(true);

            // Aquí podrías hacer más cosas como:
            // - Guardar datos del usuario en un contexto global
            // - Redirigir a otra página
            // - Llamar a un callback que te pasen como parámetro

            return response; // Retorna los datos para que el componente pueda usarlos

        } catch (err) {
            // Maneja errores usando el helper para formatear el mensaje
            const errorMessage = formatErrorMessage(err);
            setError(errorMessage);
            setSuccess(false);

            throw err; // Re-lanza el error por si alguien más quiere manejarlo

        } finally {
            // SIEMPRE ejecuta esto, haya error o no
            setIsLoading(false);
        }
    };

    /**
     * Función para limpiar el formulario después de un login exitoso
     * o si el usuario quiere empezar de nuevo
     */
    const resetForm = () => {
        setEmail('');
        setPassword('');
        setError(null);
        setSuccess(false);
        setFieldErrors({});
    };

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