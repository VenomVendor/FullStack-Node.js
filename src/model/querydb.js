import { mongoConfig } from '../utils/config';
import { constants, strings as S } from '../utils/constants';
import DBHandler from '../controller/dbhandler';
import ParamsExtractor from './paramsextractor';

const dbs = new DBHandler();

class QueryDB extends ParamsExtractor {
    fetchFromDb(dbPrams) {
        const filter = super.extractReqParams();
        const res = dbPrams.res;
        const offset = dbPrams.offset;
        const limit = dbPrams.limit;
        const callback = dbPrams.callback;

        dbs.getMongoDb((err, db) => {
            if (err) {
                res.status(500).json(dbs.connectionError(err));
                return;
            }
            const collection = db.collection(mongoConfig.COLLECTION);

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
    }
}

export default QueryDB;
