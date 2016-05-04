const mongoConfig = {
    DB: 'fullstack',
    COLLECTION_WEATHER: 'weather',
    COLLECTION_USER: 'users',
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
        SeaLevelPressure: 'Sea Level Pressure',
        FirstName: 'first_name',
        Company: 'company',
        Id: 'id',
        Email: 'email',
        Gender: 'gender'
    }
};

const url = `mongodb://${mongoConfig.HOST}:${mongoConfig.PORT}/${mongoConfig.DB}`;
mongoConfig.URL = url;

const config = {
    MONGO: mongoConfig
};

export { config, mongoConfig };
