import axios from 'axios';

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const AIR_QUALITY_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';
const ARCHIVE_URL = 'https://archive-api.open-meteo.com/v1/archive';

export interface LocationData {
  latitude: number;
  longitude: number;
  name?: string;
}

const apiCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 1000 * 60 * 15; // 15 minutes cache valid time

const fetchWithCache = async (url: string, params?: any) => {
  const cacheKey = `${url}?${JSON.stringify(params || {})}`;
  const now = Date.now();
  const cached = apiCache.get(cacheKey);

  if (cached && now - cached.timestamp < CACHE_DURATION) {
    return cached.data; // Serve instantly from memory
  }

  const response = await axios.get(url, { params });
  apiCache.set(cacheKey, { data: response.data, timestamp: now });
  return response.data;
};

export const fetchCurrentAndHourlyWeather = async (lat: number, lon: number, date?: string) => {
  const params: any = {
    latitude: lat,
    longitude: lon,
    current: 'temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m',
    hourly: 'temperature_2m,relative_humidity_2m,precipitation,visibility,wind_speed_10m',
    daily: 'sunrise,sunset,uv_index_max,precipitation_probability_max,wind_speed_10m_max',
    timezone: 'auto',
  };
  if (date) {
    params.start_date = date;
    params.end_date = date;
  }
  return fetchWithCache(FORECAST_URL, params);
};

export const fetchCurrentAndHourlyAirQuality = async (lat: number, lon: number, date?: string) => {
  const params: any = {
    latitude: lat,
    longitude: lon,
    current: 'european_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone',
    hourly: 'pm10,pm2_5,european_aqi,carbon_monoxide,nitrogen_dioxide',
    timezone: 'auto',
  };
  if (date) {
    params.start_date = date;
    params.end_date = date;
  }
  return fetchWithCache(AIR_QUALITY_URL, params);
};

export const fetchHistoricalData = async (lat: number, lon: number, startDate: string, endDate: string) => {
  const params = {
    latitude: lat,
    longitude: lon,
    start_date: startDate,
    end_date: endDate,
    daily: 'temperature_2m_max,temperature_2m_min,temperature_2m_mean,sunrise,sunset,precipitation_sum,wind_speed_10m_max,wind_direction_10m_dominant',
    timezone: 'auto',
  };
  return fetchWithCache(ARCHIVE_URL, params);
};

export const fetchHistoricalAirQuality = async (lat: number, lon: number, startDate: string, endDate: string) => {
  const params = {
    latitude: lat,
    longitude: lon,
    start_date: startDate,
    end_date: endDate,
    hourly: 'pm10,pm2_5',
    timezone: 'auto',
  };
  return fetchWithCache(AIR_QUALITY_URL, params);
};

// Uses Open-Meteo Geocoding API if name resolution is needed
export const searchLocation = async (query: string) => {
  const url = `https://geocoding-api.open-meteo.com/v1/search`;
  const response = await fetchWithCache(url, { name: query, count: 5, language: 'en', format: 'json' });
  return response.results;
};
