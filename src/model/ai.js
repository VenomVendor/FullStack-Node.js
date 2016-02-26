'use strict';

/**
 * Created by VenomVendor on 22-Jun-2015.
 */

var ai = {
    getLimit: function(limit) {
        return isNaN(limit) ? 100 : parseInt(limit) < 1 ? 100 : parseInt(limit);
    },

    getOffset: function(offset) {
        return isNaN(offset) ? 0 : parseInt(offset) < 1 ? 0 : parseInt(offset);
    },

    nextOffset: function(count, offset, limit) {
        var off = parseInt(offset, 10),
            lim = parseInt(limit, 10);
        return count < lim ? count === 0 ? count : count + off : off + lim;
    },

    stripParams: function(req) {
        //req.body, or req.query
        return {
            limit: ai.getLimit(req.query.limit),
            offset: ai.getOffset(req.query.offset),
            callback: req.query.callback || null
        };
    },

    getConditionalKey: function(val) {
        var ret;
        var seperator = val.search('~');
        if(seperator < 0) {
            ret = parseFloat(val);
        } else {
            var condition = val.substr(0, seperator);
            if(condition === 'gt' || condition === 'lt' || condition === 'gte' || condition === 'lte') {
                var parsedVal = parseFloat(val.substring(val.search('~') + 1));
                if(!isNaN(parsedVal)) {
                    ret = {['$' + condition]: parsedVal};
                }
            }
        }
        return ret;
    }
};

module.exports = ai;
