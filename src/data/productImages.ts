/**
 * Centralized mapping for LUNOVA's Product Images with photorealistic 3D renders
 * and high-fidelity dimensional assets.
 */
import goldTable3D from '../assets/images/gold_table_3d_1787243985418.jpg';
import blueTable3D from '../assets/images/blue_table_3d_1787243999313.jpg';
import warmMoon3D from '../assets/images/warm_moon_lamp_3d_1787244011352.jpg';
import craterMoon3D from '../assets/images/crater_moon_lamp_3d_1787244024356.jpg';
import coolMoon3D from '../assets/images/cool_moon_lamp_3d_1787244036106.jpg';
import heroBg3D from '../assets/images/lunova_logo_hero_bg_1787707939122.jpg';

// Image 1: 3D Infinity Mirror Coffee Table – Golden
export const IMAGE_1_GOLD_TABLE = goldTable3D;

// Image 2: 3D Infinity Mirror Coffee Table – Blue
export const IMAGE_2_BLUE_TABLE = blueTable3D;

// Image 3: 3D Moon Lamp – Warm Glow
export const IMAGE_3_WARM_MOON = warmMoon3D;

// Image 4: 3D Crater Moon Lamp
export const IMAGE_4_CRATER_MOON = craterMoon3D;

// Image 5: 3D Lunar Surface Moon Lamp
export const IMAGE_5_LUNAR_SURFACE = craterMoon3D;

// Image 6: 3D Detailed Lunar Moon Lamp
export const IMAGE_6_DETAILED_LUNAR = warmMoon3D;

// Image 7: 3D Cool White Moon Lamp
export const IMAGE_7_COOL_WHITE_MOON = coolMoon3D;

// Image 8: 3D Infinity Mirror Table Lifestyle
export const IMAGE_8_LIFESTYLE_TABLE = goldTable3D;

// Official LUNOVA Hero Background Image
export const IMAGE_HERO_BG = heroBg3D;

export const PRODUCT_IMAGE_MAP: Record<string, string> = {
  'image-1': IMAGE_1_GOLD_TABLE,
  'image-2': IMAGE_2_BLUE_TABLE,
  'image-3': IMAGE_3_WARM_MOON,
  'image-4': IMAGE_4_CRATER_MOON,
  'image-5': IMAGE_5_LUNAR_SURFACE,
  'image-6': IMAGE_6_DETAILED_LUNAR,
  'image-7': IMAGE_7_COOL_WHITE_MOON,
  'image-8': IMAGE_8_LIFESTYLE_TABLE,
  'hero-bg': IMAGE_HERO_BG,
};

/**
 * Resolves any product image string (whether a dev path, prod hashed path, base64 data URL, or external link)
 * to its correct, current runtime representation.
 */
export const resolveProductImage = (imgSrc: string): string => {
  if (!imgSrc || typeof imgSrc !== 'string') return '';
  
  const trimmed = imgSrc.trim();
  if (!trimmed) return '';

  // Direct map check
  if (PRODUCT_IMAGE_MAP[trimmed]) {
    return PRODUCT_IMAGE_MAP[trimmed];
  }

  // If it's a base64 string, blob, or external URL, return as-is
  if (
    trimmed.startsWith('data:') || 
    trimmed.startsWith('http://') || 
    trimmed.startsWith('https://') || 
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }
  
  const lower = trimmed.toLowerCase();

  if (lower.includes('hero_bg') || lower.includes('lunova_hero') || lower.includes('hero-bg')) {
    return IMAGE_HERO_BG;
  }
  
  // Map keywords or paths to the imported active build-resolved asset variables
  if (lower.includes('gold_table_3d') || lower.includes('gold-table') || lower.includes('image-1') || lower.includes('image-8') || lower.includes('lifestyle')) {
    return IMAGE_1_GOLD_TABLE;
  }
  if (lower.includes('blue_table_3d') || lower.includes('blue-table') || lower.includes('image-2')) {
    return IMAGE_2_BLUE_TABLE;
  }
  if (lower.includes('warm_moon_lamp_3d') || lower.includes('warm-moon') || lower.includes('image-3') || lower.includes('image-6')) {
    return IMAGE_3_WARM_MOON;
  }
  if (lower.includes('crater_moon_lamp_3d') || lower.includes('crater-moon') || lower.includes('image-4') || lower.includes('image-5')) {
    return IMAGE_4_CRATER_MOON;
  }
  if (lower.includes('cool_moon_lamp_3d') || lower.includes('cool-moon') || lower.includes('image-7')) {
    return IMAGE_7_COOL_WHITE_MOON;
  }
  
  return trimmed;
};

