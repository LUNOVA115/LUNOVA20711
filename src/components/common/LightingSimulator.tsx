import React, { useState } from 'react';
import { Sun, Moon, Zap, Sliders, Sparkles } from 'lucide-react';

interface LightingSimulatorProps {
  onLightChange?: (preset: string, intensity: number) => void;
  activeMode?: string;
}

export const LightingSimulator: React.FC<LightingSimulatorProps> = ({
  onLightChange,
  activeMode = '2700K'
}) => {
  const [selectedPreset, setSelectedPreset] = useState<string>(activeMode);
  const [brightness, setBrightness] = useState<number>(85);

  const presets = [
    {
      id: '2200K',
      name: 'Sunset Amber',
      temp: '2200K',
      color: '#f59e0b',
      glow: 'shadow-amber-500/50 text-amber-300 border-amber-500/50',
      description: 'Ultra-warm calming ambiance for evening relaxation and cinema.'
    },
    {
      id: '2700K',
      name: 'Warm Tungsten',
      temp: '2700K',
      color: '#fbbf24',
      glow: 'shadow-amber-400/50 text-amber-200 border-amber-400/50',
      description: 'Flagship architectural warmth mirroring soft incandescent glow.'
    },
    {
      id: '4000K',
      name: 'Neutral Lunar',
      temp: '4000K',
      color: '#f1f5f9',
      glow: 'shadow-slate-300/50 text-white border-slate-300/50',
      description: 'Balanced museum illumination highlighting surface textures.'
    },
    {
      id: '6000K',
      name: 'Arctic White',
      temp: '6000K',
      color: '#38bdf8',
      glow: 'shadow-sky-400/50 text-sky-200 border-sky-400/50',
      description: 'Crisp, high-energy modern radiance for contemporary galleries.'
    },
    {
      id: 'CYAN',
      name: 'Abyss Neon',
      temp: '480nm',
      color: '#06b6d4',
      glow: 'shadow-cyan-400/50 text-cyan-200 border-cyan-400/50',
      description: 'Futuristic sci-fi infinity portal illumination.'
    }
  ];

  const handleSelect = (id: string) => {
    setSelectedPreset(id);
    onLightChange?.(id, brightness);
  };

  const handleBrightnessChange = (val: number) => {
    setBrightness(val);
    onLightChange?.(selectedPreset, val);
  };

  return (
    <div className="bg-zinc-950/80 backdrop-blur-xl border border-zinc-800/90 rounded-2xl p-5 sm:p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-zinc-900 text-amber-300 border border-zinc-800">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase">
              Interactive Ambient Simulator
            </h4>
            <p className="text-xs text-zinc-400">
              Simulate circadian LED color temperatures & luminous output
            </p>
          </div>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 rounded bg-zinc-900 text-amber-300 border border-zinc-800">
          {brightness}% Output
        </span>
      </div>

      {/* Color Temp Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
        {presets.map((p) => {
          const isCurrent = selectedPreset === p.id;
          return (
            <button
              key={p.id}
              onClick={() => handleSelect(p.id)}
              className={`p-3 rounded-xl border text-left transition-all duration-300 flex flex-col justify-between space-y-2 ${
                isCurrent
                  ? `bg-zinc-900 ${p.glow} shadow-lg scale-[1.02]`
                  : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className="w-3 h-3 rounded-full shadow-sm"
                  style={{ backgroundColor: p.color }}
                />
                <span className="text-[10px] font-mono opacity-80">{p.temp}</span>
              </div>
              <div>
                <div className="text-xs font-medium">{p.name}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Dimmer Slider */}
      <div className="space-y-2 pt-2 border-t border-zinc-800/60">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span className="flex items-center space-x-1.5">
            <Sliders className="w-3.5 h-3.5" />
            <span>Luminous Intensity</span>
          </span>
          <span className="font-mono">{brightness}%</span>
        </div>
        <input
          type="range"
          min="10"
          max="100"
          value={brightness}
          onChange={(e) => handleBrightnessChange(Number(e.target.value))}
          className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
        />
      </div>
    </div>
  );
};
