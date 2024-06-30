const api = 'fba5236364726aabb12cb5b02271a52a';  //our api

function getLocationFromHome() {
    const urlParams = new URLSearchParams(window.location.search);
    const locationInput = urlParams.get('q');
    if (locationInput) {
        searchF(locationInput); //passing the user input into the functiom
    } 
}

function getLocationFromHome2() {
    const urlParams = new URLSearchParams(window.location.search);
    const locationInput = urlParams.get('q');
    if (locationInput) {
        searchC(locationInput); //passing the user input into the functiom
    } 
}

let labels = [];  //initializing an emppty array
let data1 = []; 
let chart;//chart variable initialized so as to check values

const data = {   //chart info
    labels: labels,  //from forecasty too
    datasets: [{
        label: 'chart details',
        data: data1,  //from forecast
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
    }]
};
 
const config = {
    type: 'line',
    data: data,
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: 'Time'
                }
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: 'Temperature'
                },
                //min: 0 initial starting point
            }
        }
    }
};
function searchF(locationInput) {

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${locationInput}&appid=${api}&units=imperial`)  //imperial for fahrenheit
        .then(response => response.json())
        .then(data => {

            if (data.cod === "404") {    //wrong city entered
                window.location.href = 'error.html';  //get a diiferent html page
                

            } else {
                console.log(data);

                const tempCelsius = (data.main.temp).toFixed(0);
                const weatherIcon = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
                document.getElementById("day1min").innerHTML = tempCelsius + "°F";
                document.getElementById("daydesc").innerHTML =  data.weather[0].description;
                document.getElementById("location").innerHTML = data.name;
                document.getElementById("feelslike").innerHTML =  (data.main.feels_like ).toFixed(0) + "°F";
                document.getElementById("windspeed").innerHTML =  data.wind.speed.toFixed(1) + " km/hr";

                //Calling forecastInfo to show next days weather and today info
                forecastInfo(locationInput, data);   //data only used to get weather info for today part, rest of the method uses forecast
                        const sunrise = data.sys.sunrise;  //sys object containing epoch value of sunrise from the api
                        const sunset = data.sys.sunset;
            
                        const sunriseT = new Date(sunrise * 1000);     ///changing epoch value from seconds to milliseconds, since JS uses this
                        const sunsetT = new Date(sunset * 1000);
                        const currentT = new Date();
            
                        document.getElementById('icon').src = animationF(data.weather[0].description,currentT, sunriseT, sunsetT);  //calling the annimation to get our icon 

            function animationF(description,currentT, sunriseT, sunsetT) {  //animation method takes in those parameters
                if (currentT >= sunriseT && currentT <= sunsetT) {     ///since we have our own weather icons we have to check for time of day
                switch(description){      //during the daY
                    case 'scattered clouds' :
                    case 'few clouds'  :
                    case 'mist' :
                    case 'overcast clouds' :
                    case 'broken clouds' :
                        return 'images/cloudy.gif';
                    case 'rain':
                    case 'drizzle':
                    case 'light rain':
                    case 'shower rain':
                    case 'thunderstorm with rain':
                    case 'moderate rain':
                    case 'heavy intensity rain':
                        return 'images/rainny.gif';
                    case 'clear sky':
                        return 'images/sun.gif';
                    default:
                        return 'images/sun.gif';
                }
            }
                else {
                    
                    switch(description){      //during the NIGHT
                        case 'scattered clouds' :
                        case 'few clouds'  :
                        case 'mist' :
                        case 'overcast clouds' :
                        case 'broken clouds' :
                            return 'images/mooncloud.gif';
                        case 'rain':
                        case 'drizzle':
                        case 'light rain':
                        case 'shower rain':
                        case 'thunderstorm with rain':
                        case 'moderate rain':
                        case 'heavy intensity rain':
                            return 'images/rainny.gif';
                        case 'clear sky':
                            return 'images/moon.gif';
                        default:
                            return 'images/moon.gif';
                    }
                }
            
            }
                
            }})
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
    function error(error_message) {
        console.error('Error fetching location', error_message);
    }

}

async function fetchWeatherForecast(locationInput) {    //to get the weather forecadt info, manually  passed the api otherwise could have been passed in the method call up
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${locationInput}&appid=${api}&units=imperial`);
    const data = await response.json();
    return data.list.map(item => ({    //data.list is forecast for different time, passing only the required details to the array called item
        date: new Date(item.dt * 1000),  ///changing epoch value from seconds to milliseconds, since JS uses this
        temp: item.main.temp,
        icon: item.weather[0].icon,
        description: item.weather[0].description
    }));
}

function formatDate(dateTime) {    //empyt array signifies the local area where the device is
    const time1 = new Date();
    const date = time1.toLocaleDateString();
    document.getElementById('datetime').innerText = `${date} `; //showing the date

    return dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
}

