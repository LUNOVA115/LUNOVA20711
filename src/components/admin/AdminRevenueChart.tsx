import React, { useState } from 'react';
import { TrendingUp, DollarSign, Calendar } from 'lucide-react';

export type TimeRange = '7d' | '30d' | '90d' | '1y';

interface DataPoint {
  date: string;
  revenue: number;
  orders: number;
}

const DATA_SERIES: Record<TimeRange, DataPoint[]> = {
  '7d': [
    { date: '14 Aug', revenue: 14200, orders: 8 },
    { date: '15 Aug', revenue: 19800, orders: 12 },
    { date: '16 Aug', revenue: 16400, orders: 9 },
    { date: '17 Aug', revenue: 23600, orders: 15 },
    { date: '18 Aug', revenue: 28900, orders: 18 },
    { date: '19 Aug', revenue: 34200, orders: 21 },
    { date: '20 Aug', revenue: 41500, orders: 26 },
  ],
  '30d': [
    { date: 'W1 (Jul 25)', revenue: 84200, orders: 48 },
    { date: 'W2 (Aug 1)', revenue: 112500, orders: 64 },
    { date: 'W3 (Aug 8)', revenue: 138000, orders: 79 },
    { date: 'W4 (Aug 15)', revenue: 172400, orders: 96 },
    { date: 'Current (Aug 20)', revenue: 194800, orders: 112 },
  ],
  '90d': [
    { date: 'June', revenue: 380000, orders: 215 },
    { date: 'July', revenue: 495000, orders: 280 },
    { date: 'August (MTD)', revenue: 576900, orders: 327 },
  ],
  '1y': [
    { date: 'Q3 25', revenue: 840000, orders: 490 },
    { date: 'Q4 25', revenue: 1150000, orders: 680 },
    { date: 'Q1 26', revenue: 1290000, orders: 760 },
    { date: 'Q2 26', revenue: 1451900, orders: 840 },
  ]
};

