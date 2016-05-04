import express from 'express';
import git from 'git-rev-sync';
import QueryDB from '../../model/querydb';
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

/* GET weather listing. */
router.get('/weather', (req, res) => {
    const query = new QueryDB(req.query);

    const dbPrams = {
        collName: mongoConfig.COLLECTION_WEATHER,
        queryParams: req.query
    };

    query.fetchFromDb(dbPrams, (err, response) => {
        if (responseHelper(req, res, err, response)) {
            res.render('weather', { title: response.title, docs: response.result, hash: `-${git.short()}` });
        }
    });
});

/* GET User listing. */
router.get('/user*', (req, res) => {
    const query = new QueryDB(req.query);

    const dbPrams = {
        collName: mongoConfig.COLLECTION_USER,
        queryParams: req.query
    };

    query.fetchFromDb(dbPrams, (err, response) => {
        if (responseHelper(req, res, err, response)) {
            res.render('users', { title: response.title, docs: response.result, hash: `-${git.short()}` });
        }
    });
});

export default router;
