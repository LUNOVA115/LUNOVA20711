import { Product } from '../types';
import {
  IMAGE_1_GOLD_TABLE,
  IMAGE_2_BLUE_TABLE,
  IMAGE_3_WARM_MOON,
  IMAGE_4_CRATER_MOON,
  IMAGE_5_LUNAR_SURFACE,
  IMAGE_6_DETAILED_LUNAR,
  IMAGE_7_COOL_WHITE_MOON,
  IMAGE_8_LIFESTYLE_TABLE
} from './productImages';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'Infinity Mirror Coffee Table – Golden',
    slug: 'infinity-mirror-coffee-table-golden',
    category: 'Infinity Collection',
    price: 1280,
    originalPrice: 1450,
    shortDescription: 'Mesmerizing geometric depth illusion with warm incandescent LED column illumination and tempered smoked glass.',
    description: 'The Golden Infinity Mirror Coffee Table is an architectural centerpiece engineered to bend visual perspective. Built with ultra-clear tempered beam-splitter glass and high-grade obsidian anodized framing, it creates an endless descending abyss of warm 2700K golden light. Features smart app dimming, touch capacitive edge switch, and low-thermal aerospace LEDs rated for 50,000+ hours.',
    images: [
      IMAGE_1_GOLD_TABLE,
      IMAGE_8_LIFESTYLE_TABLE,
      IMAGE_2_BLUE_TABLE
    ],
    stock: 14,
    rating: 4.9,
    reviewCount: 48,
    featured: true,
    bestseller: true,
    isFlashDeal: true,
    discountPercentage: 20,
    salePrice: 1160,
    status: 'active',
    dimensions: '90cm × 90cm × 42cm (35.4" × 35.4" × 16.5")',
    material: 'Aerospace-Grade Matte Alloy, Smoked Optical Beam-Splitter Glass',
    powerSource: 'Concealed Magnetic 24V Power Bus / 110-240V AC',
    lightingType: 'Multi-Tiered Architectural LED Array (2700K Warm Tungsten)',
    colorTemperature: 'Warm Amber (2200K – 3000K Adjustable)',
    badge: 'Flagship Edition',
    specifications: [
      { label: 'Optical Depth', value: 'Perceived 2.4-meter infinite depth chamber' },
      { label: 'Glass Rating', value: '10mm Toughened Scratch-Resistant Safety Glass' },
      { label: 'Load Capacity', value: 'Up to 120 kg (265 lbs)' },
      { label: 'Control Method', value: 'Touch bezel & Wireless RF Remote + iOS/Android App' },
      { label: 'Warranty', value: '5-Year Manufacturer Warranty' }
    ],
    inBox: [
      'Golden Infinity Mirror Table Body & Base',
      'Magnetic Low-Profile 24V Power Supply (3m braided cable)',
      'Touch Remote with Brushed Titanium Cradle',
      'Optical Glass Microfiber Care Kit',
      'Certificate of Authenticity'
    ],
    createdAt: '2026-01-15T10:00:00Z',
    priceHistory: [
      { id: 'ph-001-1', date: '2026-01-15', price: 1450, note: 'Initial Launch List Price', changedBy: 'Julian Thorne' },
      { id: 'ph-001-2', date: '2026-03-01', price: 1380, originalPrice: 1450, note: 'Spring Catalog Adjustment', changedBy: 'Elena Vance' },
      { id: 'ph-001-3', date: '2026-05-10', price: 1320, originalPrice: 1450, note: 'Volume Manufacturing Discount', changedBy: 'Julian Thorne' },
      { id: 'ph-001-4', date: '2026-07-01', price: 1280, originalPrice: 1450, salePrice: 1160, note: 'Flash Deal & Price Optimization', changedBy: 'Julian Thorne' }
    ]
  },
  {
    id: 'prod-002',
    name: 'Infinity Mirror Coffee Table – Blue',
    slug: 'infinity-mirror-coffee-table-blue',
    category: 'Infinity Collection',
    price: 1350,
    originalPrice: 1520,
    shortDescription: 'Deep oceanic void illusion with hyper-vibrant cyan and cobalt neon LED cascade rings.',
    description: 'Immerse your space in deep futuristic luminescence. The Electric Blue Infinity Mirror Table combines optical physics with cyberpunk minimalism. Its multi-layer reflective cavity radiates a hypnotic subterranean portal in vivid 460nm cobalt and ice cyan spectrums.',
    images: [
      IMAGE_2_BLUE_TABLE,
      IMAGE_1_GOLD_TABLE,
      IMAGE_8_LIFESTYLE_TABLE
    ],
    stock: 8,
    rating: 4.85,
    reviewCount: 39,
    featured: true,
    bestseller: false,
    status: 'active',
    dimensions: '95cm × 95cm × 40cm (37.4" × 37.4" × 15.7")',
    material: 'Matte Jet Black Steel & Dual-Sided Dielectric Mirrored Glass',
    powerSource: 'Concealed Magnetic 24V Power Supply (110-240V Universal)',
    lightingType: 'Dynamic RGBIC Addressable LED Array (Blue/Cyan Mode)',
    colorTemperature: 'Cyan & Cobalt Neon (450nm – 490nm)',
    badge: 'Limited Run',
    specifications: [
      { label: 'Optical Chamber', value: 'Infinite Reflection Chamber with Anti-glare Film' },
      { label: 'Glass Specs', value: '10mm Ultra-White High Transmission Tempered Glass' },
      { label: 'Modes', value: 'Static Neon, Breathing Pulse, Cosmic Abyss' },
      { label: 'Controls', value: 'Capacitive Corner Sensor + Smart Home (Matter/HomeKit)' },
      { label: 'Weight', value: '38 kg (83.8 lbs)' }
    ],
    inBox: [
      'Electric Blue Infinity Table Assembly',
      'Power Adapter with International Plugs',
      'Smart Sync Bridge Module',
      'LUNOVA Cleaning Kit & Gloves',
      'Numbered Limited Edition Metal Card'
    ],
    createdAt: '2026-02-01T12:00:00Z',
    priceHistory: [
      { id: 'ph-002-1', date: '2026-02-01', price: 1520, note: 'Initial Release List Price', changedBy: 'Elena Vance' },
      { id: 'ph-002-2', date: '2026-04-12', price: 1440, originalPrice: 1520, note: 'Mid-Year Promotion', changedBy: 'Julian Thorne' },
      { id: 'ph-002-3', date: '2026-06-25', price: 1380, originalPrice: 1520, note: 'Material Sourcing Cost Reduction', changedBy: 'Julian Thorne' },
      { id: 'ph-002-4', date: '2026-08-01', price: 1350, originalPrice: 1520, note: 'Active Catalog Standard', changedBy: 'Store Master' }
    ]
  },
  {
    id: 'prod-003',
    name: '3D Moon Lamp – Warm Glow',
    slug: '3d-moon-lamp-warm-glow',
    category: 'Moon Collection',
    price: 289,
    originalPrice: 349,
    shortDescription: 'Topographically accurate NASA-scanned lunar sculpture with warm golden ambient backlight and surface glow.',
    description: 'The centerpiece of the Moon Collection. Derived from ultra-high-resolution Lunar Reconnaissance Orbiter (LRO) topographical elevation maps, this 3D relief captures every real crater, rille, and lunar mare in millimeter precision. Emits a soothing 2400K golden halo that transforms any living room or bedroom into a tranquil cosmic sanctuary.',
    images: [
      IMAGE_3_WARM_MOON,
      IMAGE_4_CRATER_MOON,
      IMAGE_5_LUNAR_SURFACE
    ],
    stock: 22,
    rating: 4.95,
    reviewCount: 114,
    featured: true,
    bestseller: true,
    isFlashDeal: true,
    discountPercentage: 30,
    salePrice: 244,
    status: 'active',
    dimensions: '60cm Diameter × 4.5cm Depth (23.6" × 1.8")',
    material: 'High-Density Mineral Composite & Matte Obsidian Metal Ring',
    powerSource: 'Low-Voltage USB-C or Direct Hardwire Option (100-240V)',
    lightingType: 'Dual-Zone Backlit Perimeter + Inner Diffused Lunar Core',
    colorTemperature: 'Warm Sunset Amber (2200K – 2800K)',
    badge: 'Hero Piece',
    specifications: [
      { label: 'Lunar Elevation Accuracy', value: '0.2mm 3D Topographic CNC Laser Relief' },
      { label: 'Dimming Range', value: '1% – 100% Smooth Step-less Stepless Dimming' },
      { label: 'Mounting', value: 'Zero-gap Flush Wall Bracket or Magnetic Table Stand' },
      { label: 'Power Consumption', value: '18W Max at 100% Output' },
      { label: 'Color Rendering', value: 'CRI > 95 for True Atmospheric Luminescence' }
    ],
    inBox: [
      '3D Moon Lamp (Warm Glow Edition)',
      'Precision Flush Wall Mounting Kit & Template',
      'Braided Dark Weave USB-C Power Cable (3m)',
      'Touch Dial Controller with Magnetic Base',
      'Lunar Map Exploration Booklet'
    ],
    createdAt: '2026-01-08T08:00:00Z',
    priceHistory: [
      { id: 'ph-003-1', date: '2026-01-08', price: 349, note: 'Initial Catalog Launch', changedBy: 'Julian Thorne' },
      { id: 'ph-003-2', date: '2026-03-15', price: 329, originalPrice: 349, note: 'Early Spring Special', changedBy: 'Elena Vance' },
      { id: 'ph-003-3', date: '2026-05-20', price: 305, originalPrice: 349, note: 'Bulk Production Efficiency', changedBy: 'Julian Thorne' },
      { id: 'ph-003-4', date: '2026-07-15', price: 289, originalPrice: 349, salePrice: 244, note: 'Flash Deal Price Adjustment', changedBy: 'Julian Thorne' }
    ]
  },
  {
    id: 'prod-004',
    name: 'Crater Moon Lamp',
    slug: 'crater-moon-lamp',
    category: 'Moon Collection',
    price: 320,
    originalPrice: 380,
    shortDescription: 'Deep relief impact basin sculpture featuring Tycho, Copernicus, and Mare Tranquillitatis topography.',
    description: 'Designed for discerning collectors, the Crater Moon Lamp showcases dramatic textural shadows with extreme vertical relief depth. Side-raking internal micro-LEDs illuminate crater walls from low angles, mimicking the real terminator line as viewed through an astronomical telescope.',
    images: [
      IMAGE_4_CRATER_MOON,
      IMAGE_3_WARM_MOON,
      IMAGE_6_DETAILED_LUNAR
    ],
    stock: 17,
    rating: 4.88,
    reviewCount: 62,
    featured: true,
    bestseller: false,
    isFlashDeal: true,
    discountPercentage: 25,
    salePrice: 285,
    status: 'active',
    dimensions: '50cm Diameter × 5cm Depth (19.7" × 2.0")',
    material: 'Textured Lunar Cast Ceramic & Anodized Gunmetal Bezel',
    powerSource: 'Magnetic Quick-Disconnect 12V DC Adapter',
    lightingType: 'Terminator Raking Perimeter Edge LEDs',
    colorTemperature: 'Tungsten Gold (2700K)',
    badge: 'Topographic Series',
    specifications: [
      { label: 'Basin Depth', value: 'Up to 24mm relief variation' },
      { label: 'Lighting Zones', value: 'Independent Rim Halo & Surface Basin Dimming' },
      { label: 'Finish', value: 'Hand-weathered Basalt Matte Texture' },
      { label: 'Certifications', value: 'CE, RoHS, FCC Certified' }
    ],
    inBox: [
      'Crater Moon Lamp Body',
      'Gunmetal Stand & Flush Mount Hardware',
      '12V Adapter with Multi-Region Plug Adapters',
      'User Manual & Calibration Guide'
    ],
    createdAt: '2026-01-20T14:30:00Z',
    priceHistory: [
      { id: 'ph-004-1', date: '2026-01-20', price: 380, note: 'Pre-order Base Price', changedBy: 'Elena Vance' },
      { id: 'ph-004-2', date: '2026-04-05', price: 350, originalPrice: 380, note: 'Quarterly Price Adjustment', changedBy: 'Julian Thorne' },
      { id: 'ph-004-3', date: '2026-06-18', price: 335, originalPrice: 380, note: 'Seasonal Discount', changedBy: 'Julian Thorne' },
      { id: 'ph-004-4', date: '2026-08-05', price: 320, originalPrice: 380, salePrice: 285, note: 'Flash Sale Launch', changedBy: 'Store Master' }
    ]
  },
  {
    id: 'prod-005',
    name: 'Lunar Surface Moon Lamp',
    slug: 'lunar-surface-moon-lamp',
    category: 'Moon Collection',
    price: 340,
    originalPrice: 399,
    shortDescription: 'Astronomical observatory-grade flat lunar disc with multi-chromatic moonlight transitions.',
    description: 'The Lunar Surface Moon Lamp delivers hyper-realistic cartographic precision. Featuring dual-color phosphor LEDs that allow seamless switching between 2700K Warm Golden Harvest Moon and 5000K Crisp Lunar Radiance with memory preset.',
    images: [
      IMAGE_5_LUNAR_SURFACE,
      IMAGE_7_COOL_WHITE_MOON,
      IMAGE_3_WARM_MOON
    ],
    stock: 19,
    rating: 4.92,
    reviewCount: 78,
    featured: false,
    bestseller: true,
    status: 'active',
    dimensions: '70cm Diameter × 4cm Depth (27.5" × 1.6")',
    material: 'Precision Optical Acrylic, Aluminum Alloy Chassis',
    powerSource: 'Hardwired 110-240V or Plug-in Cable',
    lightingType: 'Full-Disc Edge-Lit Holographic Waveguide Array',
    colorTemperature: 'Dual Spectrum: 2700K Warm & 5000K Neutral White',
    badge: 'Dual Tone',
    specifications: [
      { label: 'Optical Waveguide', value: 'Laser-Etched Light Guide Plate (LGP)' },
      { label: 'Lifespan', value: '60,000 Hours Continuous Glow' },
      { label: 'Smart Integration', value: 'Alexa, Google Assistant, Apple Home via WiFi' },
      { label: 'Weight', value: '5.2 kg (11.5 lbs)' }
    ],
    inBox: [
      'Lunar Surface Lamp 70cm',
      'Smart WiFi Controller Module',
      'Heavy Duty Heavy Wall Anchor System',
      'Installation Level & Template'
    ],
    createdAt: '2026-01-25T11:15:00Z',
    priceHistory: [
      { id: 'ph-005-1', date: '2026-01-25', price: 399, note: 'Initial Launch', changedBy: 'Julian Thorne' },
      { id: 'ph-005-2', date: '2026-04-10', price: 370, originalPrice: 399, note: 'Spring Collection Adjustment', changedBy: 'Elena Vance' },
      { id: 'ph-005-3', date: '2026-07-02', price: 340, originalPrice: 399, note: 'Competitive Alignment', changedBy: 'Julian Thorne' }
    ]
  },
  {
    id: 'prod-006',
    name: 'Detailed Lunar Moon Lamp',
    slug: 'detailed-lunar-moon-lamp',
    category: 'Moon Collection',
    price: 295,
    originalPrice: 340,
    shortDescription: 'High-contrast monochrome disc illuminating dark maria seas and glowing impact crater ejecta rays.',
    description: 'An art piece that celebrates the poetic contrast of the lunar landscape. The Detailed Lunar Moon Lamp highlights the ancient basaltic plains of the Ocean of Storms and Sea of Serenity against bright volcanic highlands.',
    images: [
      IMAGE_6_DETAILED_LUNAR,
      IMAGE_5_LUNAR_SURFACE,
      IMAGE_7_COOL_WHITE_MOON
    ],
    stock: 12,
    rating: 4.83,
    reviewCount: 45,
    featured: false,
    bestseller: false,
    status: 'active',
    dimensions: '55cm Diameter × 4cm Depth (21.6" × 1.6")',
    material: 'Monochrome Composite Polymer & Cast Alloy Ring',
    powerSource: '12V DC Adapter (included)',
    lightingType: 'Micro-Grid Backlight with Diffusion Film',
    colorTemperature: 'Crisp Daylight White (5000K)',
    specifications: [
      { label: 'Contrast Ratio', value: '1000:1 Dynamic Visual Contrast' },
      { label: 'Bezel Color', value: 'Satin Midnight Black' },
      { label: 'Control', value: 'Touch Slider Dimmer' }
    ],
    inBox: [
      'Detailed Lunar Moon Lamp',
      'Power Adapter with Inline Dimmer Switch',
      'Drywall & Masonry Screws Kit',
      'Instruction Guide'
    ],
    createdAt: '2026-02-04T09:00:00Z',
    priceHistory: [
      { id: 'ph-006-1', date: '2026-02-04', price: 340, note: 'Initial Launch', changedBy: 'Elena Vance' },
      { id: 'ph-006-2', date: '2026-05-01', price: 315, originalPrice: 340, note: 'Mid-Season Promo', changedBy: 'Julian Thorne' },
      { id: 'ph-006-3', date: '2026-07-20', price: 295, originalPrice: 340, note: 'Catalog Standard Revision', changedBy: 'Store Master' }
    ]
  },
  {
    id: 'prod-007',
    name: 'Cool White Moon Lamp',
    slug: 'cool-white-moon-lamp',
    category: 'Moon Collection',
    price: 280,
    originalPrice: 320,
    shortDescription: 'Pure 6000K frosted crystalline moonlight disc with modern architectural presence.',
    description: 'For modern minimalist and contemporary spaces seeking crisp clarity. The Cool White Moon Lamp emits a striking 6000K ice-white glow that brings the serenity of an Arctic moonlit night into modern lofts and gallery spaces.',
    images: [
      IMAGE_7_COOL_WHITE_MOON,
      IMAGE_6_DETAILED_LUNAR,
      IMAGE_5_LUNAR_SURFACE
    ],
    stock: 15,
    rating: 4.87,
    reviewCount: 51,
    featured: false,
    bestseller: false,
    status: 'active',
    dimensions: '60cm Diameter × 4.2cm Depth (23.6" × 1.6")',
    material: 'Frosted Optical Polymer, Powder-Coated Metal Casing',
    powerSource: 'Universal 110-240V Adapter',
    lightingType: 'Full Perimeter High-Kelvin Frost LEDs',
    colorTemperature: 'Cool Arctic White (6000K – 6500K)',
    badge: 'Contemporary',
    specifications: [
      { label: 'Luminous Flux', value: '1400 Lumens (Dimmable down to 20 lm)' },
      { label: 'Energy Class', value: 'A++ Eco-Efficient' },
      { label: 'Flicker Free', value: 'Zero PWM Flicker (< 0.1%) for Eye Comfort' }
    ],
    inBox: [
      'Cool White Moon Lamp',
      'Sleek Mounting Ring Bracket',
      'Low-Profile Transparent Power Lead',
      'Remote Controller'
    ],
    createdAt: '2026-02-08T16:20:00Z',
    priceHistory: [
      { id: 'ph-007-1', date: '2026-02-08', price: 320, note: 'Initial Launch', changedBy: 'Julian Thorne' },
      { id: 'ph-007-2', date: '2026-05-15', price: 298, originalPrice: 320, note: 'Component Cost Reduction', changedBy: 'Elena Vance' },
      { id: 'ph-007-3', date: '2026-08-10', price: 280, originalPrice: 320, note: 'Late Summer Adjustment', changedBy: 'Julian Thorne' }
    ]
  },
  {
    id: 'prod-008',
    name: 'Infinity Mirror Coffee Table – Lifestyle',
    slug: 'infinity-mirror-coffee-table-lifestyle',
    category: 'Infinity Collection',
    price: 1650,
    originalPrice: 1890,
    shortDescription: 'Masterpiece architectural slate stone coffee table with deeply recessed bottomless amber infinity illusion.',
    description: 'The pinnacle of LUNOVA craftsmanship. Hand-finished with natural raw stone textural facades and ultra-pure dielectric optical glass, the Lifestyle Edition is custom-proportioned for expansive living spaces, penthouses, and presidential suites. Creates an unforgettable spatial dimension where interior design meets infinite physics.',
    images: [
      IMAGE_8_LIFESTYLE_TABLE,
      IMAGE_1_GOLD_TABLE,
      IMAGE_2_BLUE_TABLE
    ],
    stock: 6,
    rating: 4.98,
    reviewCount: 56,
    featured: true,
    bestseller: true,
    status: 'active',
    dimensions: '110cm × 110cm × 45cm (43.3" × 43.3" × 17.7")',
    material: 'Natural Basalt Slate Veneer, Aviation Aluminum, Diamond-Polish Beam Splitter Glass',
    powerSource: 'Concealed Floor-Pass Inset or Wall Cord (100-240V)',
    lightingType: 'Multi-Chamber Warm Tungsten + Ambient Floor Halo Underglow',
    colorTemperature: 'Warm Amber & Architectural Tungsten (2200K – 3200K)',
    badge: 'Masterpiece Collection',
    specifications: [
      { label: 'Perceived Depth', value: '3.2 meters visual illusion infinity well' },
      { label: 'Dual Lighting', value: 'Independent Top Abyss & Floor Underglow Lighting' },
      { label: 'Glass Durability', value: '12mm Laminated Heavy-Duty Architectural Glass' },
      { label: 'Weight', value: '54 kg (119 lbs)' }
    ],
    inBox: [
      'Infinity Mirror Coffee Table (Lifestyle Edition)',
      'Heavy-Duty Low-Profile Magnetic Power Module',
      'LUNOVA Luxury Metal Remote & Docking Stand',
      'White Glove Cleaning & Surface Protection Kit',
      'Hand-Signed Certificate of Master Artisanship'
    ],
    createdAt: '2026-01-05T09:00:00Z',
    priceHistory: [
      { id: 'ph-008-1', date: '2026-01-05', price: 1890, note: 'Masterpiece Unveiling', changedBy: 'Julian Thorne' },
      { id: 'ph-008-2', date: '2026-03-20', price: 1780, originalPrice: 1890, note: 'Pre-season VIP Tier Discount', changedBy: 'Julian Thorne' },
      { id: 'ph-008-3', date: '2026-06-10', price: 1720, originalPrice: 1890, note: 'Atelier Direct Pricing', changedBy: 'Elena Vance' },
      { id: 'ph-008-4', date: '2026-08-12', price: 1650, originalPrice: 1890, note: 'Catalog Flagship Optimization', changedBy: 'Store Master' }
    ]
  }
];
