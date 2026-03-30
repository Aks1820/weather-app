import { useEffect, useState, useMemo } from 'react';
import { useWeather } from '../context/WeatherContext';
import { fetchCurrentAndHourlyWeather, fetchCurrentAndHourlyAirQuality } from '../services/api';
import WeatherCard from '../components/WeatherCard';
import HourlyChart from '../components/HourlyChart';
import { format, parseISO } from 'date-fns';
import { Calendar, Thermometer, Wind, Droplets, Sun, Activity, Loader2, AlertCircle } from 'lucide-react';

const CurrentWeatherPage = () => {
  const { location, loadingLocation, tempUnit } = useWeather();
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  
  const [weatherData, setWeatherData] = useState<any>(null);
  const [aqiData, setAqiData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!location) return;
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [weather, aqi] = await Promise.all([
          fetchCurrentAndHourlyWeather(location.latitude, location.longitude, selectedDate),
          fetchCurrentAndHourlyAirQuality(location.latitude, location.longitude, selectedDate)
        ]);
        if (isMounted) {
          setWeatherData(weather);
          setAqiData(aqi);
        }
      } catch (err: any) {
        if (isMounted) setError(err.message || 'Failed to fetch weather data.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    return () => { isMounted = false; };
  }, [location, selectedDate]);

  const convertTemp = (tempC: number) => tempUnit === 'F' ? (tempC * 9/5) + 32 : tempC;
  const tempSymbol = `°${tempUnit}`;

  const hourlyChartData = useMemo(() => {
    if (!weatherData?.hourly?.time || !aqiData?.hourly) return [];
    
    // We only take the first 24 hours (of the requested day)
    const times = weatherData.hourly.time.slice(0, 24);
    return times.map((timeStr: string, index: number) => {
      const tempC = weatherData.hourly?.temperature_2m?.[index] ?? 0;
      return {
        time: format(parseISO(timeStr), 'HH:mm'),
        temperature: parseFloat(convertTemp(tempC).toFixed(1)),
        humidity: weatherData.hourly?.relative_humidity_2m?.[index] ?? 0,
        precipitation: weatherData.hourly?.precipitation?.[index] ?? 0,
        visibility: (weatherData.hourly?.visibility?.[index] ?? 0) / 1000, // km
        windSpeed: weatherData.hourly?.wind_speed_10m?.[index] ?? 0,
        pm10: aqiData.hourly?.pm10?.[index] ?? 0,
        pm2_5: aqiData.hourly?.pm2_5?.[index] ?? 0,
      };
    });
  }, [weatherData, aqiData, tempUnit]);

  const getDailyAvg = (arr: number[] | undefined) => {
    if (!arr || !arr.length) return '--';
    const valid = arr.slice(0, 24).filter((v) => v !== null && v !== undefined);
    if (!valid.length) return '--';
    return (valid.reduce((a, b) => a + b, 0) / valid.length).toFixed(0);
  };
  
  const dailyAqi = getDailyAvg(aqiData?.hourly?.european_aqi);
  const dailyPm10 = getDailyAvg(aqiData?.hourly?.pm10);
  const dailyPm25 = getDailyAvg(aqiData?.hourly?.pm2_5);
  const dailyCo = getDailyAvg(aqiData?.hourly?.carbon_monoxide);
  const dailyNo2 = getDailyAvg(aqiData?.hourly?.nitrogen_dioxide);

  if (loadingLocation) {
    return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-400" /></div>;
  }

  return (
    <div className="space-y-8 animate-fade-in text-slate-200">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Current Forecast</h1>
          <p className="text-slate-400">Real-time weather metrics and hourly predictions.</p>
        </div>
        <div className="flex items-center space-x-3 bg-slate-800/80 p-2 rounded-xl backdrop-blur-sm border border-slate-700/50">
          <Calendar className="w-5 h-5 text-indigo-400 ml-2" />
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent text-slate-200 font-medium focus:outline-none p-1 rounded cursor-pointer"
          />
        </div>
      </header>
      
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {loading && !weatherData ? (
         <div className="flex h-64 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-400" /></div>
      ) : weatherData && aqiData ? (
        <div className="space-y-8">
          {/* Summary Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <WeatherCard
              title="Temperature"
              icon={<Thermometer className="w-4 h-4" />}
              value={`${convertTemp(weatherData.current?.temperature_2m ?? weatherData.hourly?.temperature_2m?.[0] ?? 0).toFixed(1)}${tempSymbol}`}
              subtitle={`Min: ${convertTemp(Math.min(...(weatherData.hourly?.temperature_2m || [0]))).toFixed(1)}° | Max: ${convertTemp(Math.max(...(weatherData.hourly?.temperature_2m || [0]))).toFixed(1)}°`}
            />
            <WeatherCard
              title="Atmospheric"
              icon={<Droplets className="w-4 h-4 text-blue-400" />}
              value={`${weatherData.current?.relative_humidity_2m ?? weatherData.hourly?.relative_humidity_2m?.[0] ?? '--'}%`}
              subtitle={`Precip: ${weatherData.current?.precipitation ?? weatherData.hourly?.precipitation?.[0] ?? '--'}mm`}
              description={`UV Index Max: ${weatherData.daily?.uv_index_max?.[0] ?? '--'}`}
            />
            <WeatherCard
              title="Sun Cycle"
              icon={<Sun className="w-4 h-4 text-amber-400" />}
              value={weatherData.daily?.sunrise?.[0] ? format(parseISO(weatherData.daily.sunrise[0]), 'HH:mm') : '--'}
              subtitle={weatherData.daily?.sunset?.[0] ? format(parseISO(weatherData.daily.sunset[0]), 'HH:mm') : '--'}
              description="Sunrise & Sunset times"
            />
             <WeatherCard
              title="Wind & Rain"
              icon={<Wind className="w-4 h-4 text-teal-400" />}
              value={`${weatherData.daily?.wind_speed_10m_max?.[0] ?? '--'}`}
              subtitle="km/h Max"
              description={`Max Precip Prob: ${weatherData.daily?.precipitation_probability_max?.[0] ?? '--'}%`}
            />
            <WeatherCard
              title="Air Quality (Daily Avg)"
              icon={<Activity className="w-4 h-4 text-emerald-400" />}
              value={`AQI ${dailyAqi}`}
              subtitle={`PM10: ${dailyPm10}`}
              description={`PM2.5: ${dailyPm25} | CO: ${dailyCo} | NO2: ${dailyNo2}`}
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <HourlyChart data={hourlyChartData} dataKey="temperature" color="#fbbf24" unit={tempSymbol} title="Temperature" />
            <HourlyChart data={hourlyChartData} dataKey="humidity" color="#60a5fa" unit="%" title="Relative Humidity" />
            <HourlyChart data={hourlyChartData} dataKey="precipitation" color="#818cf8" unit="mm" title="Precipitation" />
            <HourlyChart data={hourlyChartData} dataKey="visibility" color="#a78bfa" unit="km" title="Visibility" />
            <HourlyChart data={hourlyChartData} dataKey="windSpeed" color="#2dd4bf" unit="km/h" title="Wind Speed" />
            <HourlyChart data={hourlyChartData} dataKey="pm10" secondaryDataKey="pm2_5" color="#f472b6" secondaryColor="#fb923c" unit="μg/m³" title="PM10 & PM2.5 (Air Quality)" />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CurrentWeatherPage;
