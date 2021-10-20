const timeE1 = document.getElementById("time");
const dateE1 = document.getElementById("date");
const currentWeatherItemsE1 = document.getElementById("current-weather-items");
const weatherForecastE1 = document.getElementById("weather-forcast");
const currentTempE1 = document.getElementById("current-temp");
const daysByNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wensday",
  "Thursday",
  "Friday",
  "Saturday",
];
const monthByNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const timezone = document.getElementById("time-zone");
const countryEl = document.getElementById("country");
const searchbox = document.querySelector(".search-box");
searchbox.addEventListener("keypress", setQuery);

setInterval(() => {
  const timeObj = new Date();
  const month = timeObj.getMonth();
  const date = timeObj.getDate();
  const day = timeObj.getDay();
  const hours = timeObj.getHours();
  const hoursIn12Hr = hours >= 13 ? hours % 12 : hours;
  const minutes = timeObj.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  // set the times and the date in html
  timeE1.innerHTML =
    (hoursIn12Hr < 10 ? "0" + hoursIn12Hr : hoursIn12Hr) +
    ":" +
    (minutes < 10 ? "0" + minutes : minutes) +
    " " +
    `<span id="am-pm">${ampm}</span>`;

  dateE1.innerHTML = daysByNames[day] + ", " + date + " " + monthByNames[month];
}, 1000);
//---------------
getWeatherDate();
//---------------
// query to search by city
function setQuery(evt) {
  // 13 key code ==> enter press
  if (evt.keyCode == 13) {
    getDataByCity(searchbox.value);
  }
}
//---------------
//query = name of city
function getDataByCity(query) {
const APIkey = "0cee5946006019279360e98e11e78eef";

  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${query}&units=metric&APPID=0cee5946006019279360e98e11e78eef`
  )
    .then((response) => response.json())
    .then((weather) => {
      console.log(weather);
      displayDataByCity(weather);
    });
}

//--------------
//get weather data for my location
function getWeatherDate() {
  const APIkey = "0cee5946006019279360e98e11e78eef";

  navigator.geolocation.getCurrentPosition((success) => {
    let { latitude, longitude } = success.coords;

    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely&units=metric&appid=${APIkey}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        showWeatherData(data);
      });
  });
}
//---------------
//show weather data for my location
function showWeatherData(data) {
  let { humidity, pressure, sunrise, sunset, wind_speed } = data.current;

  timezone.innerHTML = data.timezone;
  countryEl.innerHTML = data.lat + "N " + data.lon + "E";

  currentWeatherItemsE1.innerHTML = `<div class="weather-item">
    <div class="space">Humidity</div>
    <div>${humidity} %</div>
    </div>

<div class="weather-item">
    <div class="space">Pressure</div>
    <div>${pressure} hPa</div>
</div>

<div class="weather-item">
    <div class="space">wind Speed   </div>
    <div>${wind_speed} km/h</div>
</div>

<div class="weather-item">
    <div class="space">Sunrise</div>
    <div>${window.moment(sunrise * 1000).format("HH:mm a")}</div>
</div>

<div class="weather-item">
    <div class="space">Sunset</div>
    <div>${window.moment(sunset * 1000).format("HH:mm a")}</div>
</div>
`;
  let otherDayForcast = ``;

  data.hourly.forEach((hour, indx) => {
    if (indx == 0) {
      currentTempE1.innerHTML = `
<img src="https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png"
  alt="weather icon" class="w-icon">
  <div class="other">
    <div class="day">${window.moment(data.current.dt * 1000).format("dddd")}</div>
     <div class="temp">Max: ${parseInt(data.daily[0].temp.max)} C&#176;</div>
     <div class="temp">Min: ${parseInt(data.daily[0].temp.min)} C&#176;</div>
     </div>`;
    } else if (indx >= 8) {
      return;
    } else {
      otherDayForcast += `
               <div class="weather-forcast-item">
                        <div class="day">${converttTime(hour.dt)}</div>
                        <img src="https://openweathermap.org/img/wn/${
                          hour.weather[0].icon
                        }@2x.png"
                            alt="weather icon" class="w-icon">
                        <div class="temp">  ${parseInt(hour.temp)} C&#176;</div>
                       
                        </div> `;
      weatherForecastE1.innerHTML = otherDayForcast;
    }
  });
}

//---------------
//display weather data by city name
function displayDataByCity(weatherdata) {
  let { humidity, pressure } = weatherdata.list[0].main;
  let { sunrise, sunset } = weatherdata.city;
  let wind = weatherdata.list[0].wind.speed;
  timezone.innerHTML = weatherdata.city.country + "/ " + weatherdata.city.name;
  countryEl.innerHTML =
    weatherdata.city.coord.lat + "N " + weatherdata.city.coord.lon + "E";

  currentWeatherItemsE1.innerHTML = `<div class="weather-item">
    <div>Humidity</div>
    <div class="space">${humidity} %</div>
    </div>

