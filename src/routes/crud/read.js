import express from 'express';
import AI from '../../model/ai';
import QueryDB from '../../model/querydb';

const router = new express.Router();

/* GET weather listing. */
router.get('/weather', (req, res) => {
    const query = new QueryDB(req.query);
    const ai = new AI();
    const params = ai.stripParams(req);
    const limit = params.limit;
    const offset = params.offset;
    const callback = params.callback;

    const dbPrams = {
        res,
        limit,
        offset,
        callback
    };

    query.fetchFromDb(dbPrams);
});

export default router;
