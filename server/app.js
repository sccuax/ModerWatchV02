// server/app.js
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { auth } = require("express-openid-connect");
require('dotenv').config();

const http = require('http');
const { Server } = require('socket.io');

const app = express();
const port = process.env.PORT || 3000;

// Auth0 configuration
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET_KEY,
  baseURL: process.env.AUTH0_BASE_URL,           // Ej: "http://localhost:3000"
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  routes: {
    callback: '/api/auth/google/callback'        // Ruta de callback personalizada
  },
};

// Middlewares: CORS / body parsers
app.use(cors({
  origin: "http://localhost:4000",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============ SERVER + SOCKET.IO ============
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:4000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Compartir io con rutas/controllers
app.set("io", io);

// Eventos WebSocket
io.on("connection", (socket) => {
  console.log("🟢 Cliente conectado:", socket.id);

  socket.on("disconnect", (reason) => {
    console.log("🔴 Cliente desconectado:", socket.id, reason);
  });
});

// ============ AUTH ROUTES (solo /api/auth) ============
// 🔹 Montamos el middleware de Auth0 **globalmente** para que maneje correctamente la ruta de callback
app.use(auth(config));

// Ruta para iniciar login con Google
app.get("/api/auth/google/login", (req, res) => {
  res.oidc.login({
    returnTo: "/api/auth/google/users",
    authorizationParams: {
      connection: 'google-oauth2',
    },
  });
});

// Ruta post-login (cuando Auth0 redirige después del login)
app.get("/api/auth/google/users", async (req, res) => {
  try {
    if (!req.oidc.isAuthenticated()) {
      return res.redirect("http://localhost:4000/login?error=not_authenticated");
    }

    const user = req.oidc.user;
    const existingUser = await User.findOne({ email: user.email });

    if (!existingUser) {
      return res.redirect("http://localhost:4000/login?error=user_not_found");
    }

    if (existingUser.status !== "approved") {
      return res.redirect("http://localhost:4000/login?error=not_approved");
    }

    const token = jwt.sign(
      { id: existingUser._id, email: existingUser.email, role: existingUser.role },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );

    // Redirige al frontend con el token
    res.redirect(`http://localhost:4000/auth-success?token=${token}`);
  } catch (error) {
    console.error("Error en callback de Google:", error);
    res.redirect("http://localhost:4000/login?error=server_error");
  }
});

// Ruta logout
app.get("/api/auth/logout", (req, res) => {
  res.oidc.logout({
    returnTo: "http://localhost:4000/login",
  });
});

// ============ API ROUTES ============
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Ruta base
app.get('/', (_req, res) => {
  res.send('ModernWatch API is running 🚀');
});

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Conectado a SENA database');
  })
  .catch((err) => {
    console.error('❌ Error de conexión:', err);
    process.exit(1);
  });

// Iniciar servidor (HTTP + WebSocket)
server.listen(port, () => {
  console.log(`🚀 Server + WebSocket running on port ${port}`);
});
