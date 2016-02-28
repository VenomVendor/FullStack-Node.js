/**
 * Created by VenomVendor on 22-Jun-2015.
 */
const radix = 10;
let ai = {};
ai = {
    getLimit(limit) {
        return isNaN(limit) || parseInt(limit, radix) < 1 ? 100 : parseInt(limit, radix);
    },

    getOffset(offset) {
        return isNaN(offset) || parseInt(offset, radix) < 1 ? 0 : parseInt(offset, radix);
    },

    nextOffset(count, offset, limit) {
        const off = parseInt(offset, radix);
        const lim = parseInt(limit, radix);
        let newOffset;
        if (count < lim) {
            newOffset = count === 0 ? count : count + off;
        } else {
            newOffset = off + lim;
        }
        return newOffset;
    },

    stripParams(req) {
        // req.body, or req.query
        return {
            limit: ai.getLimit(req.query.limit),
            offset: ai.getOffset(req.query.offset),
            callback: req.query.callback || null
        };
    },

    getConditionalKey(val) {
        let ret;
        const seperator = val.search('~');
        if (seperator < 0) {
            ret = parseFloat(val);
        } else {
            const condition = val.substr(0, seperator);
            if (condition === 'gt' || condition === 'lt' || condition === 'gte' || condition === 'lte') {
                const parsedVal = parseFloat(val.substring(val.search('~') + 1));
                if (!isNaN(parsedVal)) {
                    ret = { [`$${condition}`]: parsedVal };
                }
            }
        }
        return ret;
    }
};

export default ai;
