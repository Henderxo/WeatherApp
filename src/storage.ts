import { WeatherData } from './models';
import { displayForecasts, displayError, displaySuccess } from './ui';
import { currentForecastsData, setCurrentForecastsData, forecastsData, setForecastsData, searchQuery } from './states';

function saveForecast(data: WeatherData) {
    try{
    forecastsData.push(data);
    localStorage.setItem('forecasts', JSON.stringify(forecastsData));
    }
    catch{
        displayError("Forecasts coudn't save localy");
    }
  }

function saveForecastsToLocalStorage() {
    try{
      localStorage.setItem('forecasts', JSON.stringify(forecastsData));
    }
    catch{
      displayError("Forecasts coudn't save localy");
    }
  }

  function loadSavedForecasts() {
    try{
    let forecasts = JSON.parse(localStorage.getItem('forecasts') || '[]');
    setForecastsData(forecasts);
    setCurrentForecastsData(forecasts);
    displayForecasts();
    }
    catch{
        displayError("Loading data failed");
    }
  }

function removeForecast(forecastData: WeatherData) {
    try{
    setForecastsData(forecastsData.filter(data => data.name !== forecastData.name));
    setCurrentForecastsData(currentForecastsData.filter(data => data.name !== forecastData.name));
    saveForecastsToLocalStorage();
    displayForecasts();
    displaySuccess("Forecast was successfully removed");
    }
    catch{
        displayError("Forecasts coudn't be removed");
    }
  }

  function updateForecastLastQuery() {
    const filteredForecasts = forecastsData.filter(forecast =>
      forecast.name.toLowerCase().includes(searchQuery)
    );
    setCurrentForecastsData(filteredForecasts);
    displayForecasts(filteredForecasts);
    if (filteredForecasts.length == 0){
      displayError("No forecasts that matched where found");
    }
  }

export { saveForecast, saveForecastsToLocalStorage, loadSavedForecasts, removeForecast, updateForecastLastQuery };