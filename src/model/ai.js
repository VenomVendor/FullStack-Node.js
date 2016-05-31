/**
 * Created by VenomVendor on 22-Jun-2015.
 */
const radix = 10;

class AI {
    getLimit(limit) {
        return isNaN(limit) || parseInt(limit, radix) < 1 ? 100 : parseInt(limit, radix);
    }

    getOffset(offset) {
        return isNaN(offset) || parseInt(offset, radix) < 1 ? 0 : parseInt(offset, radix);
    }

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
    }

    stripParams(query) {
        // req.body, or req.query
        return {
            limit: this.getLimit(query.limit),
            offset: this.getOffset(query.offset),
            callback: query.callback || null
        };
    }

    getConditionalKey(val) {
        const split = '~';
        if (!val) {
            return val;
        }
        let ret;
        const seperator = val.search(split);
        if (seperator < 0) {
            ret = parseFloat(val);
        } else {
            const condition = val.substr(0, seperator);
            if (condition === 'gt' || condition === 'lt' || condition === 'gte' || condition === 'lte') {
                const parsedVal = parseFloat(val.substring(val.search(split) + 1));
                if (!isNaN(parsedVal)) {
                    ret = { [`$${condition}`]: parsedVal };
                }
            }
        }
        return ret;
    }

    getGender(val) {
        if (!val) {
            return val;
        }
        if (val.toLocaleLowerCase() === 'king') {
            return 'Male';
        } else if (val.toLocaleLowerCase() === 'queen') {
            return 'Female';
        }
        return null;
    }
}

export default AI;
