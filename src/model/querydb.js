import { constants, strings as S } from '../utils/constants';
import DBHandler from '../controller/dbhandler';
import AI from './ai';

const dbs = new DBHandler();

class QueryDB {
    fetchFromDb(params, callback) {
        const filter = params.filter;

        const ai = new AI();
        const mParams = ai.stripParams(params.queryParams);
        const limit = mParams.limit;
        const offset = mParams.offset;
        const cb = mParams.callback;

        dbs.getMongoDb((err, db) => {
            if (err) {
                callback(err, {
                    status: 500,
                    error: dbs.connectionError(err)
                });
                return;
            }
            const collection = db.collection(params.collName);

            collection.stats((_err, _stat) => {
                if (_stat === undefined || _stat === null) {
                    callback(new Error(S.UNKNOWN_COLLECTION), {
                        status: 500,
                        error: dbs.queryError(S.UNKNOWN_COLLECTION)
                    });
                    return;
                }

                console.log(`\nfilter: ${JSON.stringify(filter)}`, `\nlimit: ${limit}`, `\noffset: ${offset}`);

                collection.find({ title: { $type: 'string' } }).toArray((___err, titleData) => {
                    if (___err) {
                        callback(___err, {
                            status: 500,
                            error: dbs.queryError(___err)
                        });
                        return;
                    }

                    collection.find(filter)
                        .skip(offset)
                        .limit(limit)
                        .sort({ id: 1 })
                        .toArray((__err, docs) => {
                            if (__err) {
                                callback(__err, {
                                    status: 500,
                                    error: dbs.queryError(__err)
                                });
                                return;
                            }
                            const data = {
                                status: constants.SUCCESS,
                                total: _stat.count,
                                size: docs.length,
                                title: titleData[0].title,
                                result: docs
                            };

                            if (cb) {
                                data.callback = cb;
                            }
                            callback(null, data);
                        });
                });
            });
        });
    }

    deleteById(params, callback) {
        dbs.getMongoDb((err, db) => {
            if (err) {
                callback(err, { status: 500, error: dbs.connectionError(err) });
                return;
            }
            const collection = db.collection(params.collName);

            collection.stats((_err, _stat) => {
                if (_stat === undefined || _stat === null) {
                    callback(new Error(S.UNKNOWN_COLLECTION), {
                        status: 500,
                        error: dbs.queryError(S.UNKNOWN_COLLECTION)
                    });
                    return;
                }
                const filter = { id: parseInt(params.id, 10) };
                console.log(filter);

                collection.deleteOne(filter, (__err, results) => {
                    if (__err) {
                        callback(__err, { status: 500, error: dbs.queryError(__err) });
                        return;
                    }
                    console.log(results.result);

                    const data = {};

                    if (results.result.ok === 1 && results.result.n > 0) {
                        data.status = constants.SUCCESS;
                    } else {
                        data.status = constants.ERROR;
                        data.message = 'Unable to delete';
                    }

                    const cb = params.callback;
                    if (cb) {
                        data.callback = cb;
                    }
                    callback(null, data);
                });
            });
        });
    }
}

export default QueryDB;
