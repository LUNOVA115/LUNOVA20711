import { InstagramSettings } from '../types';
import { 
  IMAGE_1_GOLD_TABLE, 
  IMAGE_2_BLUE_TABLE, 
  IMAGE_3_WARM_MOON, 
  IMAGE_4_CRATER_MOON, 
  IMAGE_5_LUNAR_SURFACE, 
  IMAGE_7_COOL_WHITE_MOON 
} from './productImages';

const getInitialHandle = (): string => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_INSTAGRAM_HANDLE) {
      return String(import.meta.env.VITE_INSTAGRAM_HANDLE).trim().replace(/^@+/, '');
    }
  } catch {
    // Ignore env error
  }
  return 'lunova.atelier';
};

const getInitialUrl = (handle: string): string => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_INSTAGRAM_URL) {
      return String(import.meta.env.VITE_INSTAGRAM_URL).trim();
    }
  } catch {
    // Ignore env error
  }
  return `https://instagram.com/${handle}`;
};

const getInitialAccountName = (): string => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_INSTAGRAM_NAME) {
      return String(import.meta.env.VITE_INSTAGRAM_NAME).trim();
    }
  } catch {
    // Ignore env error
  }
  return 'LUNOVA | Atmospheric Architecture';
};

const defaultHandle = getInitialHandle();
const defaultProfileUrl = getInitialUrl(defaultHandle);
const defaultAccountName = getInitialAccountName();

export const INITIAL_INSTAGRAM_SETTINGS: InstagramSettings = {
  isConnected: true,
  handle: defaultHandle,
  accountName: defaultAccountName,
  profilePicture: IMAGE_3_WARM_MOON,
  bio: 'Cinematic Astronomical Lighting & Hyper-Depth Optical Furniture. Custom fabricated in titanium, optical glass & NASA cartography.',
  followersCount: 148500,
  postsCount: 184,
  profileUrl: defaultProfileUrl,
  displayFeedOnHome: true,
  displayOnFooter: true,
  displayOnContact: true,
  connectedAt: '2026-04-12T14:32:00Z',
  recentPosts: [
    {
      id: 'ig-post-1',
      mediaUrl: IMAGE_1_GOLD_TABLE,
      caption: 'The descent into infinite light. Custom Golden Abyss Coffee Table hand-calibrated for private penthouse suite in Tribeca. #LUNOVA #InfinityTable #AtmosphericLiving',
      permalink: defaultProfileUrl,
      timestamp: '2026-08-18T10:00:00Z',
      mediaType: 'IMAGE',
      likesCount: 2420,
      commentsCount: 88
    },
    {
      id: 'ig-post-2',
      mediaUrl: IMAGE_3_WARM_MOON,
      caption: '0.2mm tactile topographical relief derived directly from NASA Lunar Reconnaissance Orbiter laser altimetry. Circadian 2400K–6000K warm glow. #MoonLamp #LunarCartography',
      permalink: defaultProfileUrl,
      timestamp: '2026-08-16T18:45:00Z',
      mediaType: 'IMAGE',
      likesCount: 3810,
      commentsCount: 142
    },
    {
      id: 'ig-post-3',
      mediaUrl: IMAGE_2_BLUE_TABLE,
      caption: 'Cyan & Cobalt cascade edition. Zero-refraction optical beam-splitter glass delivering genuine endless optical depth. #ContemporaryDecor #LuxuryLiving',
      permalink: defaultProfileUrl,
      timestamp: '2026-08-14T12:20:00Z',
      mediaType: 'IMAGE',
      likesCount: 1980,
      commentsCount: 64
    },
    {
      id: 'ig-post-4',
      mediaUrl: IMAGE_4_CRATER_MOON,
      caption: 'Tycho and Copernicus crater impact basins illuminated under raking 30° directional rim lighting. #LightingDesign #Architecture',
      permalink: defaultProfileUrl,
      timestamp: '2026-08-12T09:15:00Z',
      mediaType: 'IMAGE',
      likesCount: 2750,
      commentsCount: 95
    },
    {
      id: 'ig-post-5',
      mediaUrl: IMAGE_5_LUNAR_SURFACE,
      caption: 'Macro exploration of the lunar mare basalt planes. Each piece is individually numbered and certified. #BespokeFurniture #CollectorPiece',
      permalink: defaultProfileUrl,
      timestamp: '2026-08-09T16:00:00Z',
      mediaType: 'IMAGE',
      likesCount: 1640,
      commentsCount: 42
    },
    {
      id: 'ig-post-6',
      mediaUrl: IMAGE_7_COOL_WHITE_MOON,
      caption: 'Crisp 6000K daylight lunar full moon phase on solid black walnut architectural pedestal. #ModernSculpture #LUNOVA',
      permalink: defaultProfileUrl,
      timestamp: '2026-08-05T14:30:00Z',
      mediaType: 'IMAGE',
      likesCount: 3120,
      commentsCount: 110
    }
  ]
};
