import React, { useState, useMemo } from 'react';
import { Product, PriceHistoryRecord } from '../../types';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Tag, User, AlertCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface PriceHistoryChartProps {
  product: Product;
  height?: number;
  showStats?: boolean;
}

export const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({
  product,
  height = 240,
  showStats = true
}) => {
  const { formatPrice } = useStore();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Parse and sort history chronologically
  const historyData: PriceHistoryRecord[] = useMemo(() => {
    let raw = product.priceHistory || [];
    
    // Fallback if priceHistory is empty: construct points from createdAt and current price
    if (raw.length === 0) {
      const createdDate = product.createdAt ? product.createdAt.split('T')[0] : '2026-01-01';
      const todayDate = new Date().toISOString().split('T')[0];
      const initialPrice = product.originalPrice || Math.round(product.price * 1.15);
      
      raw = [
        {
          id: `ph-${product.id}-initial`,
          date: createdDate,
          price: initialPrice,
          note: 'Initial Catalog Price',
          changedBy: 'System'
        },
        {
          id: `ph-${product.id}-current`,
          date: todayDate,
          price: product.price,
          originalPrice: product.originalPrice,
          salePrice: product.salePrice,
          note: 'Current Active Price',
          changedBy: 'Store Admin'
        }
      ];
    } else if (raw.length === 1) {
      // If only 1 record, add current state as 2nd point for line visualization
      const first = raw[0];
      const todayDate = new Date().toISOString().split('T')[0];
      if (first.date !== todayDate) {
        raw = [
          first,
          {
            id: `ph-${product.id}-now`,
            date: todayDate,
            price: product.price,
            originalPrice: product.originalPrice,
            salePrice: product.salePrice,
            note: 'Current Catalog Price',
            changedBy: 'Active'
          }
        ];
      }
    }

    return [...raw].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [product]);

  // Calculations for graph bounds and statistics
  const prices = historyData.map(d => d.salePrice || d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const startPrice = prices[0];
  const currentPrice = prices[prices.length - 1];
  const netChange = currentPrice - startPrice;
  const percentageChange = startPrice > 0 ? ((netChange / startPrice) * 100).toFixed(1) : '0';

  // Y-axis bounds with padding
  const priceRange = maxPrice - minPrice || currentPrice * 0.2 || 100;
  const yMin = Math.max(0, Math.floor((minPrice - priceRange * 0.15) / 10) * 10);
  const yMax = Math.ceil((maxPrice + priceRange * 0.15) / 10) * 10;

  const width = 760;
  const paddingX = 45;
  const paddingY = 30;

  const getX = (index: number) => {
    if (historyData.length <= 1) return width / 2;
    return paddingX + (index / (historyData.length - 1)) * (width - paddingX * 2);
  };

  const getY = (priceVal: number) => {
    if (yMax === yMin) return height / 2;
    const ratio = (priceVal - yMin) / (yMax - yMin);
    return height - paddingY - ratio * (height - paddingY * 2);
  };

  // Build SVG Paths
  const points = historyData.map((d, i) => `${getX(i)},${getY(d.salePrice || d.price)}`);
  const linePath = `M ${points.join(' L ')}`;
  const areaPath = `M ${getX(0)},${height - paddingY} L ${points.join(' L ')} L ${getX(historyData.length - 1)},${height - paddingY} Z`;

  // Format date helper
  const formatDateLabel = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('T')[0].split('-');
      if (parts.length === 3) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthIdx = parseInt(parts[1], 10) - 1;
        return `${months[monthIdx] || parts[1]} ${parts[2]}`;
      }
    } catch {}
    return dateStr;
  };

  return (
    <div className="space-y-4">
      {showStats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Active Price */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-3.5 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Current Price</span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-base font-extrabold text-white font-mono">{formatPrice(currentPrice)}</span>
              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${netChange <= 0 ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'}`}>
                {netChange <= 0 ? '↓' : '↑'} {Math.abs(Number(percentageChange))}%
              </span>
            </div>
          </div>

          {/* Highest Price */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-3.5 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Historical Peak</span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-base font-extrabold text-amber-300 font-mono">{formatPrice(maxPrice)}</span>
              <span className="text-[10px] font-mono text-zinc-400">Max</span>
            </div>
          </div>

          {/* Lowest Price */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-3.5 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Historical Low</span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-base font-extrabold text-emerald-400 font-mono">{formatPrice(minPrice)}</span>
              <span className="text-[10px] font-mono text-zinc-400">Min</span>
            </div>
          </div>

          {/* Total Adjustments */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-3.5 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Adjustments Logged</span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-base font-extrabold text-amber-400 font-mono">{historyData.length} Logs</span>
              <span className="text-[10px] font-mono text-zinc-400">Total</span>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Line Chart Canvas */}
      <div className="relative bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-4 overflow-hidden shadow-inner">
        
        {/* Y-Axis Label overlays */}
        <div className="absolute left-3 top-3 bottom-8 flex flex-col justify-between text-[9px] font-mono text-zinc-400 pointer-events-none z-10">
          <span>{formatPrice(yMax)}</span>
          <span>{formatPrice((yMax + yMin) / 2)}</span>
          <span>{formatPrice(yMin)}</span>
        </div>

        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          <defs>
            <linearGradient id={`price-gradient-${product.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
              <stop offset="60%" stopColor="#d97706" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
            </linearGradient>
            <filter id={`glow-${product.id}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Horizontal Grid lines */}
          <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="#27272a" strokeDasharray="3 3" />
          <line x1={paddingX} y1={(height - paddingY * 2) / 2 + paddingY} x2={width - paddingX} y2={(height - paddingY * 2) / 2 + paddingY} stroke="#27272a" strokeDasharray="3 3" />
          <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="#3f3f46" strokeWidth={1} />

          {/* Area Fill */}
          <path d={areaPath} fill={`url(#price-gradient-${product.id})`} />

          {/* Main Price Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#fbbf24"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={`url(#glow-${product.id})`}
          />

          {/* Data Points */}
          {historyData.map((d, index) => {
            const x = getX(index);
            const val = d.salePrice || d.price;
            const y = getY(val);
            const isHovered = hoveredIndex === index;

            return (
              <g key={d.id || index} className="cursor-pointer">
                {/* Vertical guide line on hover */}
                {isHovered && (
                  <line
                    x1={x}
                    y1={paddingY}
                    x2={x}
                    y2={height - paddingY}
                    stroke="#fbbf24"
                    strokeWidth={1}
                    strokeDasharray="2 2"
                  />
                )}

                {/* Outer pulse circle */}
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 8 : 5}
                  className="fill-amber-400 stroke-zinc-950 transition-all duration-200"
                  strokeWidth={2}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />

                {/* Inner dot */}
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 3 : 2}
                  className="fill-zinc-950 pointer-events-none"
                />

                {/* X-Axis Date label */}
                <text
                  x={x}
                  y={height - 8}
                  textAnchor="middle"
                  className={`text-[9px] font-mono fill-zinc-400 transition-colors ${isHovered ? 'fill-amber-300 font-bold' : ''}`}
                >
                  {formatDateLabel(d.date)}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Card */}
        {hoveredIndex !== null && historyData[hoveredIndex] && (
          <div
            className="absolute top-3 right-4 bg-zinc-900 border border-amber-400/40 rounded-xl p-3 shadow-xl backdrop-blur-md text-xs space-y-1.5 z-20 pointer-events-none animate-fadeIn"
          >
            <div className="flex items-center justify-between space-x-3 text-[10px] font-mono text-zinc-400 pb-1 border-b border-zinc-800">
              <span className="flex items-center space-x-1">
                <Calendar className="w-3 h-3 text-amber-400" />
                <span>{historyData[hoveredIndex].date}</span>
              </span>
              {historyData[hoveredIndex].changedBy && (
                <span className="flex items-center space-x-1 text-zinc-400">
                  <User className="w-2.5 h-2.5 text-zinc-400" />
                  <span>{historyData[hoveredIndex].changedBy}</span>
                </span>
              )}
            </div>

            <div className="flex items-baseline space-x-2">
              <span className="text-sm font-extrabold text-amber-300 font-mono">
                {formatPrice(historyData[hoveredIndex].salePrice || historyData[hoveredIndex].price)}
              </span>
              {historyData[hoveredIndex].originalPrice && (
                <span className="text-[10px] text-zinc-500 line-through font-mono">
                  {formatPrice(historyData[hoveredIndex].originalPrice!)}
                </span>
              )}
            </div>

            {historyData[hoveredIndex].note && (
              <p className="text-[11px] text-zinc-300 font-sans italic bg-zinc-950/60 px-2 py-1 rounded border border-zinc-800">
                "{historyData[hoveredIndex].note}"
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
