import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { useAuth } from './AuthContext.js';
import { useLanguage } from './LanguageContext.js';

interface FarmContextType {
  location: string;
  setLocation: (loc: string) => void;
  weather: any | null;
  isLoadingWeather: boolean;
  alerts: any[];
  unreadAlertsCount: number;
  crops: any[];
  refreshWeather: () => Promise<void>;
  refreshAlerts: () => Promise<void>;
  refreshCrops: () => Promise<void>;
  detectLocationGPS: () => Promise<boolean>;
}

const FarmContext = createContext<FarmContextType | undefined>(undefined);

export const FarmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { language } = useLanguage();

  const [location, setLocationState] = useState<string>(() => {
    return localStorage.getItem('krishi_location') || 'Pune';
  });

  const [weather, setWeather] = useState<any | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(true);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [crops, setCrops] = useState<any[]>([]);

  const setLocation = (loc: string) => {
    setLocationState(loc);
    localStorage.setItem('krishi_location', loc);
  };

  useEffect(() => {
    if (user?.district && !localStorage.getItem('krishi_location')) {
      setLocation(user.district);
    }
  }, [user]);

  const refreshWeather = async () => {
    setIsLoadingWeather(true);
    try {
      const res = await api.weather.getCurrent({ location });
      if (res.success) {
        setWeather(res.weather);
      }
    } catch (err) {
      console.warn('Weather fetch error:', err);
    } finally {
      setIsLoadingWeather(false);
    }
  };

  const refreshAlerts = async () => {
    try {
      const res = await api.alerts.getAll(location, language);
      if (res.success) {
        setAlerts(res.alerts);
      }
    } catch (err) {
      console.warn('Alerts fetch error:', err);
    }
  };

  const refreshCrops = async () => {
    try {
      const res = await api.crops.getAll();
      if (res.success) {
        setCrops(res.crops);
      }
    } catch (err) {
      console.warn('Crops fetch error:', err);
    }
  };

  const detectLocationGPS = async (): Promise<boolean> => {
    if (!navigator.geolocation) {
      return false;
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await api.weather.getCurrent({ lat: latitude, lon: longitude });
            if (res.success && res.weather) {
              setWeather(res.weather);
              setLocation(res.weather.locationName);
              resolve(true);
              return;
            }
          } catch (err) {
            console.error('GPS Weather lookup failed:', err);
          }
          resolve(false);
        },
        (_error) => {
          resolve(false);
        },
        { timeout: 8000 }
      );
    });
  };

  useEffect(() => {
    refreshWeather();
    refreshAlerts();
    refreshCrops();
  }, [location, language]);

  const unreadAlertsCount = alerts.filter((a) => !a.read).length;

  return (
    <FarmContext.Provider
      value={{
        location,
        setLocation,
        weather,
        isLoadingWeather,
        alerts,
        unreadAlertsCount,
        crops,
        refreshWeather,
        refreshAlerts,
        refreshCrops,
        detectLocationGPS
      }}
    >
      {children}
    </FarmContext.Provider>
  );
};

export const useFarm = (): FarmContextType => {
  const context = useContext(FarmContext);
  if (!context) {
    throw new Error('useFarm must be used within a FarmProvider');
  }
  return context;
};
