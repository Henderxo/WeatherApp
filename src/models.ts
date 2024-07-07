interface WeatherData {
    name: string;
    coord: {
        lon: number;
        lat: number;
    }
    main: {
      temp: number;
      humidity: number;
      pressure: number;
    };
    wind: {
      speed: number;
    };
    sys: {
      sunrise: number;
      sunset: number;
      country: string;
    };
    weather: {
      main: string;
      description: string;
    }[];
  }
  
  export type { WeatherData };