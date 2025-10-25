import { removeAuthToken } from '../helper/authHelpers'

export const useLogOut = () => {
    const handleLogout = () => {
        // Elimina el token de JWT manual ('authToken')
        removeAuthToken();
        
        // Elimina el token de Auth0 ('token')
        localStorage.removeItem('token');
        
        // Opcional: Limpia todo por si hay algo más
        // localStorage.clear();
        
        // Redirige al login
        window.location.href = "http://localhost:4000/login";
    };

    return { handleLogout };
};