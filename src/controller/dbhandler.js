import MongoClient from 'mongodb';
import ErrorHandler from './errorhandler';
import { mongoConfig } from '../utils/config';

const MAX_POOL = 100;
const dbInstances = [];
let i;

const createNewConnection = (callback) => {
    // console.log('createNewConnection');
    const options = {
        db: { native_parser: true },
        server: {
            socketOptions: { connectTimeoutMS: 500 },
            poolSize: MAX_POOL,
            logger: console
        },
        replSet: {},
        mongos: {}
    };

    MongoClient.connect(mongoConfig.URL, options, (err, db) => {
        try {
            // console.log(`before:${dbInstances.length}`);
            dbInstances.push(db);
            callback(err, db);
            // console.log(`after:${dbInstances.length}`);
        } catch (exception) {
            callback(exception);
            // console.log(exception);
        }
    });
};

const getBestDb = (callback) => {
    // console.log('getBestDb');
    dbInstances[i].command({ connPoolStats: 1 }, (err, connPoolStats) => {
        // console.log(`current:${dbInstances.length}`);
        if (err) {
            callback(err);
        } else if (connPoolStats && connPoolStats.totalInUse < MAX_POOL) {
            callback(null, dbInstances[i]);
        } else {
            if (++i < dbInstances.length) {
                getBestDb(callback);
            } else {
                createNewConnection(callback);
            }
        }
    });
};

class DBHandler extends ErrorHandler {
    getMongoDb(callback) {
        // console.log('getMongoDb');
        if (dbInstances.length) {
            i = 0;
            getBestDb(callback);
        } else {
            // console.log('getMongoDb:createNewConnection');
            createNewConnection(callback);
        }
    }

    killAll() {
        for (const db of dbInstances) {
            db.close();
        }
        dbInstances.length = 0;
    }

    kill(db) {
        const index = dbInstances.indexOf(db);
        if (index !== -1) {
            dbInstances[index].close();
            dbInstances.splice(index, 1);
        }
    }
}

export default DBHandler;
