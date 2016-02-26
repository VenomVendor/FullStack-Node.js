'use strict';

var express = require('express');
var router = express.Router();

/* demo. */
router.all('/', function(req, res) {
    var data = {
        success: 'success',
        type: 'demo'
    };
    res.json(data);
    res.end();
});

module.exports = router;
