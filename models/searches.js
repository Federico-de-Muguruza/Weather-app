const axios = require('axios');
const fs = require('fs');

class Searches {

    record = [];
    dbPath = './db/data.json';

    constructor() {
        this.readDB();
    }

    get getParamsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }

    get getParamsWeather() {
        return {
            appid: process.env.OPEN_WEATHER_KEY,
            units: 'metric',
            lang: 'es'
        }
    }

    async getCity(city = '') {

        try {
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${city}.json`,
                params: this.getParamsMapbox,
            });

            const resp = await instance.get();
            return resp.data.features.map(city => ({
                id: city.id,
                name: city.place_name,
                lng: city.center[0],
                lat: city.center[1]
            }))
        } catch (err) {
            return [];
        }
    }

    async cityWeather(lat, lon) {

        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                // Los params deben llamarse igual como lo establece la documentación (por eso el lng no andaba)
                params: {...this.getParamsWeather, lat, lon},
            });

            const resp = await instance.get();
            const {weather, main} = resp.data;

            return {
                description: weather[0].description,
                tempMax: main.temp_max,
                tempMin: main.temp_min,
                temp: main.temp
            }
        } catch (err) {
            throw err;
        }
    }

    addRecord(cityName = '') {
    
        // Evitar duplicados
        if (this.record.includes(cityName))
            return;
        this.record = this.record.splice(0, 4);
        this.record.unshift(cityName);
        this.saveDB();
    }

    saveDB() {

        const payload = {
            record: this.record
        };

        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    readDB() {
        this.createFolder();
        if (fs.existsSync(this.dbPath)) {
            const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'});
            const data = JSON.parse(info);
            this.record = data.record;
        }
    }

    createFolder() {
        const folder = './db';
    
        if ( ! fs.existsSync(folder)) 
            fs.mkdirSync(folder);  
    }
}

module.exports = Searches;