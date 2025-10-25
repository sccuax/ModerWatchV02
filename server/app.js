//here we're importing the dependencies we need
const jwt = require("jsonwebtoken");
const User = require("./models/User")
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { auth } = require("express-openid-connect");
const cors = require('cors');
require('dotenv').config();

//instanciating express
const app = express();
//defining the port where the app will run
const port = process.env.PORT || 3000;

//Auth0 configuration
const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET_KEY,
    baseURL: process.env.AUTH0_BASE_URL,
    clientID: process.env.AUTH0_CLIENT_ID,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    routes: {
        callback: '/api/auth/google/callback' // Personaliza la ruta de callback
    }
};

// Middlewares
//configuiring the app to use bodyParser, and to look for JSON data in the request body
app.use(cors({
    origin: "http://localhost:4000",
    credentials: true,
}));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(auth(config));

// Ruta para INICIAR login con Google (redirige a Auth0)
app.get("/api/auth/google/login", (req, res) => {
    res.oidc.login({
        returnTo: "/api/auth/google/users",
        authorizationParams: {
            connection: 'google-oauth2', // Fuerza el login con Google
        }
    });
});

// Ruta CALLBACK después de autenticarse con Google - Esta se ejecuta automáticamente después de /api/auth/google/callback
app.get("/api/auth/google/users", async (req, res) => {
    try {
        if (!req.oidc.isAuthenticated()) {
            return res.redirect("http://localhost:4000/login?error=not_authenticated");
        }

        const user = req.oidc.user;
        console.log("Usuario autenticado desde Google:", user);

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

// Ruta para cerrar sesión (agrégala después de /api/auth/google/users)
app.get("/api/auth/logout", (req, res) => {
    // Limpia la sesión de Auth0 y redirige al login
    res.oidc.logout({
        returnTo: "http://localhost:4000/login"
    });
});

//importing the route files
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
//const productRoutes = require("./routes/products");
//const supplierRoutes = require("./routes/suppliers");
//const orderRoutes = require("./routes/orders");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
//app.use("/api/products", productRoutes);
//app.use("/api/suppliers", supplierRoutes);
//app.use("/api/orders", orderRoutes);

//here we're defining a simple route to make sure everything is working and send a message to the user
app.get('/', (_req, res) => {
    res.send('ModernWatch API is running 🚀');
});

//conexionn to the database
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('you are connected to SENA database');
    })
    .catch((err) => {
        console.error('conexion error:', err);
        process.exit(1); // Exit the process if DB connection fails
    });

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});