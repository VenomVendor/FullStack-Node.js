'use strict';

var express = require('express');
var router = express.Router();
var constants = require('../utils/constants');

router.all('/', function(req, res) {
    var data = {
        status: constants.SUCCESS,
        version: constants.API.VERSION
    };
    res.json(data);
});

// define the about route
router.get('/about', function(req, res, next) {
    next();
}, function(req, res) {
    var data = {
        status: constants.SUCCESS,
        version: constants.API.VERSION,
        about: constants.API.ABOUT
    };
    res.json(data);
});

module.exports = router;
