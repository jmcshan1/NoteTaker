const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const PORT = 3001;

const database = require('./db/db.json');

app.use(express.static('public'))

app.get('/notes', (req,res) => 
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    res.json(database)
})

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});