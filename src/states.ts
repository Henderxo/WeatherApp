import { WeatherData } from './models';

const forecastsPerPage = 10;
let currentPage = 1;
let forecastsData: WeatherData[] = [];
let currentModel: string;
let currentForecastsData: WeatherData[] = [];
let searchQuery = '';


function setCurrentPage(page: number): void {
    currentPage = page;
  }
function setForecastsData(data: WeatherData[]): void {
    forecastsData = data;
  }
function setCurrentModel(model: string): void {
    currentModel = model;
  }
function setCurrentForecastsData(data: WeatherData[]): void {
    currentForecastsData = data;
  }
function setSearchQuery(query: string): void {
    searchQuery = query;
  }

export {
  forecastsPerPage,
  currentPage,
  forecastsData,
  currentModel,
  currentForecastsData,
  searchQuery,
  setCurrentPage,
  setForecastsData,
  setCurrentModel,
  setCurrentForecastsData,
  setSearchQuery
};