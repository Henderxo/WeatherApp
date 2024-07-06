import './style.css'
import rain from './Assets/rain.svg'
import clear from './Assets/day_clear.svg'
import clouds from './Assets/cloudy.svg'
import thunder from './Assets/thunder.svg'
import snow from './Assets/snow.svg'
import mist from './Assets/mist.svg'
import fog from './Assets/fog.svg'
import wind from './Assets/wind.svg'
import tornado from './Assets/tornado.svg'
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

function displayError(message: string){
  const modal = document.getElementById('error-modal') as HTMLDivElement;
  const error = document.getElementById('error-modal-message') as HTMLParagraphElement;
  error.textContent = message;
  modal.classList.add('is-active');
}

function closeError(){
  const modal = document.getElementById('error-modal') as HTMLDivElement;
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
  let query = "";

  if (lat && lon) {
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    query = "lat and lon";
  } else if (zip) {
    url = `https://api.openweathermap.org/data/2.5/weather?zip=${zip}&appid=${apiKey}&units=metric`;
    query = "zip";
  } else if (city) {
    url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    query = "city";
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
    displayError('Error fetching the weather data, the ' + query + " you entered must not exist");
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
    main: string;
    description: string;
  }[];
}

function formatUnixTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const hours = date.getHours();
  const minutes = "0" + date.getMinutes();
  const formattedTime = hours + ':' + minutes.substr(-2);
  return formattedTime;
}


function displayForecasts(forecasts?: WeatherData[]) {
  const forecastContainer = document.getElementById('forecast-container');

  if (!forecastContainer) {
    console.error('Forecasts container not found in the DOM.');
    return;
  }

  forecastContainer.innerHTML = '';

  const dataToDisplay = forecasts ?? forecastsData;
  const startIndex = (currentPage - 1) * forecastsPerPage;
  const endIndex = startIndex + forecastsPerPage;
  const currentForecasts = dataToDisplay.slice(startIndex, endIndex);

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

    let icon = "";
    switch(data.weather[0].main){
      case "Rain":
        icon = rain;
        break;
      case "Clouds":
        icon = clouds;
        break;
      case "Clear":
        icon = clear;
        break;
      case "Thunderstorm":
        icon = thunder;
        break;
      case "Snow":
        icon = snow;
        break;
      case "Mist":
        icon = mist;
        break;
      case "Fog":
        icon = fog;
        break;
      case "Tornado":
        icon = tornado;
        break;
      case "Drizzle":
        icon = rain;
        break;
      case "Haze":
        icon = fog;
        break;
      case "Squall":
        icon = wind;
        break;
      default:
    }
    
    const iconParagraph = document.createElement('p');
    const iconImg = document.createElement('img');
    iconImg.src = icon;
    iconImg.alt = clear;
    iconImg.style.width = '40px';
    iconImg.style.height = '40px';
    iconImg.style.padding = ''
    iconParagraph.appendChild(iconImg);

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
    forecastDiv.appendChild(iconParagraph);
    forecastDiv.appendChild(removeButton);
    forecastContainer.appendChild(forecastDiv);
  });
  updatePageButtons();
}

function nextPage(){
  const totalPages = Math.ceil(forecastsData.length / forecastsPerPage);
  
  if (currentPage < totalPages) {
    currentPage++;
    displayForecasts();
  } else {
    displayError('No more forecasts to display.');
    console.log('No more forecasts to display.');
  }
}

function prevPage(){
  if (currentPage != 1)
  {
    currentPage--;
    displayForecasts();
  }
  else{
    displayError('Less then 10 forecasts to display');
  }
}

function updatePageButtons() {
  const totalPages = Math.ceil(forecastsData.length / forecastsPerPage);
  const prevPageButton = document.getElementById('prev-page-button') as HTMLButtonElement;
  const nextPageButton = document.getElementById('next-page-button') as HTMLButtonElement;

  if (prevPageButton) {
    if (currentPage === 1) {
      prevPageButton.style.display = 'none';
    } else {
      prevPageButton.style.display = 'block';
    }
  }

  if (nextPageButton) {
    if (currentPage >= totalPages) {
      nextPageButton.style.display = 'none';
    } else {
      nextPageButton.style.display = 'block';
    }
  }
}

function removeForecast(forecastData: WeatherData) {
  forecastsData = forecastsData.filter(data => data.name !== forecastData.name);
  saveForecastsToLocalStorage();
  displayForecasts();
}

function saveForecastsToLocalStorage() {
  try{
    localStorage.setItem('forecasts', JSON.stringify(forecastsData));
  }
  catch{
    displayError("Forecasts coudn't save localy");
  }
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

function searchForecastByName() {
  const searchInput = document.getElementById('search-input') as HTMLInputElement;
  const query = searchInput.value.trim().toLowerCase();
  const filteredForecasts = forecastsData.filter(forecast =>
    forecast.name.toLowerCase().includes(query)
  );
  displayForecasts(filteredForecasts);
  if (filteredForecasts.length == 0){
    displayError("No forecasts that matched where found");
  }
}


document.addEventListener('DOMContentLoaded', () => loadSavedForecasts());
document.getElementById('add-forecast-button')?.addEventListener('click', () => openModal());
document.getElementById('search-button')?.addEventListener('click', () => searchForecast());
document.getElementById('prev-page-button')?.addEventListener('click', () => prevPage());
document.getElementById('next-page-button')?.addEventListener('click', () => nextPage());
document.getElementById('error-modal-close')?.addEventListener('click', () => closeError());
document.getElementById('search-forecast-button')?.addEventListener('click', () => searchForecastByName());