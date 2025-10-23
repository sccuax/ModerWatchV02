const bcrypt = require('bcrypt');
const User = require("../models/User");

// Get all users
const getAllUsers = async (req, res) => {
try {
    const { search } = req.query;

    const query = {};
    if (search) {
        query.$or = [
        { name: { $regex: search, $options: "i" } },
        { surname: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { nationalId: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
    ];
    }

    const users = await User.find(query);
    res.json(users);
} catch (err) {
    res.status(500).json({ error: err.message });
}
};

// Get user by ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ============================================
// 🆕 FUNCIÓN ADICIONAL: Get users by status
// ============================================
// Esta función te permite obtener todos los usuarios filtrados por status
// Útil si quieres agregar pestañas o filtros en tu frontend
const getUsersByStatus = async (req, res) => {
    try {
        const { status } = req.params;
        
        // Valida que el status sea válido
        const validStatuses = ['pending', 'approved', 'rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                error: `Status inválido. Debe ser uno de: ${validStatuses.join(', ')}` 
            });
        }
        
        // Busca todos los usuarios con ese status
        const users = await User.find({ status: status })
            .sort({ createdAt: -1 }); // Ordena por más recientes primero
        
        res.json({
            count: users.length,
            status: status,
            users: users
        });
        
    } catch (err) {
        console.error('Error obteniendo usuarios por status:', err);
        res.status(500).json({ 
            error: 'Error interno del servidor',
            details: err.message 
        });
    }
};


//create users

const createUser = async (req, res) => {
try {
    const { name, surname, email, dateOfBirth, nationalId, message, password, status } = req.body;

    // Validate if the required fields are present
    if (!name || !surname || !email || !dateOfBirth || !nationalId || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    // Check if a user with the same email or document already exists
    const existingUser = await User.findOne({
        $or: [{ email }, { nationalId }]
    });
    if (existingUser) {
        return res.status(409).json({ error: "User already exists with that email or document" });
    }

    // Create new user
    const newUser = new User({
        name,
        surname,
        email,
        dateOfBirth,
        nationalId,
        message,
        password,
        status
    });

    // Save to the database
    await newUser.save();

    res.status(201).json({
        message: "User created successfully",
        user: newUser
    });

} catch (err) {
    res.status(500).json({ error: err.message });
    }
};


// Update user
const updateUser = async (req, res) => {
try {
    const { id } = req.params;
    const updates = req.body;
    
    // Si se está actualizando la contraseña, hashearla
    if (updates.password) {
        const salt = await bcrypt.genSalt(10);
        updates.password = await bcrypt.hash(updates.password, salt);
    }
    
    const options = { new: true };
    const updatedUser = await User.findByIdAndUpdate(id, updates, options);
    
    if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
    }
    
    res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ============================================
// 🆕 NUEVA FUNCIÓN: Update user status
// ============================================
// Esta función está específicamente dedicada a actualizar el status de un usuario
// Separamos esta lógica del updateUser genérico para tener mejor control
const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params; // ID del usuario a actualizar
        const { status } = req.body; // Nuevo status
        
        // VALIDACIÓN 1: Verifica que se envió un status
        if (!status) {
            return res.status(400).json({ 
                error: 'El campo status es requerido' 
            });
        }
        
        // VALIDACIÓN 2: Verifica que el status sea uno de los valores permitidos
        const validStatuses = ['pending', 'approved', 'rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                error: `Status inválido. Debe ser uno de: ${validStatuses.join(', ')}` 
            });
        }
        
        // VALIDACIÓN 3: Verifica que el ID sea válido (formato de ObjectId de MongoDB)
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ 
                error: 'ID de usuario inválido' 
            });
        }
        
        // Busca y actualiza el usuario
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { status: status },
            { 
                new: true, // Retorna el documento actualizado
                runValidators: true // Ejecuta las validaciones del schema
            }
        );
        
        // Si no encuentra el usuario, retorna error 404
        if (!updatedUser) {
            return res.status(404).json({ 
                error: 'Usuario no encontrado' 
            });
        }
        
        // Log para auditoría (opcional pero recomendado)
        console.log(`✅ Status actualizado: Usuario ${id} (${updatedUser.email}) cambió a '${status}'`);
        
        // OPCIONAL: Aquí podrías agregar lógica adicional según el status
        // Por ejemplo, enviar un email de notificación al usuario
        /*
        if (status === 'approved') {
            await sendApprovalEmail(updatedUser.email, updatedUser.name);
            console.log(`📧 Email de aprobación enviado a ${updatedUser.email}`);
        } else if (status === 'rejected') {
            await sendRejectionEmail(updatedUser.email, updatedUser.name);
            console.log(`📧 Email de rechazo enviado a ${updatedUser.email}`);
        }
        */
        
        // Retorna el usuario actualizado
        res.json({
            message: 'Status actualizado exitosamente',
            user: updatedUser
        });
        
    } catch (err) {
        console.error('❌ Error actualizando status del usuario:', err);
        
        // Manejo de errores específicos
        if (err.name === 'CastError') {
            return res.status(400).json({ 
                error: 'Formato de ID inválido' 
            });
        }
        
        if (err.name === 'ValidationError') {
            return res.status(400).json({ 
                error: 'Error de validación',
                details: err.message 
            });
        }
        
        // Error genérico
        res.status(500).json({ 
            error: 'Error interno del servidor',
            details: err.message 
        });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser, updateUserStatus, getUsersByStatus };