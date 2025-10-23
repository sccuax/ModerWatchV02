const express = require("express");
const router = express.Router();
const { getAllUsers, getUserById, createUser, updateUser, deleteUser, updateUserStatus,
    getUsersByStatus } = require("../controllers/userController");
const { verifyToken } = require("../middleware/verifyToken.js")

// Get all users
router.get("/", getAllUsers);

// Get user by ID
router.get("/userId/:id", getUserById);

// Create user
router.post("/", createUser);

// Update user
router.patch("/userId/:id", verifyToken, updateUser);

// Delete user
router.delete("/userId/:id", verifyToken, deleteUser);

// PATCH /api/users/:id/status - Actualizar solo el status de un usuario
// para evitar conflictos de routing
router.patch('/:id/status', verifyToken, updateUserStatus);

// GET /api/users/status/:status - Obtener todos los usuarios con un status específico
// Ejemplo: GET /api/users/status/pending
router.get('/status/:status', verifyToken, getUsersByStatus);

module.exports = router;


// ============================================
// EJEMPLOS DE USO DE LAS NUEVAS RUTAS
// ============================================

/*
1. ACTUALIZAR STATUS DE UN USUARIO A "APPROVED":
    PATCH http://localhost:3000/api/users/507f1f77bcf86cd799439011/status
    Body (JSON):
    {
        "status": "approved"
    }

2. ACTUALIZAR STATUS DE UN USUARIO A "REJECTED":
    PATCH http://localhost:3000/api/users/507f1f77bcf86cd799439011/status
    Body (JSON):
    {
        "status": "rejected"
    }

3. OBTENER TODOS LOS USUARIOS PENDIENTES:
    

4. OBTENER TODOS LOS USUARIOS APROBADOS:
    GET http://localhost:3000/api/users/status/approved

5. OBTENER TODOS LOS USUARIOS RECHAZADOS:
    GET http://localhost:3000/api/users/status/rejected
*/