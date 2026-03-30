import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface SunCycleChartProps {
  data: any[];
}

const formatTime = (decimalHours: number) => {
  const h = Math.floor(decimalHours);
  const m = Math.round((decimalHours - h) * 60);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 || 12;
  return `${displayH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length >= 2) {
    const sunriseObj = payload.find((p: any) => p.dataKey === 'sunriseDecimal');
    const sunsetObj = payload.find((p: any) => p.dataKey === 'sunsetDecimal');
    
    if (!sunriseObj || !sunsetObj) return null;

    return (
      <div className="bg-slate-800 border border-slate-700 p-3 rounded-lg shadow-xl text-sm z-50">
        <p className="font-medium text-slate-200 mb-3 border-b border-slate-700 pb-2">{label}</p>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
          <p className="text-slate-300">Sunrise: <span className="text-amber-400 font-bold ml-1">{formatTime(sunriseObj.value)}</span></p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.6)]" />
          <p className="text-slate-300">Sunset: <span className="text-indigo-400 font-bold ml-1">{formatTime(sunsetObj.value)}</span></p>
        </div>
      </div>
    );
  }
  return null;
};

const SunCycleChart: React.FC<SunCycleChartProps> = ({ data }) => {
  const chartData = data
    .filter(d => d.sunriseDecimal > 0 && d.sunsetDecimal > 0)
    .map(d => ({
      ...d,
      sunriseDecimal: parseFloat(d.sunriseDecimal.toFixed(2)),
      sunsetDecimal: parseFloat(d.sunsetDecimal.toFixed(2))
    }));

  return (
    <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700/60 rounded-2xl p-5 w-full flex flex-col min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pl-2">
        <h3 className="text-slate-300 font-medium text-sm uppercase tracking-wider">Sun Cycle (Sunrise & Sunset Times)</h3>
        <div className="flex items-center gap-4 text-xs font-medium text-slate-300">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
            <span>Sunrise</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.6)]" />
            <span>Sunset</span>
          </div>
        </div>
      </div>
      <div className="w-full h-72 overflow-x-auto overflow-y-hidden custom-scrollbar">
        <div className="min-w-[800px] h-full pr-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 30, bottom: 10, left: -10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis 
                dataKey="time" 
                stroke="#94a3b8" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                dy={10} 
                minTickGap={30} 
              />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                domain={[4, 20]} /* 4 AM to 8 PM range for better zoom */
                ticks={[4, 6, 8, 10, 12, 14, 16, 18, 20]}
                tickFormatter={(val) => {
                  const ampm = val >= 12 ? 'PM' : 'AM';
                  const h = val % 12 || 12;
                  return `${h.toString().padStart(2, '0')}:00 ${ampm}`;
                }}
              />
              <Tooltip 
                content={<CustomTooltip />} 
                cursor={{ stroke: '#475569', strokeWidth: 1, strokeDasharray: '3 3' }} 
              />
              
              <Line 
                name="Sunrise"
                type="monotone" 
                dataKey="sunriseDecimal" 
                stroke="#fbbf24" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#fbbf24', strokeWidth: 0 }} 
                activeDot={{ r: 7, fill: "#fbbf24", stroke: "#fff", strokeWidth: 2 }} 
              />
              <Line 
                name="Sunset"
                type="monotone" 
                dataKey="sunsetDecimal" 
                stroke="#818cf8" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#818cf8', strokeWidth: 0 }} 
                activeDot={{ r: 7, fill: "#818cf8", stroke: "#fff", strokeWidth: 2 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SunCycleChart;
