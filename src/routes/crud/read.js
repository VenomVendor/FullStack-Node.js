import express from 'express';
import Hash from '../../utils/hash';
import QueryDB from '../../model/querydb';
import ParamsExtractor from '../../model/paramsextractor';
import { mongoConfig } from '../../utils/config';

const router = new express.Router();
const responseHelper = (req, res, err, response) => {
    if (err) {
        res.status(response.status).json(response.error);
        return false;
    } else if (req.query.type === 'json') {
        res.json(response);
        return false;
    }
    return true;
};

const getParams = (queryParams, collName) => {
    const dbPrams = {
        queryParams,
        collName
    };

    const pe = new ParamsExtractor(queryParams);
    dbPrams.filter = pe.extractReqParams(collName);
    return dbPrams;
};

/* GET weather listing. */
router.get('/weather', (req, res) => {
    const collection = mongoConfig.COLLECTION_WEATHER;
    const dbPrams = getParams(req.query, collection);
    const query = new QueryDB();

    query.fetchFromDb(dbPrams, (err, response) => {
        if (responseHelper(req, res, err, response)) {
            res.render('weather', { title: response.title, docs: response.result, hash: `-${Hash.short()}` });
        }
    });
});

/* GET single user listing. */
router.get('/user*/:userId', (req, res) => {
    req.query.id = req.params.userId;

    const collection = mongoConfig.COLLECTION_USER;
    const dbPrams = getParams(req.query, collection);
    const query = new QueryDB();

    query.fetchFromDb(dbPrams, (err, response) => {
        if (responseHelper(req, res, err, response)) {
            res.render('users', {
                title: `${response.title} - ${req.params.userId}`,
                docs: response.result,
                hash: `-${Hash.short()}`,
                noClick: true
            });
        }
    });
});

/* GET users listing. */
router.get('/user*', (req, res) => {
    const collection = mongoConfig.COLLECTION_USER;
    const dbPrams = getParams(req.query, collection);
    const query = new QueryDB();

    query.fetchFromDb(dbPrams, (err, response) => {
        if (responseHelper(req, res, err, response)) {
            res.render('users', {
                title: response.title,
                docs: response.result,
                hash: `-${Hash.short()}`
            });
        }
    });
});

export default router;
