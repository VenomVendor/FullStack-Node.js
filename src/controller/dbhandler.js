import { mongoConfig } from '../utils/config';
import ErrorHandler from './errorhandler';

const MongoClient = require('mongodb').MongoClient;

class DBHandler extends ErrorHandler {
    getMongoDb(callback) {
        MongoClient.connect(mongoConfig.URL, (err, db) => {
            try {
                callback(err, db);
            } catch (exception) {
                callback(exception);
            }
        });
    }
}

export default DBHandler;
