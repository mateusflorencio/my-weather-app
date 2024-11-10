/* eslint-disable react/prop-types */
import {
  Search,
  Cloud,
  Sun,
  CloudRain,
  Wind,
  Thermometer,
  Droplets,
  Navigation,
  Sunrise,
  Sunset,
  CloudLightning,
  Loader2Icon,
} from "lucide-react";
import { getWeatherData } from "../api/weather";

const WeatherDashboard = ({
  city,
  setCity,
  weatherData,
  setWeatherData,
  error,
  setError,
  loading,
  setLoading,
}) => {
  // Buscar clima por cidade
  const handleSearch = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getWeatherData(city);
      setWeatherData(data);

      console.log(data);
    } catch {
      setError("Não foi possível encontrar a cidade");
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition, size = 8) => {
    const iconProps = { className: `w-${size} h-${size}` };
    switch (condition) {
      case "sunny":
        return (
          <Sun
            {...iconProps}
            className={`${iconProps.className} text-yellow-500`}
          />
        );
      case "rainy":
        return (
          <CloudRain
            {...iconProps}
            className={`${iconProps.className} text-blue-500`}
          />
        );
      case "cloudy":
        return (
          <Cloud
            {...iconProps}
            className={`${iconProps.className} text-gray-500`}
          />
        );
      case "storm":
        return (
          <CloudLightning
            {...iconProps}
            className={`${iconProps.className} text-gray-600`}
          />
        );
      default:
        return (
          <Sun
            {...iconProps}
            className={`${iconProps.className} text-yellow-500`}
          />
        );
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header com Logo e Nome */}

      <main className="max-w-7xl mx-auto p-8">
        {/* Barra de Busca */}
        <div className="mb-8">
          <div className="flex gap-3">
            <div className="flex-1 max-w-md">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Digite o nome da cidade..."
                className="text-gray-600 w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white placeholder-gray-400"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className={`bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm ${
                loading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              <Search className="w-5 h-5" />
              {loading ? "Buscando..." : "Buscar"}
            </button>
          </div>
          {error && <div className="mt-3 text-red-500">{error}</div>}
        </div>

        {weatherData && !loading && (
          <div className="grid grid-cols-12 gap-6">
            {/* Painel Principal */}
            <div className="col-span-12 lg:col-span-8 bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{city}</h2>
                  <p className="text-gray-600 mt-1">
                    {weatherData.description}
                  </p>
                  <div className="flex items-baseline mt-4">
                    <span className="text-6xl font-bold text-gray-800">
                      {weatherData.temp}°
                    </span>
                    <span className="text-gray-500 ml-4">
                      Sensação térmica: {weatherData.feelsLike}°
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  {getWeatherIcon(weatherData.condition, 16)}
                </div>
              </div>

              {/* Previsão por Hora */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">
                  Previsão por Hora
                </h3>
                <div className="grid grid-cols-5 gap-4">
                  {weatherData.hourlyForecast.map((hour) => (
                    <div
                      key={hour.hour}
                      className="bg-gray-50 rounded-lg p-4 text-center"
                    >
                      <p className="text-gray-600 mb-2">{hour.hour}</p>
                      {getWeatherIcon(hour.condition, 6)}
                      <p className="text-lg font-semibold mt-2 text-gray-600">
                        {hour.temp}°
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Previsão para 5 dias */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Próximos 5 dias</h3>
                <div className="grid grid-cols-5 gap-4">
                  {weatherData.forecast.map((day) => (
                    <div key={day.day} className="bg-gray-50 rounded-lg p-4">
                      <p className="font-medium text-gray-800 mb-2">
                        {day.day}
                      </p>
                      <div className="flex justify-center mb-2">
                        {getWeatherIcon(day.condition, 6)}
                      </div>
                      <div className="text-sm">
                        <p className="font-semibold text-gray-800">
                          {day.maxTemp}°
                        </p>
                        <p className="text-gray-500">{day.minTemp}°</p>
                      </div>
                      <p className="text-sm text-blue-500 mt-1">
                        {day.precipitation}%
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Painel Lateral */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              {/* Detalhes do Clima */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-600">
                  Detalhes
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Droplets className="w-5 h-5 text-blue-500" />
                      <span className="text-gray-600">Umidade</span>
                    </div>
                    <span className="font-semibold text-gray-600">
                      {weatherData.humidity}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Wind className="w-5 h-5 text-blue-500" />
                      <span className="text-gray-600">Vento</span>
                    </div>
                    <span className="font-semibold text-gray-600">
                      {weatherData.windSpeed} km/h
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Navigation className="w-5 h-5 text-blue-500" />
                      <span className="text-gray-600">Direção</span>
                    </div>
                    <span className="font-semibold text-gray-600">
                      {weatherData.windDirection}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Thermometer className="w-5 h-5 text-blue-500" />
                      <span className="text-gray-600">Pressão</span>
                    </div>
                    <span className="font-semibold text-gray-600">
                      {weatherData.pressure} hPa
                    </span>
                  </div>
                </div>
              </div>

              {/* Sol e Visibilidade */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-600">
                  Sol & Visibilidade
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Sunrise className="w-5 h-5 text-orange-500" />
                      <span className="text-gray-600">Nascer do Sol</span>
                    </div>
                    <span className="font-semibold text-gray-600">
                      {weatherData.sunrise}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Sunset className="w-5 h-5 text-orange-500" />
                      <span className="text-gray-600">Pôr do Sol</span>
                    </div>
                    <span className="font-semibold text-gray-600">
                      {weatherData.sunset}
                    </span>
                  </div>
                  <div className="mt-2 pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Visibilidade</span>
                      <span className="font-semibold text-gray-600">
                        {weatherData.visibility} km
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center h-64">
            <Loader2Icon className="w-12 h-12 text-blue-600 animate-spin" />
          </div>
        )}
      </main>
    </div>
  );
};

export default WeatherDashboard;
