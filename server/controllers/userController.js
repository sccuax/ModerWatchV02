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

// Get users by status
const getUsersByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    
    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: `Status inválido. Debe ser uno de: ${validStatuses.join(', ')}` 
      });
    }
    
    const users = await User.find({ status: status }).sort({ createdAt: -1 });
    
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

// ✅ Create user CON NOTIFICACIÓN EN TIEMPO REAL
const createUser = async (req, res) => {
  try {
    const { name, surname, email, dateOfBirth, nationalId, message, password, status } = req.body;

    if (!name || !surname || !email || !dateOfBirth || !nationalId || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { nationalId }]
    });
    
    if (existingUser) {
      return res.status(409).json({ error: "User already exists with that email or document" });
    }

    const newUser = new User({
      name,
      surname,
      email,
      dateOfBirth,
      nationalId,
      message,
      password,
      status: status || 'pending' // Por defecto pending si no se especifica
    });

    await newUser.save();

    // ✅ Emitir evento WebSocket a todos los clientes conectados
    const io = req.app.get("io");
    io.emit("new_user_registered", {
      _id: newUser._id,
      name: newUser.name,
      surname: newUser.surname,
      email: newUser.email,
      message: newUser.message,
      status: newUser.status,
      createdAt: newUser.createdAt
    });

    console.log(`📢 WebSocket: Nuevo usuario registrado - ${newUser.email}`);

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

// ✅ Update user status CON NOTIFICACIÓN EN TIEMPO REAL
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: 'El campo status es requerido' });
    }
    
    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: `Status inválido. Debe ser uno de: ${validStatuses.join(', ')}` 
      });
    }
    
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'ID de usuario inválido' });
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { status: status },
      { new: true, runValidators: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // ✅ Emitir evento WebSocket cuando cambia el status
    const io = req.app.get("io");
    io.emit("user_status_updated", {
      _id: updatedUser._id,
      name: updatedUser.name,
      surname: updatedUser.surname,
      email: updatedUser.email,
      status: updatedUser.status,
      updatedAt: new Date()
    });

    console.log(`✅ Status actualizado: Usuario ${id} (${updatedUser.email}) → '${status}'`);
    
    res.json({
      message: 'Status actualizado exitosamente',
      user: updatedUser
    });
    
  } catch (err) {
    console.error('❌ Error actualizando status del usuario:', err);
    
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Formato de ID inválido' });
    }
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Error de validación',
        details: err.message 
      });
    }
    
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

    // ✅ Opcional: Notificar cuando se elimina un usuario
    const io = req.app.get("io");
    io.emit("user_deleted", { _id: id });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { 
  getAllUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser, 
  updateUserStatus, 
  getUsersByStatus 
};