function displayCurrentDayForecast(forecastWeather) {
    const currentDayContainer = document.getElementById('hourly-forecast');  //taking from html
    currentDayContainer.innerHTML = ''; //clearing existing content
    labels.length = 0;  
    data1.length = 0;  //setting arrays to empty

    for (let i = 0; i < forecastWeather.length && i < 8; i++) { 
        const weather = forecastWeather[i];
        const time = formatDate(weather.date);
        labels.push(time); //adding time elements into the labels array, our y axis
        data1.push(weather.temp);  //adding the temp values

        currentDayContainer.innerHTML += `
                <div class="weather-row">
                    <p>${time}</p>
                    <img src="http://openweathermap.org/img/wn/${weather.icon}.png" alt="hourly forcast">
                    <h6>${(weather.temp).toFixed(1)}°F</h6>
                </div>
            `;
    }
    if (chart) {
        chart.destroy();  //check if there is an existing chart and destroy it if so
    }

    const ctx = document.getElementById('todayChart').getContext('2d');   //displaying chart
    chart = new Chart(ctx, config);
}

function display5DayForecast(forecastWeather) {
    const fiveDayContainer = document.getElementById('weatherfocus-column');
    fiveDayContainer.innerHTML = ''; //removing existing 
    const dailyForecast = {};       //daily forecast empty object where properties can be added
    forecastWeather.forEach(weather => {     //each element in forecast weather array
        const date = weather.date.toLocaleDateString('en-US');        //weather is current element getting date  format in 12/25/1999
        if (!dailyForecast[date]) {
            dailyForecast[date] = {    //checking if date i passed passed or not
                temps: [],  //stores temp info for the date
                icon: weather.icon,
                description: weather.description,
            };
        }
        dailyForecast[date].temps.push(weather.temp);      //adding all to the array tempts
    });

    const currentDate = new Date().toLocaleDateString('en-US');    //getting the current date of my location

    for (const [date, info] of Object.entries(dailyForecast)) {  //an array of key and value pairs fro daily alue object  ate key value info
        const dayName = (date === currentDate) ? 'Today' : new Date(date).toLocaleDateString('en-US', { weekday: 'long' });  //checking date if not today give  a weekday name
        const highTemp = Math.max(...info.temps);  //finds the highest and the lowest from the values
        const lowTemp = Math.min(...info.temps);    ///...spread syntax allows to iterate since Math function does not take in arrays


        fiveDayContainer.innerHTML += `
                <div class="weather-row">
                    <div class="weather-day">${dayName}</div>
                    <div class="weather-icon"><img src="http://openweathermap.org/img/wn/${info.icon}.png" alt=" "></div>
                    <div class="weather-desc">${info.description}</div>
                    <div class="weather-temp"><p><b class="words">${highTemp.toFixed(1)}</b>/${lowTemp.toFixed(1)}</p></div>
                </div>
                
            `;
    }
}

async function forecastInfo(locationInput) {   //will be passed later
    const forecastWeather = await fetchWeatherForecast(locationInput);

    displayCurrentDayForecast(forecastWeather);
    display5DayForecast(forecastWeather);
}





