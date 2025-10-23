const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // "Bearer TOKEN"

    if (!token) return res.status(403).json({ error: "Token required" });

    try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; // añade {id, role} al request
    next();
    } catch (err) {
        res.status(401).json({ error: "invalid token or has expired" });
    }
}

module.exports = verifyToken;