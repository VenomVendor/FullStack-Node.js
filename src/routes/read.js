'use strict';

var express = require('express');
var router = express.Router();
var dbs = require('../controller/dbhandler');
var ai = require('../model/ai');
var constants = require('../utils/constants');
var ObjectID = require('mongodb').ObjectID;

var extractReqParams = function(req, filter) {
    var temp = req.query.temp || '';
    var humid = req.query.humid || '';
    var windSpeed = req.query.windSpeed || '';
    var windDir = req.query.windDir || '';
    var pressureStation = req.query.pressureStation || '';
    var pressureSea = req.query.pressureSea || '';

    if(temp && !temp.isTooEmpty()) {
        filter.Temperature = ai.getConditionalKey(temp);
    }
    if(humid && !humid.isTooEmpty()) {
        filter.Humidity = ai.getConditionalKey(humid);
    }
    if(windSpeed && !windSpeed.isTooEmpty()) {
        filter['Wind Speed'] = ai.getConditionalKey(windSpeed);
    }
    if(windDir && !windDir.isTooEmpty()) {
        filter['Wind Direction'] = ai.getConditionalKey(windDir);
    }
    if(pressureStation && !pressureStation.isTooEmpty()) {
        filter['Station Pressure'] = ai.getConditionalKey(pressureStation);
    }
    if(pressureSea && !pressureSea.isTooEmpty()) {
        filter['Sea Level Pressure'] = ai.getConditionalKey(pressureSea);
    }
};

var fetchFromDb = function(dbPrams) {
    var res = dbPrams.res;
    var filter = dbPrams.filter;
    var offset = dbPrams.offset;
    var limit = dbPrams.limit;
    var callback = dbPrams.callback;

    dbs.getMongoDb(function(err, db) {
        if(err) {
            res.json(dbs.connectionError(err));
        }

        var collection = db.collection('data');

        if(collection === null) {
            res.json(dbs.queryError('Unknown Collection.'));
        }

        collection.stats(function(_err, _stat) {

            var stat = _stat;
            if(stat === null) {
                stat = {};
                stat.count = -1;
            }

            collection.find(filter).skip(offset).limit(limit).toArray(function(err, docs) {
                if(err) {
                    res.json(dbs.queryError(err));
                }
                var data = {
                    status: constants.SUCCESS,
                    total: stat.count,
                    size: docs.length,
                    result: docs
                };

                if(callback) {
                    data.callback = callback;
                }
                res.json(data);
                db.close();
            });

        });
    });
};

/* GET weather listing. */
router.get('/weather', function(req, res) {
    var params = ai.stripParams(req);
    var limit = params.limit;
    var offset = params.offset;
    var callback = params.callback;
    var filter = {};
    var id = req.query.id || '';
    var day = req.query.day || 0;
    var state = req.query.state || '';

    var time = req.query.time || '';
    var airport = req.query.airport || '';

    if(!id.isTooEmpty()) {
        if(id.trim().length === 24) {
            filter._id = new ObjectID(id);
        } else {
            filter._id = new ObjectID('000000000000000000000000');
        }
    }

    if(day) {
        filter.Day = ai.getConditionalKey(day);
    }
    if(time && !time.isTooEmpty()) {
        filter.Time = ai.getConditionalKey(time);
    }
    if(state && !state.isTooEmpty()) {
        filter.State = state;
    }
    if(airport && !airport.isTooEmpty()) {
        filter.Airport = airport;
    }
    extractReqParams(req, filter);

    var dbPrams = {
        res: res,
        filter: filter,
        offset: offset,
        limit: limit,
        callback: callback
    };

    fetchFromDb(dbPrams);
});

module.exports = router;
