import WeatherDashboard from "./components/WeatherDashboard";
import { useState, useEffect } from "react";
import { Cloud, MapPin } from "lucide-react";
import { getWeatherByLocation } from "./api/weather";

function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Buscar clima por localização atual
  const handleGetCurrentLocation = () => {
    console.log("Buscando localização...");
    if ("geolocation" in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const data = await getWeatherByLocation(latitude, longitude);
            setCity("Sua localização");
            setWeatherData(data);
            setError("");
          } catch {
            setError("Erro ao obter dados da localização");
          } finally {
            setLoading(false);
          }
        },
        () => {
          setError("Erro ao obter localização");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocalização não suportada pelo navegador");
    }
  };

  // Carregar localização atual ao iniciar
  useEffect(() => {
    handleGetCurrentLocation();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="min-h-screen w-screen bg-gradient-to-br from-blue-50 to-blue-100">
        {/* Header com Logo e Nome */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <Cloud className="w-8 h-8 text-blue-600" />
                    <span className="text-2xl font-bold text-gray-800">
                      WeatherNow
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleGetCurrentLocation()}
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors bg-blue-400 px-3 py-2 rounded-lg shadow-sm"
                >
                  <MapPin className="w-5 h-5" />
                  <span>Usar minha localização</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <WeatherDashboard
          city={city}
          setCity={setCity}
          weatherData={weatherData}
          setWeatherData={setWeatherData}
          error={error}
          setError={setError}
          loading={loading}
          setLoading={setLoading}
        />
      </div>
    </div>
  );
}

export default App;
