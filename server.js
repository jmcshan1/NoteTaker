const path = require('path');
// Imports express npm
const express = require('express');
// Creates an instance of express in the app variable
const app = express();

const PORT = process.env.PORT || 3001;
const api = require('./routes/index');

// Middleware that parses JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to setup statis files form the public folder
app.use(express.static('public'));

// All request that start with api go to the index.js inside the routes folder
app.use('/api', api);

// Routes the /notes to the notes html
app.get('/notes', (req,res) => 
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});

