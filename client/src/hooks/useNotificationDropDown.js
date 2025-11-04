// useNotificationDropdown.js - VERSIÓN FINAL CORREGIDA
import { useState, useCallback, useEffect } from "react";
import {
  fetchUserMessages,
  fetchAccessRequests,
  createSystemNotification,
  createUserMessageNotification,
  createAccessRequestNotification,
} from "../helper/notificationDropDownHelper";

export function useNotificationDropdown() {
  // Estado para controlar qué dropdown está abierto
  const [activeDropdown, setActiveDropdown] = useState(null); // 'messages', 'requests', null

  // Estados para los datos
  const [systemNotifications, setSystemNotifications] = useState([]);
  const [userMessages, setUserMessages] = useState([]);
  const [accessRequests, setAccessRequests] = useState([]);

  // Contadores
  const [notificationCount, setNotificationCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [requestCount, setRequestCount] = useState(0);

  // Toggle dropdown específico
  const toggleDropdown = useCallback((dropdownId) => {
    setActiveDropdown((prev) => (prev === dropdownId ? null : dropdownId));
  }, []);

  // Cerrar todos los dropdowns
  const closeAllDropdowns = useCallback(() => {
    setActiveDropdown(null);
  }, []);

  // Verificar si un dropdown está abierto
  const isDropdownOpen = useCallback(
    (dropdownId) => activeDropdown === dropdownId,
    [activeDropdown]
  );

  // ========== SYSTEM NOTIFICATIONS (para SignUp en el futuro) ==========
  const addSystemNotification = useCallback((notification) => {
    const formatted = createSystemNotification(
      notification.title,
      notification.message,
      notification.type
    );

    setSystemNotifications((prev) => [formatted, ...prev]);
    setNotificationCount((prev) => prev + 1);

    // Auto-eliminar después de 10s
    if (notification.autoClose !== false) {
      setTimeout(() => {
        removeSystemNotification(formatted.id);
      }, 10000);
    }
  }, []);

  const removeSystemNotification = useCallback((id) => {
    setSystemNotifications((prev) => prev.filter((n) => n.id !== id));
    setNotificationCount((prev) => Math.max(0, prev - 1));
  }, []);

  // ========== USER MESSAGES (botón Messages 💬) ==========
  const loadUserMessages = useCallback(async () => {
    try {
      const messages = await fetchUserMessages();
      setUserMessages(messages);
      setMessageCount(messages.length);
    } catch (error) {
      console.error('Error loading user messages:', error);
      setUserMessages([]);
      setMessageCount(0);
    }
  }, []);

  const addUserMessage = useCallback((user) => {
    const formatted = createUserMessageNotification(user);
    setUserMessages((prev) => [formatted, ...prev]);
    setMessageCount((prev) => prev + 1);
  }, []);

  const removeUserMessage = useCallback((id) => {
    setUserMessages((prev) => prev.filter((m) => m.id !== id));
    setMessageCount((prev) => Math.max(0, prev - 1));
  }, []);

  // ========== ACCESS REQUESTS (botón Bell 🔔) ==========
  const loadAccessRequests = useCallback(async () => {
    try {
      const requests = await fetchAccessRequests();
      setAccessRequests(requests);
      setRequestCount(requests.length);
    } catch (error) {
      console.error('Error loading access requests:', error);
      setAccessRequests([]);
      setRequestCount(0);
    }
  }, []);

  const addAccessRequest = useCallback((user) => {
    const formatted = createAccessRequestNotification(user);
    setAccessRequests((prev) => [formatted, ...prev]);
    setRequestCount((prev) => prev + 1);
  }, []);

  const removeAccessRequest = useCallback((id) => {
    setAccessRequests((prev) => prev.filter((r) => r.id !== id));
    setRequestCount((prev) => Math.max(0, prev - 1));
  }, []);

  // ========== LIMPIAR TODO DE UN TIPO ==========
  const clearAll = useCallback((type) => {
    switch (type) {
      case "notifications":
        setSystemNotifications([]);
        setNotificationCount(0);
        break;
      case "messages":
        setUserMessages([]);
        setMessageCount(0);
        break;
      case "requests":
        setAccessRequests([]);
        setRequestCount(0);
        break;
      default:
        break;
    }
  }, []);

  // ========== FETCH INICIAL Y POLLING ==========
  useEffect(() => {
    // Carga inicial
    loadUserMessages();
    loadAccessRequests();

    // Polling cada 30 segundos para actualizar datos
    const interval = setInterval(() => {
      loadUserMessages();
      loadAccessRequests();
    }, 30000);

    return () => clearInterval(interval);
  }, [loadUserMessages, loadAccessRequests]);

  // ========== EXPORTS ==========
  return {
    // Estado de dropdowns
    activeDropdown,
    toggleDropdown,
    closeAllDropdowns,
    isDropdownOpen,

    // Datos
    systemNotifications,
    userMessages,
    accessRequests,

    // Contadores
    notificationCount,
    messageCount,
    requestCount,

    // Funciones para system notifications (para SignUp)
    addSystemNotification,
    removeSystemNotification,

    // Funciones para user messages
    loadUserMessages, // ✅ Renombrado para claridad
    addUserMessage,
    removeUserMessage,

    // Funciones para access requests
    loadAccessRequests, // ✅ Renombrado para claridad
    addAccessRequest,
    removeAccessRequest,

    // Limpieza
    clearAll,
  };
}