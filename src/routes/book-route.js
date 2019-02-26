'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/book-controller');


router.get('/', controller.get);
router.get('/:id', controller.getById);
router.post('/', controller.post);


module.exports = router;