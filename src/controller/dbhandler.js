const MongoClient = require('mongodb').MongoClient;
import e from './exceptions';
import { mongo } from '../utils/config';

const getMongoDb = (callback) => {
    MongoClient.connect(mongo.URL, (err, db) => {
        try {
            callback(err, db);
        } catch (exception) {
            callback(exception);
        }
    });
};

const readError = (err, _errMsg) => {
    let __err;
    if (err.msg) {
        __err = err;
    } else {
        __err = {
            msg: typeof err === 'string' ? err : _errMsg
        };
    }
    return e.printStackTrace(__err);
};

/* eslint arrow-body-style: 0 */
const connectionError = err => {
    return readError(err, 'Error while creating connection.');
};

const connectError = err => {
    return readError(err, 'Error while connecting.');
};

const queryError = err => {
    return readError(err, 'Error while performing Query.');
};

const db = {
    getMongoDb,
    connectionError,
    connectError,
    queryError
};

export default db;
