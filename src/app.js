function formatDate(date) {
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  let weekDay = days[date.getDay()];
  let day = date.getDate();
  let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let month = months[date.getMonth()];
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let fullDate = `${weekDay} ${day}, ${month} ${hours}:${minutes}`;
  return (fullDate);
}

function displayWeather(response) {
  console.log(response);
  let city = response.data.name;
  let country = response.data.sys.country;
  document.querySelector("#city").innerHTML = `${city}, ${country}`;
  document.querySelector("#description").innerHTML = response.data.weather[0].description;
  document.querySelector("#icon").setAttribute("src", `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
  document.querySelector("#icon").setAttribute("alt", response.data.weather[0].description);
  document.querySelector("#temp").innerHTML = Math.round(response.data.main.temp);
}

function getCity(city) {
  let units = "metric";
  let apiKey = "6f57e84bdcf65c7e46537056925d0c97";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
  let apiUrl = `${apiEndpoint}?q=${city}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(displayWeather);
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

let now = new Date();
document.querySelector("#date").innerHTML = formatDate(now);

getCity(`Lisbon`);

document.querySelector("#current-location").addEventListener("click", getLocation);