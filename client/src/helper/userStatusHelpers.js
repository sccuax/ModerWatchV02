// ============================================
// Helpers para manejar el cambio de status de usuarios

/**
 * Actualiza el status de un usuario en el backend
 * @param {string} userId - ID del usuario a actualizar
 * @param {string} newStatus - Nuevo status ('approved', 'rejected', 'pending')
 * @returns {Promise} - Promesa con la respuesta del servidor
 */
export const updateUserStatus = async (userId, newStatus) => {
    if (!userId) {
        throw new Error('El ID del usuario es requerido');
    }

    // Validar que el status sea uno de los permitidos
    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(newStatus)) {
        throw new Error(`Status inválido. Debe ser: ${validStatuses.join(', ')}`);
    }

    // Obtener el token del localStorage (sistema híbrido)
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');

    if (!token) {
        throw new Error('No estás autenticado. Por favor inicia sesión nuevamente.');
    }
    try {
        const response = await fetch(
            `http://localhost:3000/api/users/${userId}/status`,
            {
                method: 'PATCH', // Usamos PATCH porque solo actualizamos un campo
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            }
        );

        // Si la respuesta no es OK, lanza un error con el mensaje del servidor
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al actualizar el status');
        }

        const data = await response.json();
        return data; // Retorna el usuario actualizado
    } catch (error) {
        console.error('Error changing status:', error); // Re-lanza el error para que quien llame esta función pueda manejarlo
        throw error;
    }
};

/**
 * Formatea un status para mostrarlo al usuario de manera más amigable
 * @param {string} status - Status actual del usuario
 * @returns {object} - Objeto con texto y color para mostrar en la UI
 */
export const formatUserStatus = (status) => {
    const statusConfig = {
        pending: {
            text: 'Pendiente',
            textColor: 'text-yellow-600',
            bgColor: 'bg-[var(--color-baadge--pending)]',
            borderColor: 'border-yellow-300',
        },
        approved: {
            text: 'Aprobado',
            color: 'text-green-600',
            bgColor: '--color-baadge--approved',
            borderColor: 'border-green-300',
        },
        rejected: {
            text: 'Rechazado',
            color: 'text-red-600',
            bgColor: '--color-baadge--rejected',
            borderColor: 'border-red-300',
        },
    };

    return statusConfig[status] || statusConfig.pending;
};

/**
 * Valida si un usuario puede cambiar de status
 * Por ejemplo, podrías agregar lógica para verificar permisos
 * @param {object} user - Objeto del usuario
 * @returns {boolean} - true si puede cambiar, false si no
 */
export const canChangeStatus = (user) => {
    // Aquí podrías agregar validaciones adicionales
    // Por ejemplo, verificar si el usuario actual tiene permisos de admin
    // o si el usuario objetivo cumple ciertas condiciones

    if (!user || !user._id) {
        return false;
    }

    // Por ahora, simplemente permitimos el cambio
    return true;
};

