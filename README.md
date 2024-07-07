# WeatherApp

WeatherApp is a web application that allows users to search for weather forecasts based on city names, ZIP codes, or coordinates (latitude and longitude).
It displays detailed weather information including temperature, humidity, wind speed, pressure, sunrise, sunset times, and weather conditions.

## Features

- **Search by City Name**: Enter a city name to fetch the current weather forecast.
- **Search by ZIP Code**: Enter a ZIP code to retrieve the current weather forecast.
- **Search by Coordinates**: Enter latitude and longitude coordinates to get the current weather forecast.
- **Save and Display Forecasts**: Save searched forecasts locally and display them in a paginated format.
- **Remove Forecasts**: Remove saved forecasts from the display.
- **Responsive Design**: Responsive layout for use on desktop and mobile devices.

## Technologies Used

- **Frontend**: HTML, CSS (Bulma.io for styling), TypeScript
- **Backend**: OpenWeatherMap API for weather data retrieval
- **Build Tool**: Vite.js
- **Additional Libraries**: Axios for HTTP requests

## WeatherApp - Building and Starting Instructions

Before running the WeatherApp locally, ensure you have the following installed on your machine:

- **Node.js**: Download and install Node.js from [nodejs.org](https://nodejs.org/), which includes npm (Node Package Manager).

Step-by-Step Guide:

1. **Clone the Repository:**
     Open your terminal.
     Clone the WeatherApp repository from GitHub:
     *-git clone https://github.com/Henderxo/WeatherApp.git*.
2. **Navigate to the Project Directory:**
     *-cd WeatherApp*.
3. **Install Dependencies:**
     Install the necessary dependencies using npm:
     *-npm install*.
4. **Configuration:**
     Open the project directory in your preferred code editor.
     In **api.ts** files change the API key, to your own. (To get the API key use this website: https://openweathermap.org/).
5. **Run the Application:**
     Start the WeatherApp locally:
     *-npm run dev*.
     This command will build and run the application in development mode.
6. **Access the Application:**
     Open your web browser.
     Navigate to http://localhost:xxxx (or the port specified in your project) to view the WeatherApp.
   
