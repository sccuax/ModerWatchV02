const jwt = require("jsonwebtoken");
const User = require("./models/User");
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
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
  baseURL: process.env.AUTH0_BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  routes: {
    callback: '/api/auth/google/callback',
  },
};

// Middlewares
app.use(cors({
  origin: "http://localhost:4000",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(auth(config));

// ✅ Crear servidor HTTP + WebSocket ANTES de las rutas
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:4000",
    methods: ["GET", "POST"],
    credentials: true,
  },

    pingInterval: 25000,
  pingTimeout: 60000,
});

// ✅ IMPORTANTE: Compartir io con las rutas
app.set("io", io);

// ✅ Eventos WebSocket
io.on("connection", (socket) => {
  console.log("🟢 Cliente conectado:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Cliente desconectado:", socket.id);
  });
});

// Rutas Auth0
app.get("/api/auth/google/login", (req, res) => {
  res.oidc.login({
    returnTo: "/api/auth/google/users",
    authorizationParams: {
      connection: 'google-oauth2',
    },
  });
});

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
      { id: existingUser._id, email: existingUser.email },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.redirect(`http://localhost:4000/auth-success?token=${token}`);
  } catch (error) {
    console.error("Error en callback de Google:", error);
    res.redirect("http://localhost:4000/login?error=server_error");
  }
});

app.get("/api/auth/logout", (req, res) => {
  res.oidc.logout({
    returnTo: "http://localhost:4000/login",
  });
});

// Importar rutas
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

// ✅ Iniciar servidor
server.listen(port, () => {
  console.log(`🚀 Server + WebSocket running on port ${port}`);
});