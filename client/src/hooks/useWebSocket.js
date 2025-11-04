// src/hooks/useWebSocket.js
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

/**
 * useWebSocket
 * Recibe callbacks: onNewUser, onStatusUpdate, onUserDeleted
 * - reconexión robusta
 * - intenta fallback a polling si websocket falla (una sola vez)
 * - devuelve socketRef (la referencia), para poder usar socketRef.current si se necesita
 */
export function useWebSocket({
  onNewUser,
  onStatusUpdate,
  onUserDeleted,
  url = 'http://localhost:3000',
}) {
  const socketRef = useRef(null);
  // evita crear reconexiones infinitas cuando hacemos fallback
  const attemptedPollingRef = useRef(false);

  useEffect(() => {
    if (socketRef.current) return; // no crear múltiples conexiones

    // Inicializa socket (permite websocket + polling)
    const connectSocket = (transports = ['websocket', 'polling']) => {
      const socket = io(url, {
        transports,
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        auth: {
          // si necesitas enviar token en handshake, puedes pasarlo aquí
 token: localStorage.getItem('token')
        },
      });

      socketRef.current = socket;

      socket.on('connect', () => {
        console.log('✅ Conectado a WebSocket:', socket.id);
      });

      // Debug opcional: muestra eventos recibidos (desactivar en prod si quieres)
 socket.onAny((event, ...args) => console.debug('socket event', event, args));

      socket.on('new_user_registered', (userData) => {
        if (onNewUser) onNewUser(userData);
      });

      socket.on('user_status_updated', (userData) => {
        if (onStatusUpdate) onStatusUpdate(userData);
      });

      socket.on('user_deleted', (data) => {
        if (onUserDeleted) onUserDeleted(data);
      });

      socket.on('connect_error', (err) => {
        console.error('❌ Error de conexión WebSocket:', err);

        // Si el error indica problema con websocket transport y aún no intentamos polling, fallback a polling
        const isTransportError = (err && err.message && err.message.toLowerCase().includes('websocket'));
        if (isTransportError && !attemptedPollingRef.current && transports.includes('websocket')) {
          console.warn('⚠️ WebSocket transport failed — re-attempting with polling transport.');
          attemptedPollingRef.current = true;

          // desconectar socket actual y crear uno nuevo con polling
          try {
            socket.disconnect();
          } catch (e) { /* ignore */ }

          // crear nuevo socket con polling
          connectSocket(['polling']);
        }
      });

      socket.on('disconnect', (reason) => {
        console.log('🔴 Desconectado de WebSocket:', reason);
      });

      return socket;
    };

    // Create initial socket with both transports
    connectSocket(['websocket', 'polling']);

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        console.log('🔌 WebSocket desconectado (cleanup)');
      }
    };
  }, [onNewUser, onStatusUpdate, onUserDeleted, url]);

  // Devolvemos la referencia (no sólo el valor) para que el consumidor pueda acceder a socketRef.current si lo desea
  return socketRef;
}