function searchC(locationInput) {

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${locationInput}&appid=${api}&units=metric`)  //imperial for fahrenheit
        .then(response => response.json())
        .then(data => {

            if (data.cod === "404") {    //wrong city entered
                window.location.href = 'error.html';  //get a diiferent html page

            } else {
                console.log(data);

                const tempCelsius = (data.main.temp).toFixed(0);
                document.getElementById("day1min").innerHTML =  tempCelsius + "°C";
                document.getElementById("daydesc").innerHTML =  data.weather[0].description;
                document.getElementById("location").innerHTML = data.name;
                document.getElementById('icon').src = animationC(data.weather[0].description);  //calling the annimation to get our icon
                document.getElementById("feelslike").innerHTML =  (data.main.feels_like ).toFixed(0) + "°C";
                document.getElementById("windspeed").innerHTML =  data.wind.speed.toFixed(1) + " km/hr";

                //Calling forecastInfo to show next days weather and today info
                forecastInfoC(locationInput, data);   //data only used to get weather info for today part, rest of the method uses forecast
                const sunrise = data.sys.sunrise;  //sys object containing epoch value of sunrise from the api
                        const sunset = data.sys.sunset;
            
                        const sunriseT = new Date(sunrise * 1000);     ///changing epoch value from seconds to milliseconds, since JS uses this
                        const sunsetT = new Date(sunset * 1000);
                        const currentT = new Date();
            
                        document.getElementById('icon').src = animationC(data.weather[0].description,currentT, sunriseT, sunsetT);  //calling the annimation to get our icon 

            function animationC(description,currentT, sunriseT, sunsetT) {  //animation method takes in those parameters
                if (currentT >= sunriseT && currentT <= sunsetT) {     ///since we have our own weather icons we have to check for time of day
                switch(description){      //during the dY
                    case 'scattered clouds' :
                    case 'few clouds'  :
                    case 'overcast clouds' :
                    case 'mist' :
                    case 'broken clouds' :
                        return 'images/cloudy.gif';
                    case 'rain':
                    case 'drizzle':
                    case 'light rain':
                    case 'shower rain':
                    case 'thunderstorm with rain':
                    case 'moderate rain':
                    case 'heavy intensity rain':
                        return 'images/rainny.gif';
                    case 'clear sky':
                        return 'images/sun.gif';
                    default:
                        return 'images/sun.gif';
                }
            }
                else {
                    
                    switch(description){      //during the NIGHT
                        case 'scattered clouds' :
                        case 'few clouds'  :
                        case 'overcast clouds' :
                        case 'mist' :
                        case 'broken clouds' :
                            return 'images/mooncloud.gif';
                        case 'rain':
                        case 'drizzle':
                        case 'light rain':
                        case 'thunderstorm with rain':
                        case 'moderate rain':
                        case 'shower rain':
                        case 'heavy intensity rain':
                            return 'images/rainny.gif';
                        case 'clear sky':
                            return 'images/moon.gif';
                        default:
                            return 'images/moon.gif';
                    }
                }
            
            }
                
            }})
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
    function error(error_message) {
        console.error('Error fetching location', error_message);
    }

}

async function fetchWeatherForecastC(locationInput) {    //to get the weather forecadt info, manually  passed the api otherwise could have been passed in the method call up
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${locationInput}&appid=${api}&units=metric`);
    const data = await response.json();
    return data.list.map(item => ({    //data.list is forecast for different time, passing only the required details to the array called item
        date: new Date(item.dt * 1000),  ///changing epoch value from seconds to milliseconds, since JS uses this
        temp: item.main.temp,
        icon: item.weather[0].icon,
        description: item.weather[0].description
    }));
}

function formatDateC(dateTime) {    //empyt array signifies the local area where the device is
    const now = new Date();
    const date = now.toLocaleDateString();
    document.getElementById('datetime').innerText = `${date} `;

    return dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
}

function displayCurrentDayForecastC(forecastWeather) {
    const currentDayContainer = document.getElementById('hourly-forecast');
    currentDayContainer.innerHTML = ''; //clearing existing content
    labels.length = 0;  
    data1.length = 0;

    for (let i = 0; i < forecastWeather.length && i < 8; i++) { 
        const weather = forecastWeather[i];
        const time = formatDateC(weather.date);
        labels.push(time); //adding time elements into the labels array, our y axis
        data1.push(weather.temp);  //adding the temp values

        currentDayContainer.innerHTML += `
                <div class="weather-row">
                    <div class="weather-time">${time}</div>
                    <div class="weather-icon"><img src="http://openweathermap.org/img/wn/${weather.icon}.png" alt=" "></div>
                      <div class="weather-temp">${(weather.temp).toFixed(1)}°C</div>
                </div>
            `;
    }
    if (chart) {
        chart.destroy();  //check if there is an existing chart and destroy it if so
    }

    const ctx = document.getElementById('todayChart').getContext('2d');   //displaying chart
    chart = new Chart(ctx, config);
}

function display5DayForecastC(forecastWeather) {
    const fiveDayContainer = document.getElementById('weatherfocus-column');
    fiveDayContainer.innerHTML = ''; //removing existing 
    const dailyForecast = {};
    forecastWeather.forEach(weather => {
        const date = weather.date.toLocaleDateString('en-US');
        if (!dailyForecast[date]) {
            dailyForecast[date] = {
                temps: [],
                icon: weather.icon,
                description: weather.description,
            };
        }
        dailyForecast[date].temps.push(weather.temp);
    });

    const currentDate = new Date().toLocaleDateString('en-US');

    for (const [date, info] of Object.entries(dailyForecast)) {
        const dayName = (date === currentDate) ? 'Today' : new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
        const highTemp = Math.max(...info.temps);
        const lowTemp = Math.min(...info.temps);


        fiveDayContainer.innerHTML += `
               <div class="weather-row">
                    <div class="weather-day">${dayName}</div>
                    <div class="weather-icon"><img src="http://openweathermap.org/img/wn/${info.icon}.png" alt=" "></div>
                    <div class="weather-desc">${info.description}</div>
                    <div class="weather-temp"><p><b class="words">${highTemp.toFixed(1)}</b>/${lowTemp.toFixed(1)}</p></div>
                </div>
                
            `;
    }
}

async function forecastInfoC(locationInput) {   //will be passed later
    const forecastWeather = await fetchWeatherForecastC(locationInput);

    displayCurrentDayForecastC(forecastWeather);
    display5DayForecastC(forecastWeather);
}