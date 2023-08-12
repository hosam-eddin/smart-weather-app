const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const currentWeatherItemsEl = document.getElementById("current-weather-items");
const timezone = document.getElementById("time-zone");
const countryEl = document.getElementById("country");
const weatherForecastEl = document.getElementById("weather-forecast");
const currentTempEl = document.getElementById("current-temp");
// const searchInput = document.getElementById("search");

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
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

setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  const hour = time.getHours();
  const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
  const minutes = time.getMinutes();
  const ampm = hour >= 12 ? "PM" : "AM";

  timeEl.innerHTML =
    (hoursIn12HrFormat < 10 ? "0" + hoursIn12HrFormat : hoursIn12HrFormat) +
    ":" +
    (minutes < 10 ? "0" + minutes : minutes) +
    " " +
    `<span id="am-pm">${ampm}</span>`;

  dateEl.innerHTML = days[day] + ", " + date + " " + months[month];
}, 1000);




function getWeatherData() {
  navigator.geolocation.getCurrentPosition((success) => {
    let { lat, lon } = success.coords;

    fetch(
      `http://api.weatherapi.com/v1/forecast.json?lat=${lat}&lon=${lon}&key=a8244b92d399478aac5213819231108&q=cairo&days=7`
    )
      .then((res) => res.json())
      .then((data) => {
        showWeatherData(data);
      });
  });
}

document.getElementById("search").addEventListener("keyup", (e) => {
  getWeatherData(e.target.value);
});

function showWeatherData(data) {
  let { humidity, pressure_in, wind_kph } = data.current;

  timezone.innerHTML = data.location.tz_id;
  countryEl.innerHTML = data.location.lat + "N " + data.location.lon + "E";

  currentWeatherItemsEl.innerHTML = `
  <div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${pressure_in} </div>
    </div>
    <div class="weather-item">
        <div>Wind Speed</div>
        <div>${wind_kph} kph</div>
    </div>
    `;

  let otherDayForcast = "";
  data.daily.forEach((day, is_day) => {
    if (is_day == 0) {
      currentTempEl.innerHTML = `
            <img
            src="${current.condition.icon}"
            alt="weather icon"
            class="w-icon"
            />
            <div class="other">
                <div class="day">${is_day}</div>
                <div class="temp ">Night - ${day.temp.night}&#176;C</div>
                <div class="temp">Day - ${day.temp.day}&#176;C</div>
            </div>
            
            `;
    } else {
      otherDayForcast += `
            <div class="weather-forecast-item">
                <div class="day"> </div>
                  <img
                  src="${current.condition.icon}"
                  alt="weather icon"
                  class="w-icon"
                  />
                <div class="temp fw-bold">Night - ${day.temp.night}&#176;C</div>
                <div class="temp fw-bold">Day - ${day.temp.day}&#176;C</div>
            </div>
            `;
    }
  });

  weatherForecastEl.innerHTML = otherDayForcast;
}


getWeatherData("cairo");