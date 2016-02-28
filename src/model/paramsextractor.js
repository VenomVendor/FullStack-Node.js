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
        const id = this.query.id || '';
        const day = this.query.day || '';
        const state = this.query.state || '';
        const time = this.query.time || '';
        const airport = this.query.airport || '';
        const temp = this.query.temp || '';
        const humid = this.query.humid || '';
        const windSpeed = this.query.windSpeed || '';
        const windDir = this.query.windDir || '';
        const pressureStation = this.query.pressureStation || '';
        const pressureSea = this.query.pressureSea || '';

        const filter = {};

        if (!helper.isTooEmpty(id)) {
            if (id.trim().length === 24) {
                filter[column._id] = new ObjectID(id);
            } else {
                filter[column._id] = new ObjectID('000000000000000000000000');
            }
        }
        if (state && !helper.isTooEmpty(state)) {
            filter[column.State] = state;
        }
        if (airport && !helper.isTooEmpty(airport)) {
            filter[column.Airport] = airport;
        }
        if (day) {
            filter[column.Day] = ai.getConditionalKey(day);
        }
        if (time && !helper.isTooEmpty(time)) {
            filter[column.Time] = ai.getConditionalKey(time);
        }
        if (temp && !helper.isTooEmpty(temp)) {
            filter[column.Temperature] = ai.getConditionalKey(temp);
        }
        if (humid && !helper.isTooEmpty(humid)) {
            filter[column.Humidity] = ai.getConditionalKey(humid);
        }
        if (windSpeed && !helper.isTooEmpty(windSpeed)) {
            filter[column.WindSpeed] = ai.getConditionalKey(windSpeed);
        }
        if (windDir && !helper.isTooEmpty(windDir)) {
            filter[column.WindDirection] = ai.getConditionalKey(windDir);
        }
        if (pressureStation && !helper.isTooEmpty(pressureStation)) {
            filter[column.StationPressure] = ai.getConditionalKey(pressureStation);
        }
        if (pressureSea && !helper.isTooEmpty(pressureSea)) {
            filter[column.SeaLevelPressure] = ai.getConditionalKey(pressureSea);
        }
        return filter;
    }
}

export default ParamsExtractor;