export const AdminRevenueChart: React.FC<{ title?: string; subtitle?: string; defaultRange?: TimeRange }> = ({
  title = "Revenue Overview",
  subtitle = "Interactive telemetry of incoming customer capital & completed transaction volume",
  defaultRange = '30d'
}) => {
  const [timeRange, setTimeRange] = useState<TimeRange>(defaultRange);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const data = DATA_SERIES[timeRange];
  const maxRevenue = Math.max(...data.map(d => d.revenue)) * 1.15;
  const minRevenue = 0;

  const width = 800;
  const height = 240;
  const paddingX = 40;
  const paddingY = 30;

  const getX = (index: number) => {
    return paddingX + (index / (data.length - 1)) * (width - paddingX * 2);
  };

  const getY = (val: number) => {
    const ratio = (val - minRevenue) / (maxRevenue - minRevenue);
    return height - paddingY - ratio * (height - paddingY * 2);
  };

  // Build SVG Path
  const points = data.map((d, i) => `${getX(i)},${getY(d.revenue)}`);
  const linePath = `M ${points.join(' L ')}`;
  const areaPath = `M ${getX(0)},${height - paddingY} L ${points.join(' L ')} L ${getX(data.length - 1)},${height - paddingY} Z`;

  const totalRangeRevenue = data.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalRangeOrders = data.reduce((acc, curr) => acc + curr.orders, 0);

  return (
    <div className="bg-[#121318] border border-zinc-800/80 rounded-3xl p-6 sm:p-7 space-y-6 shadow-xl relative overflow-hidden">
      
      {/* Chart Top Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold uppercase tracking-wider text-white flex items-center space-x-2">
              <span>{title}</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">
              +18.4% vs prev
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            {subtitle}
          </p>
        </div>

        {/* Time Period Filter Pills */}
        <div className="flex items-center space-x-1 bg-zinc-900/90 p-1 rounded-xl border border-zinc-800 self-start sm:self-auto">
          {(['7d', '30d', '90d', '1y'] as TimeRange[]).map((range) => {
            const labels: Record<TimeRange, string> = {
              '7d': '7 Days',
              '30d': '30 Days',
              '90d': '90 Days',
              '1y': '1 Year'
            };
            return (
              <button
                key={range}
                onClick={() => {
                  setTimeRange(range);
                  setHoveredIndex(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  timeRange === range
                    ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {labels[range]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary KPI Mini row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 pb-1 border-b border-zinc-800/60">
        <div>
          <div className="text-[10px] uppercase font-mono text-zinc-500">Period Revenue</div>
          <div className="text-lg sm:text-xl font-bold text-white font-mono mt-0.5">
            Rs. {totalRangeRevenue.toLocaleString()}
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase font-mono text-zinc-500">Completed Orders</div>
          <div className="text-lg sm:text-xl font-bold text-amber-400 font-mono mt-0.5">
            {totalRangeOrders} Orders
          </div>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <div className="text-[10px] uppercase font-mono text-zinc-500">Avg Value / Order</div>
          <div className="text-lg sm:text-xl font-bold text-zinc-300 font-mono mt-0.5">
            Rs. {Math.round(totalRangeRevenue / totalRangeOrders).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Interactive SVG Area Curve */}
      <div className="relative w-full overflow-x-auto">
        <div className="min-w-[600px] sm:min-w-full">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-52 sm:h-64 overflow-visible"
          >
            <defs>
              {/* Warm Terracotta / Copper Gradient */}
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
                <stop offset="60%" stopColor="#d97706" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#b45309" stopOpacity="0.0" />
              </linearGradient>

              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            {[0.25, 0.5, 0.75, 1].map((ratio, i) => {
              const y = height - paddingY - ratio * (height - paddingY * 2);
              const val = Math.round(minRevenue + ratio * (maxRevenue - minRevenue));
              return (
                <g key={i}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={width - paddingX}
                    y2={y}
                    stroke="#27272a"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                  <text
                    x={paddingX - 6}
                    y={y + 3}
                    textAnchor="end"
                    className="text-[10px] font-mono fill-zinc-600"
                  >
                    {val >= 1000 ? `${Math.round(val / 1000)}k` : val}
                  </text>
                </g>
              );
            })}

            {/* Area Fill */}
            <path d={areaPath} fill="url(#areaGradient)" />

            {/* Glowing Line */}
            <path
              d={linePath}
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Interactive Data Dots & Crosshair */}
            {data.map((d, i) => {
              const cx = getX(i);
              const cy = getY(d.revenue);
              const isHovered = hoveredIndex === i;

              return (
                <g 
                  key={i} 
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Vertical Crosshair on hover */}
                  {isHovered && (
                    <line
                      x1={cx}
                      y1={paddingY}
                      x2={cx}
                      y2={height - paddingY}
                      stroke="#f59e0b"
                      strokeWidth="1.5"
                      strokeDasharray="2 2"
                      opacity="0.8"
                    />
                  )}

                  {/* Hit Target */}
                  <circle cx={cx} cy={cy} r="16" fill="transparent" />

                  {/* Visible Dot */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isHovered ? 6 : 4}
                    fill={isHovered ? '#fbbf24' : '#0a0b0e'}
                    stroke={isHovered ? '#ffffff' : '#f59e0b'}
                    strokeWidth={isHovered ? 3 : 2}
                    className="transition-all duration-150"
                  />

                  {/* X Axis Label */}
                  <text
                    x={cx}
                    y={height - 6}
                    textAnchor="middle"
                    className={`text-[10px] font-mono transition-colors ${
                      isHovered ? 'fill-amber-400 font-bold' : 'fill-zinc-500'
                    }`}
                  >
                    {d.date}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Hover Floating Tooltip */}
          {hoveredIndex !== null && (
            <div 
              className="absolute pointer-events-none transition-all duration-150 bg-zinc-950/95 border border-amber-400/50 rounded-xl p-2.5 shadow-2xl z-30 font-mono text-xs text-white ring-1 ring-amber-400/20"
              style={{
                left: `${(getX(hoveredIndex) / width) * 100}%`,
                top: '25%',
                transform: 'translateX(-50%)'
              }}
            >
              <div className="text-[10px] text-zinc-400 uppercase font-semibold">{data[hoveredIndex].date}</div>
              <div className="font-bold text-amber-400 text-sm mt-0.5">
                Rs. {data[hoveredIndex].revenue.toLocaleString()}
              </div>
              <div className="text-[10px] text-emerald-400">
                {data[hoveredIndex].orders} Orders Completed
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
