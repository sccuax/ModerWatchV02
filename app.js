//here we're importing the dependencies we need
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


//instanciating express
const app = express();
//defining the port where the app will run
const port = process.env.PORT || 3000;

// Middlewares
//configuiring the app to use bodyParser, and to look for JSON data in the request body
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//importing the post route
const postRoute = require('./routes/post');
app.use('/api/students', postRoute);


//here we're defining a simple route to make sure everything is working and send a message to the user
app.get('/', (_req, res) => {
    res.send('Node js API');   
});  

//array simulating a database
/* const studendts = [
    { id: 1, name: 'Jonathan', age: 20, enroll: true },
    { id: 2, name: 'Camilo', age: 20, enroll: false },  
    { id: 3, name: 'David', age: 20, enroll: true }
];
 */
/* 
// here is teh route to get all students
app.get('/api/students', (_req, res) => {
    res.json(studendts);});

// here is the route to get a single student by id
app.get('/api/students/:id', (req, res) => {
    const student = studendts.find(s => s.id === parseInt(req.params.id));
    if (!student) return res.status(404).send('The student with the given ID was not found.');
    res.json(student);
});

//here is the route to create a new student in the database
app.post('/api/students', (req, res) => {
    const student = {
        id: studendts.length + 1,   
        name: req.body.name,
        age: parseInt(req.body.age),
        enroll: (req.body.enroll === 'true')
    
    };
    studendts.push(student);
    res.json(student);
});

//here is the route to delete a student by id
app.delete('/api/students/:id', (req, res) => {
    const student = studendts.find(s => s.id === parseInt(req.params.id));
    if (!student) return res.status(404).send('This student does not exist.');
    // Remove the student from the array
    const index = studendts.indexOf(student);
    if (index > -1) {
        studendts.splice(index, 1);
    }
    res.json(student);
}); */


mongoose.connect('mongodb+srv://jonathan_velez_parra:3127289175@sena.hvugxwv.mongodb.net/?retryWrites=true&w=majority&appName=SENA')
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

