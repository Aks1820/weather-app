import { type ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { CloudRain, History, MapPin } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';

const Layout = ({ children }: { children: ReactNode }) => {
  const { location, locationError, setTempUnit, tempUnit } = useWeather();

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-slate-50 font-sans">
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Left: Logo */}
          <div className="flex-1 flex items-center space-x-2 text-indigo-400">
            <CloudRain className="w-8 h-8" />
            <span className="text-xl font-bold tracking-tight hidden sm:block">SkyCast</span>
          </div>

          {/* Center: Navigation */}
          <div className="flex justify-center flex-none">
            <nav className="flex items-center space-x-2 bg-slate-800/50 p-1.5 rounded-full border border-slate-700/50">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center space-x-1.5 px-4 py-1.5 rounded-full font-medium text-sm transition-all ${
                    isActive 
                      ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                  }`
                }
              >
                <span>Current</span>
              </NavLink>
              <NavLink
                to="/historical"
                className={({ isActive }) =>
                  `flex items-center space-x-1.5 px-4 py-1.5 rounded-full font-medium text-sm transition-all ${
                    isActive 
                      ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                  }`
                }
              >
                <History className="w-4 h-4" />
                <span>Historical</span>
              </NavLink>
            </nav>
          </div>

          {/* Right: Actions */}
          <div className="flex-1 flex items-center justify-end space-x-4">
            <div className="hidden sm:flex items-center space-x-1 text-sm text-slate-400 bg-slate-800 px-3 py-1.5 rounded-full">
              <MapPin className="w-4 h-4 text-rose-400" />
              <span className="truncate max-w-[150px]">
                {locationError ? 'Location Error' : location ? `${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}` : 'Locating...'}
              </span>
            </div>
            
            <div className="flex bg-slate-800 rounded-lg p-1 space-x-1">
              <button
                onClick={() => setTempUnit('C')}
                className={`w-8 h-8 rounded-md text-sm font-semibold transition-all ${
                  tempUnit === 'C' ? 'bg-indigo-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                °C
              </button>
              <button
                onClick={() => setTempUnit('F')}
                className={`w-8 h-8 rounded-md text-sm font-semibold transition-all ${
                  tempUnit === 'F' ? 'bg-indigo-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                °F
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      
      <footer className="bg-slate-950 border-t border-slate-800 py-6 text-center text-sm text-slate-500">
        <p>Weather data provided by <a href="https://open-meteo.com/" className="text-indigo-400 hover:underline">Open-Meteo.com</a></p>
      </footer>
    </div>
  );
};

export default Layout;
