//here we're importing the dependencies we need
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();



//instanciating express
const app = express();
//defining the port where the app will run
const port = process.env.PORT || 3000;

// Middlewares
//configuiring the app to use bodyParser, and to look for JSON data in the request body
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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