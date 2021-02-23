function formatHours(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes}`;
}

function formatDate(timestamp) {
  let date = new Date(timestamp);

  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  let weekDay = days[date.getDay()];
  let day = date.getDate();
  let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let month = months[date.getMonth()];
  
  let fullDate = `${weekDay} ${day}, ${month} ${formatHours(timestamp)}`;
  return (fullDate);
}

function displayWeather(response) {
  let city = response.data.name;
  let country = response.data.sys.country;
  celsiusTemp = response.data.main.temp;
  maxTemp = response.data.main.temp_max;
  minTemp = response.data.main.temp_min;
  feelsLikeTemp = response.data.main.feels_like;
  document.querySelector("#city").innerHTML = `${city}, ${country}`;
  document.querySelector("#description").innerHTML = response.data.weather[0].description;
  document.querySelector("#icon").setAttribute("src", `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
  document.querySelector("#icon").setAttribute("alt", response.data.weather[0].description);
  document.querySelector("#temp").innerHTML = Math.round(celsiusTemp);
  document.querySelector("#max").innerHTML = Math.round(maxTemp);
  document.querySelector("#min").innerHTML = Math.round(minTemp);
  document.querySelector("#feels-like").innerHTML = Math.round(feelsLikeTemp);
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(response.data.wind.speed * 3.6);
  document.querySelector("#visibility").innerHTML = response.data.visibility / 1000;
  document.querySelector("#sunrise").innerHTML = formatHours(response.data.sys.sunrise * 1000);
  document.querySelector("#sunset").innerHTML = formatHours(response.data.sys.sunset * 1000);   

  celsiusTemp = response.data.main.temp;
}

function displayForecast(response) {
  let forecastElement = document.querySelector("#hourly-forecast");
  forecastElement.innerHTML = null;
  let forecast = null;

  for (let index = 0; index < 6; index++) {
    forecast = response.data.list[index];
  
    forecastElement.innerHTML += `
      <div class="col-2">
        <ul>
          <li>
            ${formatHours(forecast.dt * 1000)}
          </li>
          <li>
            <img
              src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png"
              alt="${forecast.weather[0].description}"
            />
          </li>
          <li>
            ${Math.round(forecast.main.temp)}°C
          </li>
          <li>
            ${forecast.weather[0].main}
          </li>
        </ul>
      </div>
    `;
  } 
}

function getCity(city) {
  let units = "metric";
  let apiKey = "6f57e84bdcf65c7e46537056925d0c97";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
  let apiUrl = `${apiEndpoint}?q=${city}&appid=${apiKey}&units=${units}`;
  
  axios.get(apiUrl).then(displayWeather);

  let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(forecastUrl).then(displayForecast);
}

function searchCity(event) {
  event.preventDefault();
  let searchedCity = document.querySelector("#search-input").value;
  getCity(searchedCity);
}

function getPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let units = "metric";
  let apiKey = "6f57e84bdcf65c7e46537056925d0c97";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
  let apiUrl = `${apiEndpoint}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(displayWeather);
}

function getLocation(event) {
  navigator.geolocation.getCurrentPosition(getPosition);
}

function displayFahrenheit(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  document.querySelector("#temp").innerHTML = Math.round((celsiusTemp * 1.8) + 32);
  document.querySelector("#max").innerHTML = Math.round((maxTemp * 1.8) + 32);
  document.querySelector("#min").innerHTML = Math.round((minTemp * 1.8) + 32);
  document.querySelector("#feels-like").innerHTML = Math.round((feelsLikeTemp * 1.8) + 32);
}

function displayCelsius(event) {
  event.preventDefault();
  fahrenheitLink.classList.remove("active");
  celsiusLink.classList.add("active");
  document.querySelector("#temp").innerHTML = Math.round(celsiusTemp);
  document.querySelector("#max").innerHTML = Math.round(maxTemp);
  document.querySelector("#min").innerHTML = Math.round(minTemp);
  document.querySelector("#feels-like").innerHTML = Math.round(feelsLikeTemp);
}

let celsiusTemp = null;
let maxTemp = null;
let minTemp = null;
let feelsLikeTemp = null;

let now = new Date();
document.querySelector("#date").innerHTML = formatDate(now);
document.querySelector("#search-form").addEventListener("submit", searchCity);
document.querySelector("#current-location").addEventListener("click", getLocation);
let fahrenheitLink = document.querySelector("#fahrenheit");
fahrenheitLink.addEventListener("click", displayFahrenheit);
let celsiusLink = document.querySelector("#celsius");
celsiusLink.addEventListener("click", displayCelsius);

getCity(`Lisbon`);