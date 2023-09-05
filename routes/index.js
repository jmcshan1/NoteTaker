const express = require('express');

// Imports notes.js 
const route = require('./notes');

// Creates
const app = express();

// Any requests starting in /api/notes are directed to notes router
app.use('/notes', route);

module.exports = app;
