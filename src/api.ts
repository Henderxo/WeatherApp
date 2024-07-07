import axios from 'axios';
import { saveForecast, updateForecastLastQuery } from './storage';
import { displaySuccess, displayError, close } from './ui';
import { currentModel, forecastsData } from './states';

const apiKey = ''; // Replace with your actual API key

async function searchForecast(used: string) {
  close(currentModel);
  const cityInput = document.getElementById('city-input') as HTMLInputElement;
  const zipInput = document.getElementById('zip-input') as HTMLInputElement;
  const latInput = document.getElementById('lat-input') as HTMLInputElement;
  const lonInput = document.getElementById('lon-input') as HTMLInputElement;

  const city = encodeURIComponent(cityInput.value.trim());
  const zip = encodeURIComponent(zipInput.value.trim());
  const lat = encodeURIComponent(latInput.value.trim());
  const lon = encodeURIComponent(lonInput.value.trim());

  let url = '';
  let query = "";

  if (used == "lat") {
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    query = "lat and lon";
  } else if (used == "zip") {
    url = `https://api.openweathermap.org/data/2.5/weather?zip=${zip}&appid=${apiKey}&units=metric`;
    query = "zip";
  } else if (used == "city") {
    url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    query = "city";
  } else {
    console.error('Please enter either city name, ZIP code, or coordinates.');
    return;
  }

  try {
    const response = await axios.get(url);
    const data = response.data;
    if (forecastsData.some(dat => dat.name.toLowerCase() === data.name.toLowerCase())) {
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
export {searchForecast};
