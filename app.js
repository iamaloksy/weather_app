const apiKey = "89908f589e9ea4318eb218fb8f328bc9";

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const locationButton = document.getElementById('location-button');

const url = (city) => `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
const locationUrl = (lat, lon) => `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

async function getWeatherByLocation(city) {
  try {
    const resp = await fetch(url(city), { mode: "cors" });
    if (!resp.ok) {
      throw new Error(`HTTP error! status: ${resp.status}`);
    }
    const respData = await resp.json();
    addWeatherToPage(respData);
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

async function getWeatherByCurrentLocation() {
  try {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      return;
    }

    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    const resp = await fetch(locationUrl(lat, lon), { mode: "cors" });
    if (!resp.ok) {
      throw new Error(`HTTP error! status: ${resp.status}`);
    }
    const respData = await resp.json();
    addWeatherToPage(respData);
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

function addWeatherToPage(data) {
  if (!data || !data.main || !data.weather) {
    console.error("Invalid API response:", data);
    return;
  }

  const temp = Ktoc(data.main.temp);

  const weather = document.createElement('div');
  weather.classList.add('weather');

  weather.innerHTML = `
    <h2><img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" /> ${temp}°C <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" /></h2>
    <small>${data.weather[0].main}</small>
  `;

  main.innerHTML = "";
  main.appendChild(weather);
}

function Ktoc(K) {
  return Math.floor(K - 273.15);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const city = search.value;

  if (city) {
    getWeatherByLocation(city);
  }
});

locationButton.addEventListener('click', () => {
  getWeatherByCurrentLocation();
});