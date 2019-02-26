'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required! '],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required! '],
        trim: true
    },
    isbn: {
        type: Number,
        required: [true, 'Isbn is required! '],
    },
    language: {
        type: String,
        required: [true, 'Language is required! '],
        trim: true
    }
});

module.exports = mongoose.model('Book', schema);

