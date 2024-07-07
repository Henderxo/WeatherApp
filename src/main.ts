import { loadSavedForecasts } from './storage'
import { close, openClose, nextPage, prevPage, searchForecastByName, open } from './ui'
import { currentModel } from './states'
import { searchForecast } from './api'

document.addEventListener('DOMContentLoaded', () => loadSavedForecasts());
document.getElementById('add-forecast-button')?.addEventListener('click', () => open("forecast-modal"));
document.getElementById('close')?.addEventListener('click', () => close(currentModel));
document.getElementById('close-city')?.addEventListener('click', () => close(currentModel));
document.getElementById('close-zip')?.addEventListener('click', () => close(currentModel));
document.getElementById('close-lat')?.addEventListener('click', () => close(currentModel));
document.getElementById('city-field')?.addEventListener('click', () => openClose("forecast-modal-city", currentModel));
document.getElementById('zip-field')?.addEventListener('click', () => openClose("forecast-modal-zip", currentModel));
document.getElementById('lat-field')?.addEventListener('click', () => openClose("forecast-modal-lat", currentModel));
document.getElementById('search-button-city')?.addEventListener('click', () => searchForecast("city"));
document.getElementById('search-button-zip')?.addEventListener('click', () => searchForecast("zip"));
document.getElementById('search-button-lat')?.addEventListener('click', () => searchForecast("lat"));
document.getElementById('prev-page-button')?.addEventListener('click', () => prevPage());
document.getElementById('next-page-button')?.addEventListener('click', () => nextPage());
document.getElementById('error-modal-close')?.addEventListener('click', () => close(currentModel));
document.getElementById('success-modal-close')?.addEventListener('click', () => close(currentModel));
document.getElementById('search-forecast-button')?.addEventListener('click', () => searchForecastByName());