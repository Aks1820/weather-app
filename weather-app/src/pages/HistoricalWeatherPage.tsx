import { useEffect, useState, useMemo } from 'react';
import { useWeather } from '../context/WeatherContext';
import { fetchHistoricalData, fetchHistoricalAirQuality } from '../services/api';
import HourlyChart from '../components/HourlyChart';
import SunCycleChart from '../components/SunCycleChart';
import { format, subDays, differenceInDays } from 'date-fns';
import { Loader2, AlertCircle } from 'lucide-react';
import { toZonedTime } from 'date-fns-tz';

const HistoricalWeatherPage = () => {
  const { location, loadingLocation, tempUnit } = useWeather();
  const [startDate, setStartDate] = useState<string>(format(subDays(new Date(), 15), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState<string>(format(subDays(new Date(), 1), 'yyyy-MM-dd'));
  
  const [historyData, setHistoryData] = useState<any>(null);
  const [aqiData, setAqiData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!location) return;
    let isMounted = true;
    
    // Validation
    const diff = differenceInDays(new Date(endDate), new Date(startDate));
    if (diff < 0) {
      setError('End date must be after start date.');
      return;
    }
    if (diff > 730) {
      setError('Maximum date range is 2 years (730 days).');
      return;
    }

    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [historical, aqi] = await Promise.all([
          fetchHistoricalData(location.latitude, location.longitude, startDate, endDate),
          fetchHistoricalAirQuality(location.latitude, location.longitude, startDate, endDate)
        ]);
        if (isMounted) {
          setHistoryData(historical);
          setAqiData(aqi);
        }
      } catch (err: any) {
        if (isMounted) setError(err.message || 'Failed to fetch historical data.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    return () => { isMounted = false; };
  }, [location, startDate, endDate]);

  const convertTemp = (tempC: number) => tempUnit === 'F' ? (tempC * 9/5) + 32 : tempC;
  const tempSymbol = `°${tempUnit}`;

  const chartData = useMemo(() => {
    if (!historyData?.daily) return [];
    
    return historyData.daily.time.map((timeStr: string, index: number) => {
      const dayStartIdx = index * 24;
      const dayEndIdx = dayStartIdx + 24;
      const pm10Day = aqiData?.hourly?.pm10?.slice(dayStartIdx, dayEndIdx).filter((v: number) => v !== null && v !== undefined) || [];
      const pm25Day = aqiData?.hourly?.pm2_5?.slice(dayStartIdx, dayEndIdx).filter((v: number) => v !== null && v !== undefined) || [];
      
      const avgPm10 = pm10Day.length ? pm10Day.reduce((a: number,b: number) => a+b, 0) / pm10Day.length : 0;
      const avgPm25 = pm25Day.length ? pm25Day.reduce((a: number,b: number) => a+b, 0) / pm25Day.length : 0;

      // Sun cycle in IST
      let sunriseIST = '--';
      let sunsetIST = '--';
      let sunriseDecimal = 0;
      let sunsetDecimal = 0;
      
      if (historyData.daily.sunrise?.[index]) {
        const sr = new Date(historyData.daily.sunrise[index]);
        const srDate = toZonedTime(sr, 'Asia/Kolkata');
        sunriseIST = format(srDate, 'HH:mm');
        sunriseDecimal = srDate.getHours() + (srDate.getMinutes() / 60);
      }
      if (historyData.daily.sunset?.[index]) {
        const ss = new Date(historyData.daily.sunset[index]);
        const ssDate = toZonedTime(ss, 'Asia/Kolkata');
        sunsetIST = format(ssDate, 'HH:mm');
        sunsetDecimal = ssDate.getHours() + (ssDate.getMinutes() / 60);
      }

      return {
        time: timeStr,
        tempMean: parseFloat(convertTemp(historyData.daily?.temperature_2m_mean?.[index] ?? 0).toFixed(1)),
        tempMax: parseFloat(convertTemp(historyData.daily?.temperature_2m_max?.[index] ?? 0).toFixed(1)),
        tempMin: parseFloat(convertTemp(historyData.daily?.temperature_2m_min?.[index] ?? 0).toFixed(1)),
        precipitation: historyData.daily?.precipitation_sum?.[index] ?? 0,
        windMax: historyData.daily?.wind_speed_10m_max?.[index] ?? 0,
        pm10: parseFloat(avgPm10.toFixed(1)),
        pm2_5: parseFloat(avgPm25.toFixed(1)),
        sunriseIST,
        sunsetIST,
        sunriseDecimal,
        sunsetDecimal
      };
    });
  }, [historyData, aqiData, tempUnit]);

  if (loadingLocation) {
    return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-400" /></div>;
  }

  return (
    <div className="space-y-8 animate-fade-in text-slate-200">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Historical Analysis</h1>
          <p className="text-slate-400">Analyze long-term weather trends over the past 2 years.</p>
        </div>
        <div className="flex items-center space-x-3 bg-slate-800/80 p-2 rounded-xl backdrop-blur-sm border border-slate-700/50">
          <div className="flex flex-col">
            <label className="text-xs text-slate-400 ml-1">Start Date</label>
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent text-sm text-slate-200 focus:outline-none px-1 rounded cursor-pointer"
            />
          </div>
          <span className="text-slate-500 mt-4">-</span>
          <div className="flex flex-col">
            <label className="text-xs text-slate-400 ml-1">End Date</label>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent text-sm text-slate-200 focus:outline-none px-1 rounded cursor-pointer"
            />
          </div>
        </div>
      </header>
      
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {loading && !historyData ? (
         <div className="flex h-64 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-400" /></div>
      ) : historyData && chartData.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <HourlyChart 
              data={chartData} 
              dataKey="tempMean" 
              secondaryDataKey="tempMax" 
              tertiaryDataKey="tempMin" 
              color="#fbbf24" 
              secondaryColor="#f43f5e" 
              tertiaryColor="#818cf8" 
              unit={tempSymbol} 
              title="Temperature (Min, Mean & Max)" 
            />
            <HourlyChart data={chartData} dataKey="precipitation" color="#818cf8" unit="mm" title="Total Precipitation" />
            <HourlyChart data={chartData} dataKey="windMax" color="#2dd4bf" unit="km/h" title="Max Wind Speed" />
            <HourlyChart data={chartData} dataKey="pm10" secondaryDataKey="pm2_5" color="#f472b6" secondaryColor="#fb923c" unit="μg/m³" title="PM10 & PM2.5 (Daily Avg)" />
          </div>

          <div className="w-full">
            <SunCycleChart data={chartData} />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default HistoricalWeatherPage;
