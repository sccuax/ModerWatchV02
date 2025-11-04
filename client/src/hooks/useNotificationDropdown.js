// src/hooks/useNotificationDropDown.js
import { useState, useCallback, useEffect, useRef } from "react";
import {
  fetchUserMessages,
  fetchAccessRequests,
  createSystemNotification,
  createUserMessageNotification,
  createAccessRequestNotification,
} from "../helper/notificationDropDownHelper";
import { useWebSocket } from "./useWebSocket";

export function useNotificationDropdown() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [systemNotifications, setSystemNotifications] = useState([]);
  const [userMessages, setUserMessages] = useState([]);
  const [accessRequests, setAccessRequests] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [requestCount, setRequestCount] = useState(0);

  // Ref para evitar incrementos múltiples por el mismo evento
  const seenMessageIdsRef = useRef(new Set());
  const seenRequestIdsRef = useRef(new Set());

  // Toggle dropdown Y resetear contador cuando se ABRE / se CIERRA
  const toggleDropdown = useCallback((dropdownId) => {
    setActiveDropdown((prev) => {
      const isOpening = prev !== dropdownId;
      // Si abrimos: reset contador del tipo
      if (isOpening) {
        if (dropdownId === "messages") setMessageCount(0);
        if (dropdownId === "requests") setRequestCount(0);
      }
      // Si cerramos (prev === dropdownId) -> retornará null, reiniciamos contadores también:
      if (!isOpening) {
        setMessageCount(0);
        setRequestCount(0);
      }
      return prev === dropdownId ? null : dropdownId;
    });
  }, []);

  const closeAllDropdowns = useCallback(() => {
    setActiveDropdown(null);
    setMessageCount(0);
    setRequestCount(0);
  }, []);

  const isDropdownOpen = useCallback(
    (dropdownId) => activeDropdown === dropdownId,
    [activeDropdown]
  );

  // ========== HELPERS DE FORMATO (internos usan tu helper exportado) ==========
  const safeArray = (maybeArray) => (Array.isArray(maybeArray) ? maybeArray : []);

  // ========== SYSTEM NOTIFICATIONS ==========
  const addSystemNotification = useCallback((notification) => {
    const formatted = createSystemNotification(
      notification.title,
      notification.message,
      notification.type
    );
    setSystemNotifications((prev) => [formatted, ...prev]);
    setNotificationCount((prev) => prev + 1);

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

  // ========== USER MESSAGES ==========
  const loadUserMessages = useCallback(async () => {
    try {
      const messages = safeArray(await fetchUserMessages());
      setUserMessages(messages);

      // set count only if dropdown isn't open
      setMessageCount(activeDropdown === "messages" ? 0 : messages.length);

      // mark seen ids so we don't duplicate on live events
      messages.forEach((m) => seenMessageIdsRef.current.add(m.id ?? m._id));
    } catch (error) {
      console.error('Error loading user messages:', error);
      setUserMessages([]);
      setMessageCount(0);
    }
  }, [activeDropdown]);

  const addUserMessage = useCallback((user) => {
    const formatted = createUserMessageNotification(user);
    const id = formatted.id ?? formatted._id;
    // prevent duplicates
    if (seenMessageIdsRef.current.has(id)) return;

    seenMessageIdsRef.current.add(id);
    setUserMessages((prev) => [formatted, ...prev]);

    if (activeDropdown !== "messages") {
      setMessageCount((prev) => prev + 1);
    }
  }, [activeDropdown]);

  const removeUserMessage = useCallback((id) => {
    setUserMessages((prev) => prev.filter((m) => (m.id ?? m._id) !== id));
    setMessageCount((prev) => Math.max(0, prev - 1));
    seenMessageIdsRef.current.delete(id);
  }, []);

  // ========== ACCESS REQUESTS ==========
  const loadAccessRequests = useCallback(async () => {
    try {
      const requests = safeArray(await fetchAccessRequests());
      setAccessRequests(requests);

      setRequestCount(activeDropdown === "requests" ? 0 : requests.length);

      requests.forEach((r) => seenRequestIdsRef.current.add(r.id ?? r._id));
    } catch (error) {
      console.error('Error loading access requests:', error);
      setAccessRequests([]);
      setRequestCount(0);
    }
  }, [activeDropdown]);

  const addAccessRequest = useCallback((user) => {
    const formatted = createAccessRequestNotification(user);
    const id = formatted.id ?? formatted._id;
    if (seenRequestIdsRef.current.has(id)) return;

    seenRequestIdsRef.current.add(id);
    setAccessRequests((prev) => [formatted, ...prev]);
    if (activeDropdown !== "requests") {
      setRequestCount((prev) => prev + 1);
    }
  }, [activeDropdown]);

  const removeAccessRequest = useCallback((id) => {
    setAccessRequests((prev) => prev.filter((r) => (r.id ?? r._id) !== id));
    setRequestCount((prev) => Math.max(0, prev - 1));
    seenRequestIdsRef.current.delete(id);
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
        seenMessageIdsRef.current.clear();
        break;
      case "requests":
        setAccessRequests([]);
        setRequestCount(0);
        seenRequestIdsRef.current.clear();
        break;
      default:
        break;
    }
  }, []);

  // ========== WEBSOCKET: callbacks para eventos en tiempo real ==========
  const handleNewUser = useCallback((userData) => {
    // userData puede venir con _id o id
    if (!userData) return;
    // si tiene mensaje, lo agregamos a userMessages (deduplicado)
    if (userData.message && userData.message.trim() !== "") {
      addUserMessage(userData);
    }
    // si el usuario está pending, lo agregamos a accessRequests (deduplicado)
    if (userData.status === "pending") {
      addAccessRequest(userData);
    }
  }, [addUserMessage, addAccessRequest]);

  const handleStatusUpdate = useCallback((userData) => {
    if (!userData) return;
    // Si cambió a non-pending, eliminarlo de accessRequests
    if (userData.status && userData.status !== 'pending') {
      removeAccessRequest(userData._id ?? userData.id);
    }
    // Si cambió a pending, agregarlo (por ejemplo si vuelven a pending)
    if (userData.status === 'pending') {
      addAccessRequest(userData);
    }
    // también podríamos actualizar mensajes si el payload trae message
    if (userData.message && userData.message.trim() !== "") {
      addUserMessage(userData);
    }
  }, [removeAccessRequest, addAccessRequest, addUserMessage]);

  const handleUserDeleted = useCallback((data) => {
    if (!data) return;
    const id = data._id ?? data.id;
    removeUserMessage(id);
    removeAccessRequest(id);
  }, [removeUserMessage, removeAccessRequest]);

  // Conectar websocket (useWebSocket devuelve socketRef, pero aquí solo usamos callbacks)
  useWebSocket({
    onNewUser: handleNewUser,
    onStatusUpdate: handleStatusUpdate,
    onUserDeleted: handleUserDeleted,
  });

  // ========== FETCH INICIAL ==========
  useEffect(() => {
    // Cargar ambos en paralelo
    (async () => {
      await Promise.all([loadUserMessages(), loadAccessRequests()]);
    })();
  }, [loadUserMessages, loadAccessRequests]);

  // ========== Reset counters si cerramos dropdown (extra, porque toggleDropdown ya maneja apertura) ==========
  useEffect(() => {
    if (activeDropdown === null) {
      // Reiniciar contadores al cerrar (seguro)
      setMessageCount(0);
      setRequestCount(0);
    }
  }, [activeDropdown]);

  return {
    activeDropdown,
    toggleDropdown,
    closeAllDropdowns,
    isDropdownOpen,
    systemNotifications,
    userMessages,
    accessRequests,
    notificationCount,
    messageCount,
    requestCount,
    addSystemNotification,
    removeSystemNotification,
    loadUserMessages,
    addUserMessage,
    removeUserMessage,
    loadAccessRequests,
    addAccessRequest,
    removeAccessRequest,
    clearAll,
  };
}
