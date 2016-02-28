import express from 'express';
import mongodb from 'mongodb';
import dbs from '../controller/dbhandler';
import ai from '../model/ai';
import { mongo } from '../utils/config';
import { constants, strings as S } from '../utils/constants';
import Helper from '../utils/helpers';

const router = new express.Router();
const ObjectID = mongodb.ObjectID;
const helper = new Helper();

const extractReqParams = (req, filter) => {
    const temp = req.query.temp || '';
    const humid = req.query.humid || '';
    const windSpeed = req.query.windSpeed || '';
    const windDir = req.query.windDir || '';
    const pressureStation = req.query.pressureStation || '';
    const pressureSea = req.query.pressureSea || '';

    if (temp && !helper.isTooEmpty(temp)) {
        filter[mongo.KEYS.Temperature] = ai.getConditionalKey(temp);
    }
    if (humid && !helper.isTooEmpty(humid)) {
        filter[mongo.KEYS.Humidity] = ai.getConditionalKey(humid);
    }
    if (windSpeed && !helper.isTooEmpty(windSpeed)) {
        filter[mongo.KEYS.WindSpeed] = ai.getConditionalKey(windSpeed);
    }
    if (windDir && !helper.isTooEmpty(windDir)) {
        filter[mongo.KEYS.WindDirection] = ai.getConditionalKey(windDir);
    }
    if (pressureStation && !helper.isTooEmpty(pressureStation)) {
        filter[mongo.KEYS.StationPressure] = ai.getConditionalKey(pressureStation);
    }
    if (pressureSea && !helper.isTooEmpty(pressureSea)) {
        filter[mongo.KEYS.SeaLevelPressure] = ai.getConditionalKey(pressureSea);
    }
    return filter;
};

const fetchFromDb = (dbPrams) => {
    const res = dbPrams.res;
    const filter = dbPrams.filter;
    const offset = dbPrams.offset;
    const limit = dbPrams.limit;
    const callback = dbPrams.callback;

    dbs.getMongoDb((err, db) => {
        if (err) {
            res.status(500).json(dbs.connectionError(err));
            return;
        }
        const collection = db.collection(mongo.COLLECTION);

        collection.stats((_err, _stat) => {
            if (_stat === undefined || _stat === null) {
                res.status(500).json(dbs.queryError(S.UNKNOWN_COLLECTION));
                return;
            }

            collection.find(filter).skip(offset).limit(limit).toArray((er, docs) => {
                if (er) {
                    res.json(dbs.queryError(er));
                    return;
                }
                const data = {
                    status: constants.SUCCESS,
                    total: _stat.count,
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
    let filter = {};
    const id = req.query.id || '';
    const day = req.query.day || 0;
    const state = req.query.state || '';

    const time = req.query.time || '';
    const airport = req.query.airport || '';

    if (!helper.isTooEmpty(id)) {
        if (id.trim().length === 24) {
            filter[mongo.KEYS._id] = new ObjectID(id);
        } else {
            filter[mongo.KEYS._id] = new ObjectID('000000000000000000000000');
        }
    }

    if (day) {
        filter[mongo.KEYS.Day] = ai.getConditionalKey(day);
    }
    if (time && !helper.isTooEmpty(time)) {
        filter[mongo.KEYS.Time] = ai.getConditionalKey(time);
    }
    if (state && !helper.isTooEmpty(state)) {
        filter[mongo.KEYS.State] = state;
    }
    if (airport && !helper.isTooEmpty(airport)) {
        filter[mongo.KEYS.Airport] = airport;
    }
    filter = extractReqParams(req, filter);

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
