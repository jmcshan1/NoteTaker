const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const PORT = 3001;
const uuid = require('./helpers/uuid')
const { readAndAppend, readFromFile } = require('./helpers/fsUtils');

const database = require('./db/db.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'))

app.get('/notes', (req,res) => 
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes/:id', (req, res) => {
    const noteId = (req.params.id).toLowerCase();
    readFromFile('./db/db.json')
        .then((data) => {
            let noteData = JSON.parse(data);
            const activeNote = noteData.find((activeNote) => note.id === noteId);

            if (activeNote) {
                res.json(activeNote);
            } else {
                res.status(404).json({error: 'Note not found'});
            }
        })
})

app.get('/api/notes', (req, res) => 
    readFromFile('./db/db.json')
    .then((data) => res.json(JSON.parse(data))
    ));

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a note.`);
    const { title, text } = req.body;

    if(title && text) {
        const newNote = {
            title,
            text,
            id: uuid(),
        };

        readAndAppend(newNote, './db/db.json');

        const response = {
            status: 'success',
            body: newNote,
          };

        console.log(response);
        res.status(201).json(response);

    }   else {
        res.status(500).json('Error in posting review');
    }
})

// app.delete('/api/notes', (req, res) => {
//     res.json(database)
// })

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});