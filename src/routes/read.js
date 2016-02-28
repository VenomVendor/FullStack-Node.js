import express from 'express';
import dbs from '../controller/dbhandler';
import ai from '../model/ai';
import { constants } from '../utils/constants';

const router = new express.Router();
const ObjectID = require('mongodb').ObjectID;

const extractReqParams = (req, filter) => {
    const temp = req.query.temp || '';
    const humid = req.query.humid || '';
    const windSpeed = req.query.windSpeed || '';
    const windDir = req.query.windDir || '';
    const pressureStation = req.query.pressureStation || '';
    const pressureSea = req.query.pressureSea || '';

    if (temp && !temp.isTooEmpty()) {
        filter.Temperature = ai.getConditionalKey(temp);
    }
    if (humid && !humid.isTooEmpty()) {
        filter.Humidity = ai.getConditionalKey(humid);
    }
    if (windSpeed && !windSpeed.isTooEmpty()) {
        filter['Wind Speed'] = ai.getConditionalKey(windSpeed);
    }
    if (windDir && !windDir.isTooEmpty()) {
        filter['Wind Direction'] = ai.getConditionalKey(windDir);
    }
    if (pressureStation && !pressureStation.isTooEmpty()) {
        filter['Station Pressure'] = ai.getConditionalKey(pressureStation);
    }
    if (pressureSea && !pressureSea.isTooEmpty()) {
        filter['Sea Level Pressure'] = ai.getConditionalKey(pressureSea);
    }
};

const fetchFromDb = (dbPrams) => {
    const res = dbPrams.res;
    const filter = dbPrams.filter;
    const offset = dbPrams.offset;
    const limit = dbPrams.limit;
    const callback = dbPrams.callback;

    dbs.getMongoDb((err, db) => {
        if (err) {
            res.json(dbs.connectionError(err));
            return;
        }

        const collection = db.collection('data');

        if (collection === null) {
            res.json(dbs.queryError('Unknown Collection.'));
            return;
        }

        collection.stats((_err, _stat) => {
            let stat = _stat;
            if (stat === null) {
                stat = {};
                stat.count = -1;
            }

            collection.find(filter).skip(offset).limit(limit).toArray((er, docs) => {
                if (er) {
                    res.json(dbs.queryError(er));
                    return;
                }
                const data = {
                    status: constants.SUCCESS,
                    total: stat.count,
                    size: docs.length,
                    result: docs
                };

                if (callback) {
                    data.callback = callback;
                }
                res.json(data);
                db.close();
            });
        });
    });
};

/* GET weather listing. */
router.get('/weather', (req, res) => {
    const params = ai.stripParams(req);
    const limit = params.limit;
    const offset = params.offset;
    const callback = params.callback;
    const filter = {};
    const id = req.query.id || '';
    const day = req.query.day || 0;
    const state = req.query.state || '';

    const time = req.query.time || '';
    const airport = req.query.airport || '';

    if (!id.isTooEmpty()) {
        if (id.trim().length === 24) {
            filter._id = new ObjectID(id);
        } else {
            filter._id = new ObjectID('000000000000000000000000');
        }
    }

    if (day) {
        filter.Day = ai.getConditionalKey(day);
    }
    if (time && !time.isTooEmpty()) {
        filter.Time = ai.getConditionalKey(time);
    }
    if (state && !state.isTooEmpty()) {
        filter.State = state;
    }
    if (airport && !airport.isTooEmpty()) {
        filter.Airport = airport;
    }
    extractReqParams(req, filter);

    const dbPrams = {
        res,
        filter,
        offset,
        limit,
        callback
    };

    fetchFromDb(dbPrams);
});

export default router;
