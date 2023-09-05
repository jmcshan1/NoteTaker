const fs = require('fs');
const notes = require('express').Router();
const path = require('path');
const express = require('express');

// Helper functions that allows me to read and write on the JSON file
const { readAndAppend, readFromFile } = require('../helpers/fsUtils');



notes.use(express.json());
notes.use(express.urlencoded({ extended: true }));

const uuid = require('../helpers/uuid')

// Can get data for individual note by entering its id
notes.get('/:id', (req, res) => {
    // Gets the user inputted id
    const noteId = (req.params.id).toLowerCase();
    // Reads the json file containing the saved notes
    readFromFile('./db/db.json')
        .then((data) => {
            // Parses the json file
            let noteData = JSON.parse(data);
            const activeNote = noteData.find((activeNote) => activeNote.id === noteId);

            if (activeNote) {
                res.json(activeNote);
            } else {
                res.status(404).json({error: 'Note not found'});
            }
        })
})

notes.get('/', (req, res) => 
    readFromFile('./db/db.json')
    .then((data) => res.json(JSON.parse(data))
    ));

notes.post('/', (req, res) => {
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
});

module.exports = notes;