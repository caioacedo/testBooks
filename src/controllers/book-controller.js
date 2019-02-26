

const mongoose = require('mongoose');
const Book = mongoose.model('Book');

exports.get = (req, res, next) => {
    Book
        .find({})
        .then(data => {
            res.status(200).send(data);
        }).catch(e => {
            res.status(400).send(e)
        });
    }
        

exports.post = (req, res, next) => {
    var book = new Book(req.body);
    
    book
        .save()
        .then(x => {
            res.status(201).send({ 
            message: 'Book(s) successfully registered!'
        });

        }).catch(e => {
            res.status(400).send({ 
            message: 'Failed to register Book(s)!',
            data: e
        });
    })
}

exports.getById = (req, res, next) => {
    Book
        .findById(req.params.id)
        .then(data => {
            res.status(200).send(data);
        }).catch(e => {
            res.status(400).send(e)
            });
        }
    
 