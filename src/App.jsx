/* eslint-disable no-undef */
import WeatherDashboard from "./components/WeatherDashboard";
import { useState, useEffect } from "react";
import { Cloud, MapPin, UserCircle, LogOut } from "lucide-react";
import { getWeatherByLocation } from "./api/weather";
import AuthModal from "./components/AuthModal";
import { supabase } from './api/supabase'

function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Verificar sessão do usuário ao carregar
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        // Se houver localização salva, carregar
        if (session.user.user_metadata?.last_location) {
          const { latitude, longitude } = session.user.user_metadata.last_location;
          handleGetWeatherByLocation(latitude, longitude);
        }
      }
    };

    checkSession();

    // Listener para mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleGetWeatherByLocation = async (latitude, longitude) => {
    try {
      setLoading(true);
      const data = await getWeatherByLocation(latitude, longitude);
      setCity("Sua localização");
      setWeatherData(data);
      setError("");
    } catch {
      setError("Erro ao obter dados da localização");
    } finally {
      setLoading(false);
    }
  };

  // Buscar clima por localização atual
  const handleGetCurrentLocation = () => {
    console.log("Buscando localização...");
    if ("geolocation" in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Se estiver logado, salvar localização
          if (user) {
            await supabase.auth.updateUser({
              data: {
                last_location: { latitude, longitude }
              }
            });
          }

          handleGetWeatherByLocation(latitude, longitude);
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

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
                  onClick={handleGetCurrentLocation}
                  className="flex items-center gap-2 text-white hover:bg-blue-500 transition-colors bg-blue-600 px-4 py-2 rounded-lg"
                >
                  <MapPin className="w-5 h-5" />
                  <span>Usar minha localização</span>
                </button>

                {user ? (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <UserCircle className="w-6 h-6 text-gray-600" />
                      <span className="text-gray-700">{user.email}</span>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors bg-white"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="bg-gray-200 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Entrar
                  </button>
                )}
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

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onAuthSuccess={(user) => setUser(user)}
        />
      </div>
    </div>
  );
}

export default App;