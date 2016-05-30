import mongodb from 'mongodb';
import { mongoConfig } from '../utils/config';
import AI from '../model/ai';
import Helper from '../utils/helpers';

const ObjectID = mongodb.ObjectID;
const column = mongoConfig.KEYS;
const helper = new Helper();
const ai = new AI();

const extractCommonParams = (q) => {
    const filter = {};

    const _id = q._id || '';
    if (!helper.isTooEmpty(_id)) {
        if (_id.trim().length === 24) {
            filter[column._id] = new ObjectID(_id);
        } else {
            filter[column._id] = new ObjectID('0'.repeat(24));
        }
    }
    return filter;
};

const crushFilter = (filters) => {
    const cFilter = {};
    Object.keys(filters).forEach((key) => {
        const val = filters[key];
        if (val || parseInt(val, 10) === 0) {
            cFilter[key] = val;
        }
    });

    return cFilter;
};

class ParamsExtractor {

    constructor(query) {
        this._query = query;
    }

    extractReqParams(collName) {
        let filter;
        switch (collName) {
            case mongoConfig.COLLECTION_WEATHER:
                filter = this.extractWeatherParams();
                break;
            case mongoConfig.COLLECTION_USER:
                filter = this.extractUserParams();
                break;
            default:
                throw new Error('Unknown Collection');
        }
        return filter;
    }

    extractWeatherParams() {
        const q = this._query;
        const filter = extractCommonParams(q);

        const day = q.day || '';
        const state = q.state || '';
        const time = q.time || '';
        const airport = q.airport || '';
        const temp = q.temp || '';
        const humidity = q.humidity || '';
        const windSpeed = q.windSpeed || '';
        const windDir = q.windDir || '';
        const pressureStation = q.pressureStation || '';
        const pressureSea = q.pressureSea || '';

        filter[column.State] = state;
        filter[column.Airport] = airport;
        filter[column.Day] = ai.getConditionalKey(day);
        filter[column.Time] = ai.getConditionalKey(time);
        filter[column.Temperature] = ai.getConditionalKey(temp);
        filter[column.Humidity] = ai.getConditionalKey(humidity);
        filter[column.WindSpeed] = ai.getConditionalKey(windSpeed);
        filter[column.WindDirection] = ai.getConditionalKey(windDir);
        filter[column.StationPressure] = ai.getConditionalKey(pressureStation);
        filter[column.SeaLevelPressure] = ai.getConditionalKey(pressureSea);

        return crushFilter(filter);
    }

    extractUserParams() {
        const q = this._query;
        const filter = extractCommonParams(q);

        const id = q.id || '';
        const firstName = q.firstName || '';
        const company = q.company || '';
        const email = q.email || '';
        const gender = q.gender || q.g || '';

        filter[column.Id] = parseInt(id, 10);
        filter[column.FirstName] = firstName;
        filter[column.Company] = company;
        filter[column.Email] = email;
        filter[column.Gender] = ai.getGender(gender);

        if (isNaN(filter.id)) {
            filter.id = { $type: 'number' };
        }

        return crushFilter(filter);
    }
}

export default ParamsExtractor;
