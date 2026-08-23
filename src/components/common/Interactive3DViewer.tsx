import React, { useState, useRef, useEffect } from 'react';
import { Product } from '../../types';
import { Sparkles, RotateCw, Layers, Compass, Sun, Sliders, Eye, Box, Maximize2, Zap } from 'lucide-react';

interface Interactive3DViewerProps {
  product: Product;
  activeLighting?: string;
  brightness?: number;
}

export const Interactive3DViewer: React.FC<Interactive3DViewerProps> = ({
  product,
  activeLighting = '2700K',
  brightness = 90,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(12);
  const [rotateY, setRotateY] = useState(-18);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [autoRotate, setAutoRotate] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [viewMode, setViewMode] = useState<'3d-render' | '3d-abyss' | '3d-wireframe'>('3d-render');
  const [lightAngle, setLightAngle] = useState(45);
  const [depthIntensity, setDepthIntensity] = useState(70);

  // Auto-rotate tick
  useEffect(() => {
    if (!autoRotate || isDragging) return;
    const interval = setInterval(() => {
      setRotateY((prev) => (prev + 0.6) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, [autoRotate, isDragging]);

  // Pointer drag handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setAutoRotate(false);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    setRotateY((prev) => prev + deltaX * 0.45);
    setRotateX((prev) => Math.max(-60, Math.min(60, prev - deltaY * 0.45)));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const reset3DView = () => {
    setRotateX(12);
    setRotateY(-18);
    setZoom(1);
    setAutoRotate(true);
  };

  const isInfinityTable = product.category.toLowerCase().includes('infinity');
  const isMoonLamp = product.category.toLowerCase().includes('moon');

  // Dynamic light color based on current lighting mode
  const getLightingColor = () => {
    switch (activeLighting) {
      case '6000K':
        return '#38bdf8';
      case 'CYAN':
        return '#06b6d4';
      case 'AMBER':
      case '2700K':
      default:
        return '#f59e0b';
    }
  };

  const lightColor = getLightingColor();

  return (
    <div className="relative w-full rounded-3xl bg-[#06070a] border border-zinc-800/90 overflow-hidden shadow-2xl p-4 sm:p-6 select-none group">
      
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 z-20 relative">
        <div className="flex items-center space-x-2">
          <div className="px-2.5 py-1 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-300 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1.5 shadow-sm">
            <Box className="w-3.5 h-3.5 text-amber-400" />
            <span>Interactive 3D Viewport</span>
          </div>
          <span className="text-[11px] text-zinc-400 font-mono hidden sm:inline">
            Drag to orbit • 360° Inspection
          </span>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center space-x-1 bg-zinc-900/90 p-1 rounded-xl border border-zinc-800 text-[11px]">
          <button
            onClick={() => setViewMode('3d-render')}
            className={`px-2.5 py-1 rounded-lg transition-all font-medium ${
              viewMode === '3d-render'
                ? 'bg-amber-400 text-zinc-950 font-bold shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            3D Studio
          </button>
          <button
            onClick={() => setViewMode('3d-abyss')}
            className={`px-2.5 py-1 rounded-lg transition-all font-medium ${
              viewMode === '3d-abyss'
                ? 'bg-amber-400 text-zinc-950 font-bold shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {isInfinityTable ? 'Infinite Depth' : 'Lunar Relief'}
          </button>
          <button
            onClick={() => setViewMode('3d-wireframe')}
            className={`px-2.5 py-1 rounded-lg transition-all font-medium ${
              viewMode === '3d-wireframe'
                ? 'bg-amber-400 text-zinc-950 font-bold shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Holo Grid
          </button>
        </div>
      </div>

      {/* 3D Canvas Stage */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="relative w-full aspect-square max-h-[480px] flex items-center justify-center cursor-grab active:cursor-grabbing overflow-hidden rounded-2xl bg-radial from-zinc-900/80 via-[#08090d] to-[#030406] border border-white/5"
        style={{ perspective: 1200 }}
      >
        {/* Dynamic Studio Spotlights in 3D Space */}
        <div
          className="absolute w-72 h-72 rounded-full blur-3xl pointer-events-none transition-all duration-300"
          style={{
            background: `radial-gradient(circle, ${lightColor} 0%, transparent 70%)`,
            opacity: (brightness / 100) * 0.4,
            transform: `translate(${Math.sin((lightAngle * Math.PI) / 180) * 120}px, ${Math.cos((lightAngle * Math.PI) / 180) * 80}px)`,
          }}
        />

        {/* 3D Floor Grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            backgroundImage: `radial-gradient(circle at center, rgba(251, 191, 36, 0.15) 0, transparent 70%), linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)`,
            backgroundSize: '100% 100%, 32px 32px, 32px 32px',
            transform: 'rotateX(75deg) translateY(160px) translateZ(-60px)',
            transformOrigin: 'center bottom',
          }}
        />

        {/* The 3D Transformed Entity */}
        <div
          className="relative transition-transform duration-75 ease-out preserve-3d"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${zoom})`,
          }}
        >
          {/* Main 3D High-Res Product Visual */}
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-2xl flex items-center justify-center">
            
            {/* Primary 3D Image with Dynamic Specular Lighting and Depth Shading */}
            <img
              src={product.images[0]}
              alt={product.name}
              referrerPolicy="no-referrer"
              className={`w-full h-full object-contain filter drop-shadow-2xl transition-all duration-300 ${
                viewMode === '3d-wireframe'
                  ? 'brightness-150 contrast-200 invert-[0.15] hue-rotate-180 opacity-85'
                  : ''
              }`}
              style={{
                filter: `drop-shadow(0 25px 35px rgba(0,0,0,0.9)) ${
                  viewMode === '3d-wireframe' ? 'drop-shadow(0 0 15px #38bdf8)' : ''
                }`,
              }}
            />

            {/* Depth Abyss Layer 1 (If Infinity Table or Depth Mode) */}
            {viewMode === '3d-abyss' && isInfinityTable && (
              <>
                <div
                  className="absolute inset-4 border-2 rounded-xl pointer-events-none opacity-80 animate-pulse"
                  style={{
                    borderColor: lightColor,
                    transform: 'translateZ(-40px) scale(0.85)',
                    boxShadow: `0 0 20px ${lightColor}`,
                  }}
                />
                <div
                  className="absolute inset-8 border border-dashed rounded-lg pointer-events-none opacity-60"
                  style={{
                    borderColor: lightColor,
                    transform: 'translateZ(-80px) scale(0.7)',
                    boxShadow: `0 0 30px ${lightColor}`,
                  }}
                />
                <div
                  className="absolute inset-12 border rounded-md pointer-events-none opacity-40"
                  style={{
                    borderColor: lightColor,
                    transform: 'translateZ(-120px) scale(0.55)',
                  }}
                />
              </>
            )}

            {/* Holographic Wireframe Scanner Overlay */}
            {viewMode === '3d-wireframe' && (
              <div
                className="absolute inset-0 rounded-2xl border border-sky-400/40 pointer-events-none"
                style={{
                  background: 'linear-gradient(180deg, rgba(56, 189, 248, 0.15) 0%, transparent 60%)',
                  boxShadow: 'inset 0 0 30px rgba(56, 189, 248, 0.3)',
                }}
              >
                <div className="absolute top-2 left-2 text-[9px] font-mono text-sky-300">
                  VERTEX DENSITY: 124K
                </div>
                <div className="absolute bottom-2 right-2 text-[9px] font-mono text-sky-300">
                  3D MESH CALIBRATED
                </div>
              </div>
            )}

            {/* Specular Glare Reflection on rotation */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none opacity-30 mix-blend-overlay"
              style={{
                background: `linear-gradient(${rotateY * 2}deg, rgba(255,255,255,0.8) 0%, transparent 50%, rgba(255,255,255,0.2) 100%)`,
              }}
            />
          </div>
        </div>

        {/* Live Coordinate Overlay */}
        <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-zinc-950/80 border border-zinc-800/80 font-mono text-[10px] text-zinc-400 backdrop-blur-md flex items-center space-x-2 pointer-events-none">
          <Compass className="w-3 h-3 text-amber-400" />
          <span>Pitch: {Math.round(rotateX)}°</span>
          <span>Yaw: {Math.round(rotateY % 360)}°</span>
        </div>

        {/* Floating Reset & Auto-Rotate Controls */}
        <div className="absolute bottom-3 right-3 flex items-center space-x-1.5 z-20">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2 rounded-xl text-xs font-mono border backdrop-blur-md transition-all ${
              autoRotate
                ? 'bg-amber-400/20 text-amber-300 border-amber-400/40 shadow-sm'
                : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-white'
            }`}
            title={autoRotate ? 'Pause 360° Auto Orbit' : 'Resume 360° Auto Orbit'}
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
          </button>

          <button
            onClick={reset3DView}
            className="px-2.5 py-1.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-[11px] font-mono transition-colors"
          >
            Reset Camera
          </button>
        </div>
      </div>

      {/* Interactive Sliders (Light Angle & Zoom) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 text-xs">
        <div className="flex items-center space-x-2 bg-zinc-900/60 p-2 rounded-xl border border-zinc-800/60">
          <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="text-[11px] text-zinc-400 shrink-0">Light Angle:</span>
          <input
            type="range"
            min="0"
            max="360"
            value={lightAngle}
            onChange={(e) => setLightAngle(Number(e.target.value))}
            className="w-full accent-amber-400 h-1 bg-zinc-800 rounded-lg cursor-pointer"
          />
          <span className="font-mono text-[10px] text-amber-300 w-8 text-right">{lightAngle}°</span>
        </div>

        <div className="flex items-center space-x-2 bg-zinc-900/60 p-2 rounded-xl border border-zinc-800/60">
          <Maximize2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span className="text-[11px] text-zinc-400 shrink-0">3D Zoom:</span>
          <input
            type="range"
            min="0.75"
            max="1.4"
            step="0.05"
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full accent-sky-400 h-1 bg-zinc-800 rounded-lg cursor-pointer"
          />
          <span className="font-mono text-[10px] text-sky-300 w-8 text-right">{Math.round(zoom * 100)}%</span>
        </div>
      </div>

    </div>
  );
};
