import { Category } from '../types';
import { IMAGE_3_WARM_MOON, IMAGE_8_LIFESTYLE_TABLE } from './productImages';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-moon',
    name: 'Moon Collection',
    slug: 'moon',
    description: 'Astronomically precise topographic 3D lunar lamps with realistic crater textures and circadian warm-to-cool lunar illumination.',
    image: IMAGE_3_WARM_MOON,
    itemCount: 5,
    enabled: true
  },
  {
    id: 'cat-infinity',
    name: 'Infinity Collection',
    slug: 'infinity',
    description: 'Mind-bending architectural coffee tables featuring deep optical beam-splitter glass that creates endless light voids.',
    image: IMAGE_8_LIFESTYLE_TABLE,
    itemCount: 3,
    enabled: true
  }
];
