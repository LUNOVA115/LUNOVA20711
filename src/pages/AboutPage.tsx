import React, { useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Sparkles, 
  Compass, 
  Cpu, 
  Moon, 
  Layers, 
  ShieldCheck, 
  Award,
  ArrowRight
} from 'lucide-react';
import { IMAGE_5_LUNAR_SURFACE, IMAGE_8_LIFESTYLE_TABLE } from '../data/productImages';

export const AboutPage: React.FC = () => {
  const { navigate, products } = useStore();

  // Dynamically retrieve product images for each category
  const moonProduct = useMemo(() => {
    return products.find(p => p.category === 'Moon Collection' && p.status === 'active') || products.find(p => p.category === 'Moon Collection');
  }, [products]);

  const infinityProduct = useMemo(() => {
    return products.find(p => p.category === 'Infinity Collection' && p.status === 'active') || products.find(p => p.category === 'Infinity Collection');
  }, [products]);

  const moonImage = moonProduct?.images?.[0] || IMAGE_5_LUNAR_SURFACE;
  const infinityImage = infinityProduct?.images?.[0] || IMAGE_8_LIFESTYLE_TABLE;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-24 text-zinc-100">
      
      {/* Hero Odyssey Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-5">
        <div className="inline-flex items-center space-x-2 text-xs font-mono text-amber-300 uppercase tracking-widest px-3.5 py-1.5 bg-zinc-900 border border-amber-400/30 rounded-full">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>OUR CELESTIAL ODYSSEY</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-light text-white tracking-tight">
          Where Astrophysics Meets Interior Haute Couture.
        </h1>
        <p className="text-base sm:text-lg text-zinc-300 font-light leading-relaxed">
          Founded in 2024 by optical physicists and luxury architectural sculptors, LUNOVA transforms raw scientific telemetry into emotive domestic masterworks.
        </p>
      </div>

      {/* Visual Split Narrative */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-xs uppercase tracking-[0.25em] font-mono text-amber-300 font-bold">
            01 / PRECISION TOPOGRAPHY
          </span>
          <h2 className="text-2xl sm:text-4xl font-light text-white">
            Astronomy You Can Trace With Your Fingertips.
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-light">
            Every contour on our Moon Lamps is mapped with sub-millimeter fidelity using open-source LiDAR and laser altimetry datasets from NASA’s Lunar Reconnaissance Orbiter. From the towering central peaks of Copernicus Crater to the dark smooth basalt of the Sea of Tranquility, you are experiencing the authentic geography of our celestial neighbor.
          </p>
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-xs text-amber-300/90 font-mono">
            "We do not merely make lamps; we cast captured fragments of cosmic history into everyday living environments."
          </div>
        </div>

        <div className="relative aspect-square sm:aspect-[4/3] rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-950 p-3">
          <img
            src={moonImage}
            alt="Lunar Surface Detail Topography"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain rounded-2xl"
          />
        </div>
      </div>

      {/* Optical Physics Narrative */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-square sm:aspect-[4/3] rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-950 p-3 order-last lg:order-first">
          <img
            src={infinityImage}
            alt="Infinity Mirror Optical Physics"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>

        <div className="space-y-6">
          <span className="text-xs uppercase tracking-[0.25em] font-mono text-sky-300 font-bold">
            02 / THE ABYSS EFFECT
          </span>
          <h2 className="text-2xl sm:text-4xl font-light text-white">
            The Physics of Endless Reflection.
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-light">
            Our Infinity Series employs aerospace-grade dielectric beam splitters layered over optical-quality toughened safety glass. By tuning the refractive index and anti-reflective vapor coatings, we create an illusion of bottomless depth that stretches multiple meters into an illuminated geometric void.
          </p>
          <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
              <span className="text-white font-semibold block">99.4% Transmittance</span>
              <span className="text-zinc-400">Zero chromatic aberration</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
              <span className="text-white font-semibold block">Circadian LEDs</span>
              <span className="text-zinc-400">CRI 98+ true color rendering</span>
            </div>
          </div>
        </div>
      </div>

      {/* Core Principles Grid */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-widest font-mono text-amber-400 font-semibold">
            FOUNDATIONAL ETHOS
          </span>
          <h3 className="text-2xl sm:text-3xl font-light text-white">
            The Three Pillars of LUNOVA
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-amber-300 flex items-center justify-center">
              <Moon className="w-5 h-5" />
            </div>
            <h4 className="text-base font-semibold text-white">Astronomical Integrity</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              No generic artistic abstractions. We use real scientific scans to preserve true topographic heights and crater formations.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-amber-300 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="text-base font-semibold text-white">Materials Without Compromise</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Solid aluminum frames, mineral-loaded composite polymers, and sapphire-coated glass engineered to last decades.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-amber-300 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="text-base font-semibold text-white">Numbered Authenticity</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Each piece bears a laser-etched serial registry number and an archival Certificate of Authenticity signed by our master technicians.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center pt-8 border-t border-zinc-900 space-y-5">
        <h3 className="text-2xl font-light text-white">Experience LUNOVA in Your Environment.</h3>
        <button
          onClick={() => navigate('/shop')}
          className="px-8 py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs uppercase tracking-widest font-bold transition-all shadow-xl shadow-amber-400/20"
        >
          Explore Current Vault Holdings
        </button>
      </div>

    </div>
  );
};
