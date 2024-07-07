import rain from './Assets/rain.svg';
import clear from './Assets/day_clear.svg';
import clouds from './Assets/cloudy.svg';
import thunder from './Assets/thunder.svg';
import snow from './Assets/snow.svg';
import mist from './Assets/mist.svg';
import fog from './Assets/fog.svg';
import wind from './Assets/wind.svg';
import tornado from './Assets/tornado.svg';
import { formatUnixTimestamp } from './utils';
import { WeatherData } from './models';
import { removeForecast } from './storage';
import { forecastsPerPage, currentPage, currentForecastsData, forecastsData, setCurrentModel, setCurrentPage, setSearchQuery, setCurrentForecastsData } from './states';


function displayError(message: string) {
  const modal = document.getElementById('error-modal') as HTMLDivElement;
  const error = document.getElementById('error-modal-message') as HTMLParagraphElement;
  error.textContent = message;
  modal.classList.add('is-active');
  setCurrentModel("error-modal");
}

function open(modelName: string) {
  const modal = document.getElementById(modelName) as HTMLDivElement;
  modal.classList.add('is-active');
  setCurrentModel(modelName);
}

function openClose(modelNameToOpen: string, modelNameToClose: string) {
  const modalOpen = document.getElementById(modelNameToOpen) as HTMLDivElement;
  const modalClose = document.getElementById(modelNameToClose) as HTMLDivElement;
  modalClose.classList.remove('is-active');
  modalOpen.classList.add('is-active');
  setCurrentModel(modelNameToOpen);
}

function close(modelName: string) {
  const modal = document.getElementById(modelName) as HTMLDivElement;
  modal.classList.remove('is-active');
}

function displaySuccess(message: string) {
  const modal = document.getElementById('success-modal') as HTMLDivElement;
  const error = document.getElementById('success-modal-message') as HTMLParagraphElement;
  error.textContent = message;
  modal.classList.add('is-active');
  setCurrentModel("success-modal");
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
      if(data.name != ""){
        title.textContent = data.name;
      }
      else{
        title.textContent = "Lon: " + data.coord.lon + ", Lat: " + data.coord.lat;
      }
      
      const tempParagraph = document.createElement('p');
      tempParagraph.textContent = `Temperature: ${data.main.temp} °C`;
  
      const humidityParagraph = document.createElement('p');
      humidityParagraph.textContent = `Humidity: ${data.main.humidity} %`;
  
      const windSpeedParagraph = document.createElement('p');
      windSpeedParagraph.textContent = `Wind speed: ${data.wind.speed} m/s`;
  
      const pressureParagraph = document.createElement('p');
      pressureParagraph.textContent = `Pressure: ${data.main.pressure} hPa`;
  
      const sunriseSunsetParagraph = document.createElement('p');
      sunriseSunsetParagraph.textContent = `Time of sunrise: ${formatUnixTimestamp(data.sys.sunrise)} h; Time of sunset: ${formatUnixTimestamp(data.sys.sunset)} h`;
  
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
    const text = document.getElementById('pages') as HTMLParagraphElement;
    text.textContent = `Page: ${currentPage} of ${totalPages}`;

  }

  function searchForecastByName() {
    setCurrentPage(1);
    const searchInput = document.getElementById('search-input') as HTMLInputElement;
    const query = searchInput.value.trim().toLowerCase();
    setSearchQuery(query);
    const filteredForecasts = forecastsData.filter(forecast =>
      forecast.name.toLowerCase().includes(query)
    );
    setCurrentForecastsData(filteredForecasts);
    displayForecasts(filteredForecasts);
    if (filteredForecasts.length == 0){
      displayError("No forecasts that matched where found");
    }
  }

  function nextPage(){
    const totalPages = Math.ceil(forecastsData.length / forecastsPerPage);
    
    if (currentPage < totalPages) {
      setCurrentPage(currentPage+1);
      displayForecasts();
    } else {
      displayError('No more forecasts to display.');
      console.log('No more forecasts to display.');
    }
  }
  
  function prevPage(){
    if (currentPage != 1)
    {
        setCurrentPage(currentPage-1);
      displayForecasts();
    }
    else{
      displayError('Less then 10 forecasts to display');
    }
  }

export { displayForecasts, open, close, openClose, displaySuccess, displayError, searchForecastByName, prevPage, nextPage };