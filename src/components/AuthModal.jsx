/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Loader2, X } from "lucide-react";
import { supabase } from '../api/supabase'

const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('login');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let result;
      if (activeTab === 'login') {
        result = await supabase.auth.signInWithPassword({
          email,
          password,
        });
      } else {
        result = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              last_location: null // Will be updated after successful auth
            }
          }
        });
      }

      if (result.error) throw result.error;

      // Get current location if available
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Update user's metadata with location
          await supabase.auth.updateUser({
            data: {
              last_location: { latitude, longitude }
            }
          });
        });
      }

      onAuthSuccess(result.data.user);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 bg-white border border-gray-300 rounded-full p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal header */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6 bg-white">
          {activeTab === 'login' ? 'Entrar' : 'Criar Conta'}
        </h2>

        {/* Tabs */}
        <div className="flex mb-6 gap-3">
          <button
            className={`flex-1 py-2 text-center border-b-2 bg-white ${
              activeTab === 'login'
                ? 'border-blue-500 text-blue-600 font-medium'
                : 'border-gray-300 text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 text-center border-b-2 bg-white ${
              activeTab === 'register'
                ? 'border-blue-500 text-blue-600 font-medium'
                : 'border-gray-300 text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('register')}
          >
            Registrar
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-white w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md text-white font-medium 
              ${loading 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
              } 
              flex items-center justify-center`}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Aguarde
              </>
            ) : activeTab === 'login' ? (
              'Entrar'
            ) : (
              'Criar Conta'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;