<div class="weather-item">
    <div class="space">Pressure</div>
    <div>${pressure} hPa</div>
</div>

<div class="weather-item">
    <div class="space">wind Speed  </div>
    <div>${wind} km/h</div>
</div>

<div class="weather-item">
    <div class="space">Sunrise</div>
    <div>${window.moment(sunrise * 1000).format("HH:mm a")}</div>
</div>

<div class="weather-item">
    <div class="space">Sunset</div>
    <div>${window.moment(sunset * 1000).format("HH:mm a")}</div>
</div>
`;

  let otherDayForcast = ``;

  weatherdata.list.forEach((day, indx) => {
    if (indx == 0) {
      currentTempE1.innerHTML = `
<img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"
  alt="weather icon" class="w-icon">
  <div class="other">
    <div class="day">${window.moment(day.dt * 1000).format("ddd")}</div>
     <div class="temp">Max: ${parseInt(day.main.temp_max)} C&#176;</div>
      <div class="temp">Min:  ${parseInt(day.main.temp_min)} C&#176;</div>
       </div>
`;
    } else if (indx >= 8) {
      return;
    } else {
      otherDayForcast += `
               <div class="weather-forcast-item">
                        <div class="day">${converttTime(day.dt)}</div>
                        <img src="https://openweathermap.org/img/wn/${
                          day.weather[0].icon
                        }@2x.png"
                            alt="weather icon" class="w-icon">
                        <div class="temp">Max:  ${parseInt(day.main.temp_max)} C&#176;</div>
                        <div class="temp">Min:  ${parseInt(day.main.temp_min)} C&#176;</div>
                        </div> `;
      weatherForecastE1.innerHTML = otherDayForcast;
    }
  });
}
//--------------------
//convert miliscond to hour and mint
function converttTime(dt) {
    let h = (dt % 86400) / 3600;
    let m = (dt % 3600) / 60;
  
    return (
      (h < 10 ? "0" + h : h) +
      ":" +
      (m < 10 ? "0" + m : m) +
      " " +
      (h >= 12 ? "PM" : "AM")
    );
  }

  //---------------
  //convert from C => F
function convertC_to_F() {
  const APIkey = "0cee5946006019279360e98e11e78eef";
  navigator.geolocation.getCurrentPosition((success) => {
    let { latitude, longitude } = success.coords;

    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely&appid=${APIkey}`
    )
      .then((response) => response.json())
      .then((data) => {
        let { humidity, pressure, sunrise, sunset, wind_speed } = data.current;

        timezone.innerHTML = data.timezone;
        countryEl.innerHTML = data.lat + "N " + data.lon + "E";

        currentWeatherItemsE1.innerHTML = `<div class="weather-item">
    <div>Humidity</div>
    <div>${humidity} %</div>
    </div>

<div class="weather-item">
    <div>Pressure</div>
    <div>${pressure} hPa</div>
</div>

<div class="weather-item">
    <div>wind Speed</div>
    <div>${wind_speed} km/h</div>
</div>

<div class="weather-item">
    <div>Sunrise</div>
    <div>${window.moment(sunrise * 1000).format("HH:mm a")}</div>
</div>

<div class="weather-item">
    <div>Sunset</div>
    <div>${window.moment(sunset * 1000).format("HH:mm a")}</div>
</div>
`;
        let otherDayForcast = ``;

        data.hourly.forEach((hour, indx) => {
          if (indx == 0) {
            currentTempE1.innerHTML = `
        <img src="http://openweathermap.org/img/wn/${
          hour.weather[0].icon
        }@2x.png"
          alt="weather icon" class="w-icon">
          <div class="other">
            <div class="day">${window.moment(data.current.dt * 1000).format("dddd")}</div>
             <div class="temp">Max: ${parseInt(data.daily[0].temp.max)} F&#176;</div>
             <div class="temp">Min: ${parseInt(data.daily[0].temp.min)} F&#176;</div>
        </div>
        `;
          } else if (indx >= 8) {
            return;
          } else {
            otherDayForcast += `
                       <div class="weather-forcast-item">
                                <div class="day">${converttTime(hour.dt)}</div>
                                <img src="http://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png"
                                    alt="weather icon" class="w-icon">
                                <div class="temp">  ${parseInt(hour.temp)} F&#176;</div>
                                </div> `;
            weatherForecastE1.innerHTML = otherDayForcast;
          }
        });
      });
  });
}
