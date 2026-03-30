import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { getUserLocation } from '../services/geolocation';
import type { LocationData } from '../services/api';

interface WeatherContextType {
  location: LocationData | null;
  setLocation: (loc: LocationData) => void;
  tempUnit: 'C' | 'F';
  setTempUnit: (unit: 'C' | 'F') => void;
  loadingLocation: boolean;
  locationError: string | null;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');
  const [loadingLocation, setLoadingLocation] = useState<boolean>(true);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    const initLocation = async () => {
      try {
        const coords = await getUserLocation();
        setLocation({ latitude: coords.latitude, longitude: coords.longitude });
      } catch (err: any) {
        setLocationError(err.message || 'Unable to retrieve location. Using default location (London).');
        // Default to London if GPS fails
        setLocation({ latitude: 51.5074, longitude: -0.1278, name: 'London' });
      } finally {
        setLoadingLocation(false);
      }
    };
    initLocation();
  }, []);

  return (
    <WeatherContext.Provider
      value={{ location, setLocation, tempUnit, setTempUnit, loadingLocation, locationError }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};
