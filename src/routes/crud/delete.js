import express from 'express';
import Dummy from '../dummy';
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

/* delete. */
router.all('/:id', (req, res) => {
    const query = new QueryDB();

    const dbPrams = {
        collName: mongoConfig.COLLECTION_USER,
        callback: req.query.callback,
        id: req.params.id
    };

    query.deleteById(dbPrams, (err, response) => {
        if (responseHelper(req, res, err, response)) {
            res.json(response);
        }
    });
});

router.all('/', (req, res) => {
    const dummy = new Dummy('Delete');
    dummy.getData(res);
});

export default router;
