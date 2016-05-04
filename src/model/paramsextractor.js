import mongodb from 'mongodb';
import { mongoConfig } from '../utils/config';
import AI from '../model/ai';
import Helper from '../utils/helpers';

const ObjectID = mongodb.ObjectID;
const column = mongoConfig.KEYS;
const helper = new Helper();
const ai = new AI();

class ParamsExtractor {

    constructor(query) {
        this.query = query;
    }

    extractReqParams() {
        const q = this.query;
        const _id = q._id || '';
        const day = q.day || '';
        const state = q.state || '';
        const time = q.time || '';
        const airport = q.airport || '';
        const temp = q.temp || '';
        const humid = q.humid || '';
        const windSpeed = q.windSpeed || '';
        const windDir = q.windDir || '';
        const pressureStation = q.pressureStation || '';
        const pressureSea = q.pressureSea || '';

        const id = q.id || '';
        const firstName = q.firstName || '';
        const company = q.company || '';
        const email = q.email || '';
        const gender = q.gender || q.g || '';

        const filter = {};

        if (!helper.isTooEmpty(_id)) {
            if (_id.trim().length === 24) {
                filter[column._id] = new ObjectID(_id);
            } else {
                filter[column._id] = new ObjectID('000000000000000000000000');
            }
        }
        filter[column.State] = state;
        filter[column.Airport] = airport;
        filter[column.Day] = ai.getConditionalKey(day);
        filter[column.Time] = ai.getConditionalKey(time);
        filter[column.Temperature] = ai.getConditionalKey(temp);
        filter[column.Humidity] = ai.getConditionalKey(humid);
        filter[column.WindSpeed] = ai.getConditionalKey(windSpeed);
        filter[column.WindDirection] = ai.getConditionalKey(windDir);
        filter[column.StationPressure] = ai.getConditionalKey(pressureStation);
        filter[column.SeaLevelPressure] = ai.getConditionalKey(pressureSea);

        filter[column.Id] = parseInt(id, 10);
        filter[column.FirstName] = firstName;
        filter[column.Company] = company;
        filter[column.Email] = email;
        filter[column.Gender] = ai.getGender(gender);

        const crushedFilter = {};
        Object.keys(filter).forEach((key) => {
            if (filter[key]) {
                crushedFilter[key] = filter[key];
            }
        });

        crushedFilter.id = { $type: 'int' };
        return crushedFilter;
    }
}

export default ParamsExtractor;
