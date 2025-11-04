// notificationDropDownHelper.js - CON AUTENTICACIÓN

// ============================================
// FETCH GENÉRICO CON MANEJO DE ERRORES Y AUTH
// ============================================
async function fetchFromAPI(endpoint) {
    try {
        // ✅ Obtener token de localStorage
        const token = localStorage.getItem('token');
        
        const headers = {
            'Content-Type': 'application/json',
        };
        
        // ✅ Agregar Authorization header si existe el token
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`http://localhost:3000${endpoint}`, {
            method: 'GET',
            headers: headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error(`❌ Error fetching ${endpoint}:`, error);
        return { success: false, error: error.message };
    }
}

// ============================================
// FORMATEAR MENSAJES DE USUARIOS (campo message del User)
// ============================================
export function formatUserMessages(users = []) {
    return users.map((user) => ({
        id: user._id || user.id,
        type: "message",
        title: `${user.name} ${user.surname}`,
        message: user.message,
        timestamp: new Date(user.createdAt).toLocaleTimeString("es-CO", {
            hour: "2-digit",
            minute: "2-digit",
        }),
        icon: "message",
        data: user,
    }));
}

// ============================================
// FORMATEAR SOLICITUDES DE ACCESO (status: pending)
// ============================================
export function formatAccessRequests(users = []) {
    return users.map((user) => ({
        id: user._id,
        type: "request",
        title: "New request",
        message: `${user.name} ${user.surname} (${user.email})`,
        timestamp: new Date(user.createdAt).toLocaleTimeString("es-CO", {
            hour: "2-digit",
            minute: "2-digit",
        }),
        icon: "person",
        data: user,
    }));
}

// ============================================
// OBTENER MENSAJES DE USUARIOS DESDE EL BACKEND
// ============================================
export async function fetchUserMessages() {
    const result = await fetchFromAPI('/api/users');

    if (!result.success) {
        return [];
    }

    const allUsers = Array.isArray(result.data) ? result.data : [];
    const usersWithMessage = allUsers.filter(user =>
        user.message && user.message.trim() !== ''
    );

    return formatUserMessages(usersWithMessage);
}

// ============================================
// OBTENER SOLICITUDES DE ACCESO DESDE EL BACKEND
// ============================================
export async function fetchAccessRequests() {
    const result = await fetchFromAPI('/api/users/status/pending');

    if (!result.success) {
        return [];
    }

    const users = result.data.users || [];

    return formatAccessRequests(users);
}

// ============================================
// AGREGAR MENSAJE EN TIEMPO REAL (cuando alguien se registra)
// ============================================
export function createUserMessageNotification(user) {
    return {
        id: user._id || user.id,
        type: "message",
        title: `${user.name} ${user.surname}`,
        message: user.message || "Sin mensaje",
        timestamp: new Date().toLocaleTimeString("es-CO", {
            hour: "2-digit",
            minute: "2-digit",
        }),
        icon: "message",
        data: user,
    };
}

// ============================================
// AGREGAR SOLICITUD EN TIEMPO REAL
// ============================================
export function createAccessRequestNotification(user) {
    return {
        id: user._id || user.id,
        type: "request",
        title: "Nueva solicitud de acceso",
        message: `${user.name} ${user.surname} (${user.email})`,
        timestamp: new Date().toLocaleTimeString("es-CO", {
            hour: "2-digit",
            minute: "2-digit",
        }),
        icon: "person",
        data: user,
    };
}

// ============================================
// CREAR NOTIFICACIÓN DEL SISTEMA (para SignUp)
// ============================================
export function createSystemNotification(title, message, type = "info") {
    return {
        id: Date.now() + Math.random(),
        type,
        title,
        message,
        timestamp: new Date().toLocaleTimeString("es-CO", {
            hour: "2-digit",
            minute: "2-digit",
        }),
    };
}