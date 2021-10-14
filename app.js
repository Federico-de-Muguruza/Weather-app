const { inquirerMenu, pause, readLine, listCities } = require("./helpers/inquirer");
const Searches = require('./models/searches'); 
require('dotenv').config()

const main = async () => {

    let opt;

    const searches = new Searches();

    do {
        opt = await inquirerMenu();

        switch(opt) {
            case 1:
                await searchCity(searches);
            break;
                
            case 2:
                searches.record.forEach((name, i) => {
                    i++;
                    console.log(`${i} ${name}`);
                })
            break;
        }

        await pause();
    } while (opt != 0)

}

const searchCity = async(searches) => {
    // Elige ciudad
    const city = await readLine('Seleccione una ciudad:');
    // Devuelve una lista de los resultados con esa ciudad
    const cities = await searches.getCity(city);
    // Devuelve el id de la ciudad elegida
    const id = await listCities(cities);

    if (id != 0) {
        // Devuelve la ciudad elegida
        const selectedCity = cities.find(city => city.id === id);

        searches.addRecord(selectedCity.name);
    
        const weather = await searches.cityWeather(selectedCity.lat, selectedCity.lng);
        
        printDataCity(selectedCity, weather);
    }
}

const printDataCity = (selectedCity, weather) => {
    console.clear();
    console.log(`Ciudad: ${selectedCity.name}`);
    console.log(`Longitud: ${selectedCity.lng}`);
    console.log(`Latitud: ${selectedCity.lat}`);
    console.log(`Temperatura ahora: ${weather.temp}`);
    console.log(`Temperatura mínima: ${weather.tempMin}`);
    console.log(`Temperatura máxima: ${weather.tempMax}`);
    console.log(`Clima ahora: ${weather.description}`);
}

main();