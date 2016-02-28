const mongoConfig = {
    DB: 'weather',
    COLLECTION: 'data',
    HOST: '127.0.0.1',
    PORT: '27017',
    KEYS: {
        _id: '_id',
        Day: 'Day',
        Time: 'Time',
        State: 'State',
        Airport: 'Airport',
        Temperature: 'Temperature',
        Humidity: 'Humidity',
        WindSpeed: 'Wind Speed',
        WindDirection: 'Wind Direction',
        StationPressure: 'Station Pressure',
        SeaLevelPressure: 'Sea Level Pressure'
    }
};

const url = `mongodb://${mongoConfig.HOST}:${mongoConfig.PORT}/${mongoConfig.DB}`;
mongoConfig.URL = url;

const config = {
    MONGO: mongoConfig
};

export { config, mongoConfig };
