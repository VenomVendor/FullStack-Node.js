'use strict';

var MongoClient = require('mongodb').MongoClient;
var e = require('./exceptions');

var getMongoDb = function(callback) {
    MongoClient.connect('mongodb://127.0.0.1:27017/weather', function(err, db) {
        try {
            callback(err, db);
        } catch (e) {
            callback(e);
        }
    });
};

var connectionError = function(err) {
    if(!err.msg) {
        err.msg = 'Error while creating connection.';
    }
    return e.printStackTrace(err);
};

var connectError = function(err) {
    if(!err.msg) {
        err.msg = 'Error while connecting.';
    }
    return e.printStackTrace(err);
};

var queryError = function(err) {
    if(!err.msg) {
        err.msg = 'Error while performing Query.';
    }
    return e.printStackTrace(err);
};

var db = {
    getMongoDb: getMongoDb,
    connectionError: connectionError,
    connectError: connectError,
    queryError: queryError
};

module.exports = db;
