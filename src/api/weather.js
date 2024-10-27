// api/weather.js

const API_KEY = 'a1317c54c2da4460b9a222944242710'; // Obtenha em weatherapi.com
const BASE_URL = 'https://api.weatherapi.com/v1';

export const getWeatherData = async (city) => {
  try {
    // Busca dados atuais e previsão em uma única chamada
    const response = await fetch(
      `${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=5&aqi=yes&lang=pt`
    );
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    // Formatar dados para nosso componente
    return {
      temp: Math.round(data.current.temp_c),
      feelsLike: Math.round(data.current.feelslike_c),
      humidity: data.current.humidity,
      windSpeed: Math.round(data.current.wind_kph),
      windDirection: data.current.wind_dir,
      pressure: data.current.pressure_mb,
      visibility: data.current.vis_km,
      sunrise: data.forecast.forecastday[0].astro.sunrise,
      sunset: data.forecast.forecastday[0].astro.sunset,
      condition: getCondition(data.current.condition.text),
      description: data.current.condition.text,
      name: data.location.name,
      
      // Próximas horas
      hourlyForecast: data.forecast.forecastday[0].hour
        .filter(hour => new Date(hour.time) > new Date())
        .slice(0, 5)
        .map(hour => ({
          hour: formatTime(hour.time),
          temp: Math.round(hour.temp_c),
          condition: getCondition(hour.condition.text)
        })),
      
      // Próximos dias
      forecast: data.forecast.forecastday.map(day => ({
        day: formatDay(day.date),
        maxTemp: Math.round(day.day.maxtemp_c),
        minTemp: Math.round(day.day.mintemp_c),
        condition: getCondition(day.day.condition.text),
        precipitation: day.day.daily_chance_of_rain
      }))
    };
  } catch {
    throw new Error('Erro ao buscar dados do clima');
  }
};

export const getWeatherByLocation = async (lat, lon) => {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=5&aqi=yes&lang=pt`
    );
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }

    return formatWeatherData(data);
  } catch {
    throw new Error('Erro ao buscar localização');
  }
};

// Funções auxiliares
const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatDay = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    weekday: 'short'
  });
};

const getCondition = (weatherText) => {
  const conditions = {
    'Sunny': 'sunny',
    'Clear': 'sunny',
    'Partly cloudy': 'cloudy',
    'Cloudy': 'cloudy',
    'Overcast': 'cloudy',
    'Rain': 'rainy',
    'Light rain': 'rainy',
    'Moderate rain': 'rainy',
    'Heavy rain': 'rainy',
    'Thunder': 'storm',
    'Thunderstorm': 'storm'
  };
  return conditions[weatherText] || 'sunny';
};

// Adicione esta função no arquivo api/weather.js

const formatWeatherData = (data) => {
  return {
    // Dados principais
    temp: Math.round(data.current.temp_c),
    feelsLike: Math.round(data.current.feelslike_c),
    humidity: data.current.humidity,
    windSpeed: Math.round(data.current.wind_kph),
    windDirection: data.current.wind_dir,
    pressure: data.current.pressure_mb,
    visibility: data.current.vis_km,
    sunrise: data.forecast.forecastday[0].astro.sunrise,
    sunset: data.forecast.forecastday[0].astro.sunset,
    condition: getCondition(data.current.condition.text),
    description: data.current.condition.text,
    
    // Previsão por hora - próximas 5 horas
    hourlyForecast: data.forecast.forecastday[0].hour
      .filter(hour => new Date(hour.time) > new Date())
      .slice(0, 5)
      .map(hour => ({
        hour: formatTime(hour.time),
        temp: Math.round(hour.temp_c),
        condition: getCondition(hour.condition.text)
      })),
    
    // Previsão para os próximos 5 dias
    forecast: data.forecast.forecastday.map(day => ({
      day: formatDay(day.date),
      maxTemp: Math.round(day.day.maxtemp_c),
      minTemp: Math.round(day.day.mintemp_c),
      condition: getCondition(day.day.condition.text),
      precipitation: day.day.daily_chance_of_rain
    }))
  };
};