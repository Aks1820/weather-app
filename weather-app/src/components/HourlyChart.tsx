import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  LineChart
} from 'recharts';

interface HourlyChartProps {
  data: any[];
  dataKey: string;
  secondaryDataKey?: string;
  tertiaryDataKey?: string;
  color: string;
  secondaryColor?: string;
  tertiaryColor?: string;
  unit: string;
  title: string;
  formatter?: (value: number) => string;
}

const HourlyChart = ({
  data,
  dataKey,
  secondaryDataKey,
  tertiaryDataKey,
  color,
  secondaryColor = '#94a3b8',
  tertiaryColor = '#64748b',
  unit,
  title,
  formatter = (val: number) => `${val}${unit}`,
}: HourlyChartProps) => {

  const formatName = (key?: string) => {
    if (!key) return '';
    if (key === 'tempMean') return 'Mean';
    if (key === 'tempMax') return 'Max';
    if (key === 'tempMin') return 'Min';
    return key.replace('_', '.').toUpperCase();
  };
  return (
    <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700/60 rounded-2xl p-5 w-full flex flex-col min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pl-2">
        <h3 className="text-slate-300 font-medium text-sm uppercase tracking-wider">{title}</h3>
        {secondaryDataKey && (
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: color }} />
              <span>{formatName(dataKey)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: secondaryColor }} />
              <span>{formatName(secondaryDataKey)}</span>
            </div>
            {tertiaryDataKey && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: tertiaryColor }} />
                <span>{formatName(tertiaryDataKey)}</span>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="w-full h-64 overflow-x-auto overflow-y-hidden custom-scrollbar">
        <div className="min-w-[800px] h-full pr-4">
          <ResponsiveContainer width="100%" height="100%">
            {secondaryDataKey ? (
              <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id={`color-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} minTickGap={30} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                  itemStyle={{ color: '#f8fafc' }}
                  labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                  formatter={(value: any, name: any) => [formatter(value), name]}
                />
                <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={false} activeDot={{ r: 6, fill: color }} name={formatName(dataKey)} />
                <Line type="monotone" dataKey={secondaryDataKey} stroke={secondaryColor} strokeWidth={2} dot={false} activeDot={{ r: 6, fill: secondaryColor }} name={formatName(secondaryDataKey)} />
                {tertiaryDataKey && (
                  <Line type="monotone" dataKey={tertiaryDataKey} stroke={tertiaryColor} strokeWidth={2} dot={false} activeDot={{ r: 6, fill: tertiaryColor }} name={formatName(tertiaryDataKey)} />
                )}
              </LineChart>
            ) : (
              <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id={`color-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} minTickGap={30} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                  itemStyle={{ color: '#color' }}
                  labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                  formatter={(value: any) => [formatter(value), title]}
                />
                <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} fillOpacity={1} fill={`url(#color-${dataKey})`} />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default HourlyChart;
