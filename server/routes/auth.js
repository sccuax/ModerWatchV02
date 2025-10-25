const express = require("express");
const router = express.Router();
const { login } = require("../controllers/authController");
const { auth } = require('express-openid-connect');

// endpoint for logging in
router.post("/login", login);
// Ruta GET (login con Auth0 - Google, etc.)
router.get("/login", (req, res) => {
  // Redirige a Auth0
  res.redirect("https://dev-sena.us.auth0.com/authorize?" + 
    new URLSearchParams({
      response_type: "code",
      client_id: process.env.AUTH0_CLIENT_ID,
      redirect_uri: "http://localhost:3000/callback", // Cambia esto si tu backend tiene otra ruta de callback
      scope: "openid profile email",
      audience: "https://dev-sena.us.auth0.com/"
    })
  );
});

module.exports = router;
