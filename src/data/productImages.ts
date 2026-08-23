/**
 * Centralized mapping for LUNOVA's Product Images with photorealistic 3D renders
 * and high-fidelity dimensional assets.
 */
import goldTable3D from '../assets/images/gold_table_3d_1787243985418.jpg';
import blueTable3D from '../assets/images/blue_table_3d_1787243999313.jpg';
import warmMoon3D from '../assets/images/warm_moon_lamp_3d_1787244011352.jpg';
import craterMoon3D from '../assets/images/crater_moon_lamp_3d_1787244024356.jpg';
import coolMoon3D from '../assets/images/cool_moon_lamp_3d_1787244036106.jpg';

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

export const PRODUCT_IMAGE_MAP: Record<string, string> = {
  'image-1': IMAGE_1_GOLD_TABLE,
  'image-2': IMAGE_2_BLUE_TABLE,
  'image-3': IMAGE_3_WARM_MOON,
  'image-4': IMAGE_4_CRATER_MOON,
  'image-5': IMAGE_5_LUNAR_SURFACE,
  'image-6': IMAGE_6_DETAILED_LUNAR,
  'image-7': IMAGE_7_COOL_WHITE_MOON,
  'image-8': IMAGE_8_LIFESTYLE_TABLE,
};

