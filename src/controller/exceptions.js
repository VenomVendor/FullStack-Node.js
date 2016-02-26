'use strict';

var constants = require('../utils/constants');
var util = require('util');

var exceptions = {
    printStackTrace: function(err) {
        Object.keys(err).forEach(function(ele) {
            util.debuglog(err[ele]);
        });
        if(constants.DEBUG) {
            throw err;
        }
        return {
            status: constants.ERROR,
            message: err.errmsg || err.msg
        };
    }
};

module.exports = exceptions;
