// client/src/hooks/useNotificationDropdown.js
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
  const activeDropdownRef = useRef(null); // ref para leer estado dentro de callbacks
  const [systemNotifications, setSystemNotifications] = useState([]);
  const [userMessages, setUserMessages] = useState([]);
  const [accessRequests, setAccessRequests] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [requestCount, setRequestCount] = useState(0);

  // refs para evitar duplicados por eventos en vivo
  const seenMessageIdsRef = useRef(new Set());
  const seenRequestIdsRef = useRef(new Set());

  // sincronizar ref con estado
  useEffect(() => {
    activeDropdownRef.current = activeDropdown;
  }, [activeDropdown]);

  // Toggle: al abrir marcamos como leido (contador -> 0)
  const toggleDropdown = useCallback((dropdownId) => {
    setActiveDropdown((prev) => {
      const next = prev === dropdownId ? null : dropdownId;

      // Al abrir, reiniciamos contador (schedule para evitar efectos durante render)
      if (next === "messages") {
        setTimeout(() => setMessageCount(0), 0);
      } else if (next === "requests") {
        setTimeout(() => setRequestCount(0), 0);
      }

      return next;
    });
  }, []);

  const closeAllDropdowns = useCallback(() => {
    setActiveDropdown(null);
    // no tocar contadores aquí: queremos que queden en 0 hasta que lleguen nuevos items
  }, []);

  const isDropdownOpen = useCallback(
    (dropdownId) => activeDropdown === dropdownId,
    [activeDropdown]
  );

  // helper seguro
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
      setTimeout(() => removeSystemNotification(formatted.id), 10000);
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
      // si está abierto, contador = 0, si no, la longitud
      setMessageCount(activeDropdownRef.current === "messages" ? 0 : messages.length);
      // registrar ids vistos para evitar duplicados al recibir por socket
      messages.forEach((m) => seenMessageIdsRef.current.add(m.id ?? m._id));
    } catch (error) {
      console.error("Error loading user messages:", error);
      setUserMessages([]);
      setMessageCount(0);
    }
  }, []);

  const addUserMessage = useCallback((user) => {
    const formatted = createUserMessageNotification(user);
    const id = formatted.id ?? formatted._id;
    if (!id) return;
    if (seenMessageIdsRef.current.has(id)) return; // dedupe
    seenMessageIdsRef.current.add(id);
    setUserMessages((prev) => [formatted, ...prev]);

    // solo incrementar si el dropdown NO está abierto (el usuario no lo está viendo)
    if (activeDropdownRef.current !== "messages") {
      setMessageCount((prev) => prev + 1);
    } else {
      // si está abierto, marcamos leído en UI (contador ya debe estar 0)
      setMessageCount(0);
    }
  }, []);

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
      setRequestCount(activeDropdownRef.current === "requests" ? 0 : requests.length);
      requests.forEach((r) => seenRequestIdsRef.current.add(r.id ?? r._id));
    } catch (error) {
      console.error("Error loading access requests:", error);
      setAccessRequests([]);
      setRequestCount(0);
    }
  }, []);

  const addAccessRequest = useCallback((user) => {
    const formatted = createAccessRequestNotification(user);
    const id = formatted.id ?? formatted._id;
    if (!id) return;
    if (seenRequestIdsRef.current.has(id)) return;
    seenRequestIdsRef.current.add(id);
    setAccessRequests((prev) => [formatted, ...prev]);

    // usar ref para evitar stale closures cuando el evento viene por socket
    if (activeDropdownRef.current !== "requests") {
      setRequestCount((prev) => prev + 1);
    } else {
      setRequestCount(0);
    }
  }, []);

  const removeAccessRequest = useCallback((id) => {
    setAccessRequests((prev) => prev.filter((r) => (r.id ?? r._id) !== id));
    setRequestCount((prev) => Math.max(0, prev - 1));
    seenRequestIdsRef.current.delete(id);
  }, []);

  // limpiar por tipo
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

  // ========== WEBSOCKET: callbacks ==========
  const handleNewUser = useCallback(
    (userData) => {
      if (!userData) return;
      if (userData.message && userData.message.trim() !== "") {
        addUserMessage(userData);
      }
      if (userData.status === "pending") {
        addAccessRequest(userData);
      }
    },
    [addUserMessage, addAccessRequest]
  );

  const handleStatusUpdate = useCallback(
    (userData) => {
      if (!userData) return;
      // si dejó de ser pending, remover de requests
      if (userData.status && userData.status !== "pending") {
        removeAccessRequest(userData._id ?? userData.id);
      }
      if (userData.status === "pending") {
        addAccessRequest(userData);
      }
      if (userData.message && userData.message.trim() !== "") {
        addUserMessage(userData);
      }
    },
    [removeAccessRequest, addAccessRequest, addUserMessage]
  );

  const handleUserDeleted = useCallback(
    (data) => {
      if (!data) return;
      const id = data._id ?? data.id;
      removeUserMessage(id);
      removeAccessRequest(id);
    },
    [removeUserMessage, removeAccessRequest]
  );

  // conectar websocket (usa los callbacks arriba)
  useWebSocket({
    onNewUser: handleNewUser,
    onStatusUpdate: handleStatusUpdate,
    onUserDeleted: handleUserDeleted,
  });

  // fetch inicial
  useEffect(() => {
    (async () => {
      await Promise.all([loadUserMessages(), loadAccessRequests()]);
    })();
  }, [loadUserMessages, loadAccessRequests]);

  // NOTE: no hay efecto que ponga contadores a 0 al cerrar; el reinicio se hace al abrir (toggleDropdown)
  // esto permite que: abrir -> contador a 0; permanecer en 0 hasta nuevos items; nuevos items incrementan solo si dropdown cerrado.

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
