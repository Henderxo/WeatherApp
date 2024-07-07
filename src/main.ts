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
let currentModel: string;
let currentForecastsData: WeatherData[] = [];
let searchQuery: string = '';


function displayError(message: string){
  const modal = document.getElementById('error-modal') as HTMLDivElement;
  const error = document.getElementById('error-modal-message') as HTMLParagraphElement;
  error.textContent = message;
  modal.classList.add('is-active');
  currentModel = "error-modal";
}

function open(modelName: string){
  const modal = document.getElementById(modelName) as HTMLDivElement;
  modal.classList.add('is-active');
  currentModel = modelName;
}

function openClose(modelNameToOpen: string, modelNameToClose: string){
  const modalOpen = document.getElementById(modelNameToOpen) as HTMLDivElement;
  const modalClose = document.getElementById(modelNameToClose) as HTMLDivElement;
  modalClose.classList.remove('is-active');
  modalOpen.classList.add('is-active');
  currentModel = modelNameToOpen;
}

function close(modelName: string){
  const modal = document.getElementById(modelName) as HTMLDivElement;
  modal.classList.remove('is-active');
}

function displaySuccess(message: string){
  const modal = document.getElementById('success-modal') as HTMLDivElement;
  const error = document.getElementById('success-modal-message') as HTMLParagraphElement;
  error.textContent = message;
  modal.classList.add('is-active');
  currentModel = "success-modal";
}


async function searchForecast() {
  close(currentModel);
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
    if (forecastsData.some(dat => dat.name.toLowerCase() === data.name.toLowerCase())) 
    {
      displayError("Forecast for " + data.name + " already exists.");
      return;
    }
    saveForecast(data);
    updateForecastLastQuery();
    displaySuccess("Forecast was successfully added");
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

  const dataToDisplay = forecasts ?? currentForecastsData;
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
  updatePageButtons(currentForecastsData);
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

function updatePageButtons(data: any[] = forecastsData) {
  const totalPages = Math.ceil(data.length / forecastsPerPage);
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
  currentForecastsData = currentForecastsData.filter(data => data.name !== forecastData.name);
  saveForecastsToLocalStorage();
  displayForecasts();
  displaySuccess("Forecast was successfully removed");
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
  const curretnIndex = currentForecastsData.findIndex(forecast => forecast.name === data.name);
  if (existingIndex !== -1) {
    forecastsData[existingIndex] = data;
    currentForecastsData[curretnIndex] = data;
  } else {
    forecastsData.push(data);
    currentForecastsData.push(data);
  }
  localStorage.setItem('forecasts', JSON.stringify(forecastsData));
  displayForecasts();
}

function loadSavedForecasts() {
  let forecasts = JSON.parse(localStorage.getItem('forecasts') || '[]');
  forecastsData = forecasts;
  currentForecastsData = forecasts;
  displayForecasts();
}

function searchForecastByName() {
  currentPage = 1;
  const searchInput = document.getElementById('search-input') as HTMLInputElement;
  const query = searchInput.value.trim().toLowerCase();
  searchQuery = query;
  const filteredForecasts = forecastsData.filter(forecast =>
    forecast.name.toLowerCase().includes(query)
  );
  currentForecastsData = filteredForecasts;
  displayForecasts(filteredForecasts);
  updatePageButtons(filteredForecasts);
  if (filteredForecasts.length == 0){
    displayError("No forecasts that matched where found");
  }
}

function updateForecastLastQuery() {
  const filteredForecasts = forecastsData.filter(forecast =>
    forecast.name.toLowerCase().includes(searchQuery)
  );
  currentForecastsData = filteredForecasts;
  displayForecasts(filteredForecasts);
  updatePageButtons(filteredForecasts);
  if (filteredForecasts.length == 0){
    displayError("No forecasts that matched where found");
  }
}

document.addEventListener('DOMContentLoaded', () => loadSavedForecasts());
document.getElementById('add-forecast-button')?.addEventListener('click', () => open("forecast-modal"));
document.getElementById('close')?.addEventListener('click', () => close(currentModel));
document.getElementById('close-city')?.addEventListener('click', () => close(currentModel));
document.getElementById('close-zip')?.addEventListener('click', () => close(currentModel));
document.getElementById('close-lat')?.addEventListener('click', () => close(currentModel));
document.getElementById('city-field')?.addEventListener('click', () => openClose("forecast-modal-city", currentModel));
document.getElementById('zip-field')?.addEventListener('click', () => openClose("forecast-modal-zip", currentModel));
document.getElementById('lat-field')?.addEventListener('click', () => openClose("forecast-modal-lat", currentModel));
document.getElementById('search-button-city')?.addEventListener('click', () => searchForecast());
document.getElementById('search-button-zip')?.addEventListener('click', () => searchForecast());
document.getElementById('search-button-lat')?.addEventListener('click', () => searchForecast());
document.getElementById('prev-page-button')?.addEventListener('click', () => prevPage());
document.getElementById('next-page-button')?.addEventListener('click', () => nextPage());
document.getElementById('error-modal-close')?.addEventListener('click', () => close(currentModel));
document.getElementById('success-modal-close')?.addEventListener('click', () => close(currentModel));
document.getElementById('search-forecast-button')?.addEventListener('click', () => searchForecastByName());