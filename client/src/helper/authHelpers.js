/**
 * Valida que los campos del formulario de login no estén vacíos
 * y cumplan con requisitos básicos
 */
export const validateLoginForm = (email, password) => {
    const errors = {};

    // Validación del email
    if (!email || email.trim() === '') {
        errors.email = 'Email required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.email = 'Invalid email format';
    }

    // Validación del password
    if (!password || password.trim() === '') {
        errors.password = 'Password required';
    } else if (password.length < 6) {
        errors.password = 'At least 6 caracters required';
    }

    // Retorna un objeto con los errores encontrados
    // Si está vacío, significa que todo es válido
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

/**
 * Hace la petición HTTP al servidor para autenticar al usuario
 * Esta función no maneja estado, solo realiza la operación y retorna el resultado
 */
export const loginRequest = async (email, password) => {
    try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }), // 👈 changed from username to email
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error en el login');
        }

        return data;
    } catch (error) {
        console.error('Error en loginRequest:', error); // 👈 ya no es “useless”
        throw error;
    }
};


/**
 * Guarda el token de autenticación
 * Este helper encapsula la lógica de dónde y cómo se guarda
 */
export const saveAuthToken = (token) => {
    // En un proyecto real, podrías guardar en:
    // - localStorage (persiste al cerrar el navegador)
    // - sessionStorage (se borra al cerrar el navegador)
    // - Una cookie httpOnly (más seguro)
    // - Un estado global (Redux, Context API, Zustand)

    // Nota: En artifacts de Claude no funciona localStorage
    // Aquí solo mostramos cómo se haría en un proyecto real
    if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('token', token);
    }
};

/**
 * ✅ NUEVO: Guarda los datos del usuario (incluyendo el rol)
 */
export const saveUserData = (userData) => {
    if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('userData', JSON.stringify(userData));
    }
};

/**
 * ✅ NUEVO: Obtiene los datos del usuario guardados
 */
export const getUserData = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
        const data = localStorage.getItem('userData');
        return data ? JSON.parse(data) : null;
    }
    return null;
};

/**
 * Obtiene el token de autenticación guardado
 */
export const getAuthToken = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
        return localStorage.getItem('token');
    }
    return null;
};

/**
 * Elimina el token de autenticación (para logout)
 */
export const removeAuthToken = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
    }
};

/**
 * Formatea mensajes de error para mostrarlos al usuario
 * de una manera más amigable
 */
export const formatErrorMessage = (error) => {
    // Mapea errores técnicos a mensajes amigables
    const errorMessages = {
        'Failed to fetch': 'No se pudo conectar con el servidor. Verifica tu conexión.',
        'Network request failed': 'Error de red. Intenta nuevamente.',
    };

    return errorMessages[error.message] || error.message || 'Ha ocurrido un error inesperado';
};
