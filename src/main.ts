import './style.css'
import axios from 'axios';

const forecastsPerPage = 10;
let currentPage = 1;
let forecastsData: WeatherData[] = [];

function openModal() {
  const modal = document.getElementById('forecast-modal') as HTMLDivElement;
  modal.classList.add('is-active');
}

function closeModal() {
  const modal = document.getElementById('forecast-modal') as HTMLDivElement;
  
  modal.classList.remove('is-active');
}

async function searchForecast() {
  closeModal();
  const cityInput = document.getElementById('city-input') as HTMLInputElement;
  const zipInput = document.getElementById('zip-input') as HTMLInputElement;
  const latInput = document.getElementById('lat-input') as HTMLInputElement;
  const lonInput = document.getElementById('lon-input') as HTMLInputElement;

  const city = encodeURIComponent(cityInput.value.trim());
  const zip = encodeURIComponent(zipInput.value.trim());
  const lat = encodeURIComponent(latInput.value.trim());
  const lon = encodeURIComponent(lonInput.value.trim());

  const apiKey = '59ab558ba6686862be44b321255997d8'; // Replace with your actual API key
  let url = '';

  if (lat && lon) {
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  } else if (zip) {
    url = `https://api.openweathermap.org/data/2.5/weather?zip=${zip}&appid=${apiKey}&units=metric`;
  } else if (city) {
    url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  } else {
    console.error('Please enter either city name, ZIP code, or coordinates.');
    return;
  }

  try {
    const response = await axios.get(url);
    const data = response.data;
    
    saveForecast(data);
    closeModal();
    displayForecasts();
  } catch (error) {
    console.error('Error fetching the weather data:', error);
  }
}

interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
    pressure: number ;
  };
  wind:{
    speed: number;
  };
  sys:{
    sunrise: number;
    sunset: number;
  }
  weather: {
    description: string;
  }[];
}

function formatUnixTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000); // Convert to milliseconds
  const hours = date.getHours();
  const minutes = "0" + date.getMinutes(); // Add leading zero if necessary
  const formattedTime = hours + ':' + minutes.substr(-2);
  return formattedTime;
}



function displayForecasts() {
  const forecastContainer = document.getElementById('forecast-container');

  if (!forecastContainer) {
    console.error('Forecasts container not found in the DOM.');
    return;
  }

  // Clear existing forecasts
  forecastContainer.innerHTML = '';

  // Display forecasts for the current page
  const startIndex = (currentPage - 1) * forecastsPerPage;
  const endIndex = startIndex + forecastsPerPage;
  const currentForecasts = forecastsData.slice(startIndex, endIndex);

  currentForecasts.forEach(data => {
    const forecastDiv = document.createElement('div');
    forecastDiv.classList.add('box');

    const title = document.createElement('h2');
    title.classList.add('title');
    title.textContent = data.name;

    const tempParagraph = document.createElement('p');
    tempParagraph.textContent = `Temperature: ${data.main.temp} °C`;

    const humidityParagraph = document.createElement('p');
    humidityParagraph.textContent = `Humidity: ${data.main.humidity}`;

    const windSpeedParagraph = document.createElement('p');
    windSpeedParagraph.textContent = `Wind speed: ${data.wind.speed}`;

    const pressureParagraph = document.createElement('p');
    pressureParagraph.textContent = `Pressure: ${data.main.pressure}`;

    const sunriseSunsetParagraph = document.createElement('p');
    sunriseSunsetParagraph.textContent = `Time of sunrise: ${formatUnixTimestamp(data.sys.sunrise)}; Time of sunset: ${formatUnixTimestamp(data.sys.sunset)}`;

    const weatherDescriptionParagraph = document.createElement('p');
    weatherDescriptionParagraph.textContent = `Weather: ${data.weather[0].description}`;

    const removeButton = document.createElement('button');
    removeButton.classList.add('button', 'is-danger');
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => removeForecast(data));

    forecastDiv.appendChild(title);
    forecastDiv.appendChild(tempParagraph);
    forecastDiv.appendChild(humidityParagraph);
    forecastDiv.appendChild(windSpeedParagraph);
    forecastDiv.appendChild(pressureParagraph);
    forecastDiv.appendChild(sunriseSunsetParagraph);
    forecastDiv.appendChild(weatherDescriptionParagraph);
    forecastDiv.appendChild(removeButton);

    forecastContainer.appendChild(forecastDiv);
  });
}

function nextPage(){
  const totalPages = Math.ceil(forecastsData.length / forecastsPerPage);
  
  if (currentPage < totalPages) {
    currentPage++;
    displayForecasts();
  } else {
    console.log('No more forecasts to display.');
  }
}

function prevPage(){
  if (currentPage != 1)
  {
    currentPage--;
    displayForecasts();
  }
}

function removeForecast(forecastData: WeatherData) {
  forecastsData = forecastsData.filter(data => data.name !== forecastData.name);
  saveForecastsToLocalStorage();
  displayForecasts();
}

function saveForecastsToLocalStorage() {
  localStorage.setItem('forecasts', JSON.stringify(forecastsData));
}

function saveForecast(data: WeatherData) {
  const existingIndex = forecastsData.findIndex(forecast => forecast.name === data.name);
  if (existingIndex !== -1) {
    forecastsData[existingIndex] = data;
  } else {
    forecastsData.push(data);
  }
  localStorage.setItem('forecasts', JSON.stringify(forecastsData));
  displayForecasts();
}

function loadSavedForecasts() {
  let forecasts = JSON.parse(localStorage.getItem('forecasts') || '[]');
  forecastsData = forecasts;
  displayForecasts();
}

// Load saved forecasts on page load
document.addEventListener('DOMContentLoaded', loadSavedForecasts);

// Expose functions to the global scope so they can be called from HTML
(window as any).openModal = openModal;
(window as any).closeModal = closeModal;
(window as any).searchForecast = searchForecast;
(window as any).prevPage = prevPage;
(window as any).nextPage = nextPage;
