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

// Sends back all the data in the database as a json
notes.get('/', (req, res) => 
    readFromFile('./db/db.json')
    .then((data) => res.json(JSON.parse(data))
    ));

// Route that adds the user inputted note into the database 
notes.post('/', (req, res) => {
    console.info(`${req.method} request received to add a note.`);
    // Destructures the title and text of the note the user sends in the post request
    const { title, text } = req.body;

    // Checks if the title and text of the note are defined 
    if(title && text) {
        const newNote = {
            title,
            text,
            // Creates a random id associated with each note
            id: uuid(),
        };

        // Appends the note the user saved into the database
        readAndAppend(newNote, './db/db.json');

        const response = {
            status: 'success',
            body: newNote,
        };

        console.log(response);
        // Sends a successful response status if the note has been added
        res.status(201).json(response);

    }   else {
        // Sends a server side error if either the title or text is undefined
        res.status(500).json('Error in posting review');
    }
});

module.exports = notes;