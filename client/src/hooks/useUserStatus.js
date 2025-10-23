// ============================================
// Hook personalizado para manejar cambios de status de usuarios

import { useState } from 'react';
import { updateUserStatus, formatUserStatus } from '../helper/userStatusHelpers';

/**
 * Hook personalizado que encapsula la lógica para cambiar el status de usuarios
 */
export const useUserStatus = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  /**
   * Cambia el status de un usuario a 'approved'
   * @param {string} userId - ID del usuario a aprobar
   */
  const approveUser = async (userId) => {
    setIsUpdating(true);
    setError(null);
    setSuccess(false);

    try {
      const updatedUser = await updateUserStatus(userId, 'approved');
      setSuccess(true);
      
      // Retorna el usuario actualizado para que el componente pueda usarlo
      return updatedUser;
    } catch (err) {
      setError(err.message || 'Error al aprobar el usuario');
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Cambia el status de un usuario a 'rejected'
   * @param {string} userId - ID del usuario a rechazar
   */
  const rejectUser = async (userId) => {
    setIsUpdating(true);
    setError(null);
    setSuccess(false);

    try {
      const updatedUser = await updateUserStatus(userId, 'rejected');
      setSuccess(true);
      
      return updatedUser;
    } catch (err) {
      setError(err.message || 'Error al rechazar el usuario');
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Cambia el status de un usuario a cualquier valor válido
   * Útil si necesitas más flexibilidad
   * @param {string} userId - ID del usuario
   * @param {string} newStatus - Nuevo status
   */
  const changeStatus = async (userId, newStatus) => {
    setIsUpdating(true);
    setError(null);
    setSuccess(false);

    try {
      const updatedUser = await updateUserStatus(userId, newStatus);
      setSuccess(true);
      
      return updatedUser;
    } catch (err) {
      setError(err.message || 'Error al cambiar el status');
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Limpia los mensajes de error y éxito
   */
  const clearMessages = () => {
    setError(null);
    setSuccess(false);
  };

  return {
    // Estados
    isUpdating,
    error,
    success,
    
    // Funciones
    approveUser,
    rejectUser,
    changeStatus,
    clearMessages,

     // Helpers expuestos (para que los componentes puedan usarlos sin importarlos)
    formatUserStatus,
  };
};