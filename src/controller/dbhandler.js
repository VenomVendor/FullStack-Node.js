const MongoClient = require('mongodb').MongoClient;
import e from './exceptions';

const getMongoDb = callback => {
    MongoClient.connect('mongodb://127.0.0.1:27017/weather', (err, db) => {
        try {
            callback(err, db);
        } catch (exception) {
            callback(exception);
        }
    });
};

const connectionError = err => {
    if (!err.msg) {
        err.msg = 'Error while creating connection.';
    }
    return e.printStackTrace(err);
};

const connectError = err => {
    if (!err.msg) {
        err.msg = 'Error while connecting.';
    }
    return e.printStackTrace(err);
};

const queryError = err => {
    if (!err.msg) {
        err.msg = 'Error while performing Query.';
    }
    return e.printStackTrace(err);
};

const db = {
    getMongoDb,
    connectionError,
    connectError,
    queryError
};

export default db;
