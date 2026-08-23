import { Order } from '../types';
import { IMAGE_3_WARM_MOON, IMAGE_1_GOLD_TABLE, IMAGE_8_LIFESTYLE_TABLE, IMAGE_2_BLUE_TABLE, IMAGE_4_CRATER_MOON } from './productImages';

// Realistic styled sample Easypaisa receipt data URL for immediate preview
export const SAMPLE_EASYPAISA_RECEIPT_1 = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="850" viewBox="0 0 600 850" fill="none">
  <rect width="600" height="850" rx="24" fill="%230f172a"/>
  <rect x="20" y="20" width="560" height="810" rx="18" fill="%23022c22" stroke="%2310b981" stroke-width="2"/>
  <circle cx="300" cy="110" r="45" fill="%23059669"/>
  <path d="M285 110L295 120L318 97" stroke="white" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="300" y="190" text-anchor="middle" fill="%2334d399" font-size="24" font-family="sans-serif" font-weight="bold">easypaisa</text>
  <text x="300" y="225" text-anchor="middle" fill="%23ffffff" font-size="28" font-family="sans-serif" font-weight="bold">Transaction Successful</text>
  <text x="300" y="255" text-anchor="middle" fill="%2394a3b8" font-size="14" font-family="sans-serif">Sent to LUNOVA LUXURY LIGHTING</text>
  
  <rect x="50" y="280" width="500" height="100" rx="14" fill="%23064e3b"/>
  <text x="300" y="325" text-anchor="middle" fill="%2394a3b8" font-size="14" font-family="sans-serif">Amount Transferred</text>
  <text x="300" y="365" text-anchor="middle" fill="%2334d399" font-size="34" font-family="sans-serif" font-weight="bold">PKR 89,450.00</text>
  
  <line x1="50" y1="410" x2="550" y2="410" stroke="%23047857" stroke-dasharray="6 6"/>
  
  <g font-family="sans-serif" font-size="15">
    <text x="70" y="450" fill="%2394a3b8">Receiver Account</text>
    <text x="530" y="450" text-anchor="end" fill="%23ffffff" font-weight="600">0345-8921470</text>
    
    <text x="70" y="495" fill="%2394a3b8">Account Title</text>
    <text x="530" y="495" text-anchor="end" fill="%23ffffff" font-weight="600">LUNOVA DESIGN STUDIO</text>
    
    <text x="70" y="540" fill="%2394a3b8">Transaction ID (TRX)</text>
    <text x="530" y="540" text-anchor="end" fill="%2338bdf8" font-weight="bold">EP-9831049281</text>
    
    <text x="70" y="585" fill="%2394a3b8">Date &amp; Time</text>
    <text x="530" y="585" text-anchor="end" fill="%23ffffff">19 Aug 2026, 02:45 PM</text>
    
    <text x="70" y="630" fill="%2394a3b8">Fee &amp; Taxes</text>
    <text x="530" y="630" text-anchor="end" fill="%2334d399">PKR 0.00 (Free)</text>
    
    <text x="70" y="675" fill="%2394a3b8">Sender Name</text>
    <text x="530" y="675" text-anchor="end" fill="%23ffffff" font-weight="600">Hamza Tariq Khan</text>
  </g>
  
  <rect x="50" y="720" width="500" height="70" rx="12" fill="%230f172a" stroke="%23334155"/>
  <text x="300" y="750" text-anchor="middle" fill="%2338bdf8" font-size="13" font-family="sans-serif" font-weight="600">VERIFIED EASYPAISA RECEIPT</text>
  <text x="300" y="772" text-anchor="middle" fill="%2364748b" font-size="11" font-family="sans-serif">Digital Confirmation Attached for Order Verification</text>
</svg>`;

export const SAMPLE_EASYPAISA_RECEIPT_2 = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="850" viewBox="0 0 600 850" fill="none">
  <rect width="600" height="850" rx="24" fill="%230f172a"/>
  <rect x="20" y="20" width="560" height="810" rx="18" fill="%23022c22" stroke="%2310b981" stroke-width="2"/>
  <circle cx="300" cy="110" r="45" fill="%23059669"/>
  <path d="M285 110L295 120L318 97" stroke="white" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="300" y="190" text-anchor="middle" fill="%2334d399" font-size="24" font-family="sans-serif" font-weight="bold">easypaisa</text>
  <text x="300" y="225" text-anchor="middle" fill="%23ffffff" font-size="28" font-family="sans-serif" font-weight="bold">Money Sent Successfully</text>
  <text x="300" y="255" text-anchor="middle" fill="%2394a3b8" font-size="14" font-family="sans-serif">Payment for 3D Moon Lamp Order</text>
  
  <rect x="50" y="280" width="500" height="100" rx="14" fill="%23064e3b"/>
  <text x="300" y="325" text-anchor="middle" fill="%2394a3b8" font-size="14" font-family="sans-serif">Total Transferred</text>
  <text x="300" y="365" text-anchor="middle" fill="%2334d399" font-size="34" font-family="sans-serif" font-weight="bold">PKR 38,500.00</text>
  
  <line x1="50" y1="410" x2="550" y2="410" stroke="%23047857" stroke-dasharray="6 6"/>
  
  <g font-family="sans-serif" font-size="15">
    <text x="70" y="450" fill="%2394a3b8">Recipient Mobile</text>
    <text x="530" y="450" text-anchor="end" fill="%23ffffff" font-weight="600">0345-8921470</text>
    
    <text x="70" y="495" fill="%2394a3b8">Recipient Title</text>
    <text x="530" y="495" text-anchor="end" fill="%23ffffff" font-weight="600">LUNOVA LIGHTING DESIGN</text>
    
    <text x="70" y="540" fill="%2394a3b8">TRX Reference ID</text>
    <text x="530" y="540" text-anchor="end" fill="%2338bdf8" font-weight="bold">EP-7740192834</text>
    
    <text x="70" y="585" fill="%2394a3b8">Date</text>
    <text x="530" y="585" text-anchor="end" fill="%23ffffff">18 Aug 2026, 11:20 AM</text>
    
    <text x="70" y="630" fill="%2394a3b8">Status</text>
    <text x="530" y="630" text-anchor="end" fill="%2334d399" font-weight="bold">Completed</text>
    
    <text x="70" y="675" fill="%2394a3b8">Sender</text>
    <text x="530" y="675" text-anchor="end" fill="%23ffffff" font-weight="600">Zainab Malik</text>
  </g>
  
  <rect x="50" y="720" width="500" height="70" rx="12" fill="%230f172a" stroke="%23334155"/>
  <text x="300" y="750" text-anchor="middle" fill="%2338bdf8" font-size="13" font-family="sans-serif" font-weight="600">DIGITAL SLIP VERIFICATION</text>
  <text x="300" y="772" text-anchor="middle" fill="%2364748b" font-size="11" font-family="sans-serif">Direct Easypaisa API &amp; Receipt Snapshot Attached</text>
</svg>`;

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-90101',
    customer: {
      name: 'Hamza Tariq Khan',
      email: 'hamza.tariq@lahoredesign.com',
      phone: '+92 300 4821903'
    },
    shippingAddress: {
      fullName: 'Hamza Tariq Khan',
      email: 'hamza.tariq@lahoredesign.com',
      phone: '+92 300 4821903',
      street: 'House 42-B, Sector Z, Phase 6 DHA',
      city: 'Lahore',
      state: 'Punjab',
      postalCode: '54792',
      country: 'Pakistan'
    },
    items: [
      {
        productId: 'prod-001',
        productName: 'Infinity Mirror Coffee Table – Golden',
        productImage: IMAGE_1_GOLD_TABLE,
        price: 1280,
        quantity: 1
      }
    ],
    subtotal: 1280,
    shipping: 0,
    discount: 100,
    tax: 97.35,
    total: 1277.35,
    paymentStatus: 'Pending',
    orderStatus: 'Processing',
    paymentMethod: 'Easypaisa',
    createdAt: '2026-08-19T10:15:00Z',
    transactionId: 'EP-9831049281',
    paymentReceipt: SAMPLE_EASYPAISA_RECEIPT_1,
    paymentNotes: 'Transferred full amount via Easypaisa mobile app from 0300-4821903. Screenshot receipt attached for rapid verification.'
  },
  {
    id: 'ORD-90102',
    customer: {
      name: 'Bilal Ahmed Sheikh',
      email: 'bilal.sheikh@techcorp.pk',
      phone: '+92 321 8840192'
    },
    shippingAddress: {
      fullName: 'Bilal Ahmed Sheikh',
      email: 'bilal.sheikh@techcorp.pk',
      phone: '+92 321 8840192',
      street: 'Apartment 504, Creek Vistas Tower 3, DHA Phase 8',
      city: 'Karachi',
      state: 'Sindh',
      postalCode: '75500',
      country: 'Pakistan'
    },
    items: [
      {
        productId: 'prod-003',
        productName: '3D Moon Lamp – Warm Glow',
        productImage: IMAGE_3_WARM_MOON,
        price: 289,
        quantity: 2
      }
    ],
    subtotal: 578,
    shipping: 0,
    discount: 0,
    tax: 47.68,
    total: 625.68,
    paymentStatus: 'Pending',
    orderStatus: 'Pending',
    paymentMethod: 'Cash on Delivery',
    createdAt: '2026-08-19T08:30:00Z',
    paymentNotes: 'Cash on Delivery requested. Client confirmed via phone; courier will collect payment upon delivery.'
  },
  {
    id: 'ORD-89412',
    customer: {
      name: 'Alexander Vance',
      email: 'a.vance@architects.io',
      phone: '+1 (555) 234-8901'
    },
    shippingAddress: {
      fullName: 'Alexander Vance',
      email: 'a.vance@architects.io',
      phone: '+1 (555) 234-8901',
      street: '742 Evergreen Terr, Penthouse B',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94107',
      country: 'United States'
    },
    items: [
      {
        productId: 'prod-008',
        productName: 'Infinity Mirror Coffee Table – Lifestyle',
        productImage: IMAGE_8_LIFESTYLE_TABLE,
        price: 1650,
        quantity: 1
      },
      {
        productId: 'prod-003',
        productName: '3D Moon Lamp – Warm Glow',
        productImage: IMAGE_3_WARM_MOON,
        price: 289,
        quantity: 2
      }
    ],
    subtotal: 2228,
    shipping: 0,
    discount: 150,
    tax: 166.24,
    total: 2244.24,
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    paymentMethod: 'Credit Card',
    createdAt: '2026-08-14T14:22:00Z',
    trackingNumber: 'LNV-FEDEX-99201488',
    carrier: 'FedEx White Glove'
  },
  {
    id: 'ORD-89413',
    customer: {
      name: 'Zainab Malik',
      email: 'zainab.malik@islamabadarts.org',
      phone: '+92 333 5590214'
    },
    shippingAddress: {
      fullName: 'Zainab Malik',
      email: 'zainab.malik@islamabadarts.org',
      phone: '+92 333 5590214',
      street: 'Villa 14, Street 29, Sector F-7/1',
      city: 'Islamabad',
      state: 'Federal Capital',
      postalCode: '44000',
      country: 'Pakistan'
    },
    items: [
      {
        productId: 'prod-003',
        productName: '3D Moon Lamp – Warm Glow',
        productImage: IMAGE_3_WARM_MOON,
        price: 289,
        quantity: 1
      }
    ],
    subtotal: 289,
    shipping: 0,
    discount: 0,
    tax: 23.84,
    total: 312.84,
    paymentStatus: 'Paid',
    orderStatus: 'Shipped',
    paymentMethod: 'Easypaisa',
    createdAt: '2026-08-18T11:20:00Z',
    trackingNumber: 'LNV-TCS-7740192',
    carrier: 'TCS Express Prime',
    transactionId: 'EP-7740192834',
    paymentReceipt: SAMPLE_EASYPAISA_RECEIPT_2,
    paymentNotes: 'Easypaisa verified and confirmed by Julian (Admin).'
  },
  {
    id: 'ORD-89414',
    customer: {
      name: 'Dr. Marcus Sterling',
      email: 'marcus.sterling@quantumlab.org',
      phone: '+1 (555) 432-1098'
    },
    shippingAddress: {
      fullName: 'Dr. Marcus Sterling',
      email: 'marcus.sterling@quantumlab.org',
      phone: '+1 (555) 432-1098',
      street: '450 Cambridge Park Dr',
      city: 'Cambridge',
      state: 'MA',
      postalCode: '02140',
      country: 'United States'
    },
    items: [
      {
        productId: 'prod-003',
        productName: '3D Moon Lamp – Warm Glow',
        productImage: IMAGE_3_WARM_MOON,
        price: 289,
        quantity: 1
      },
      {
        productId: 'prod-004',
        productName: 'Crater Moon Lamp',
        productImage: IMAGE_4_CRATER_MOON,
        price: 320,
        quantity: 1
      }
    ],
    subtotal: 609,
    shipping: 0,
    discount: 50,
    tax: 44.72,
    total: 603.72,
    paymentStatus: 'Paid',
    orderStatus: 'Processing',
    paymentMethod: 'Credit Card',
    createdAt: '2026-08-17T09:15:00Z',
    trackingNumber: 'LNV-DHL-887123',
    carrier: 'DHL Express'
  },
  {
    id: 'ORD-89415',
    customer: {
      name: 'Farhan Siddiqui',
      email: 'f.siddiqui@lahoredesign.pk',
      phone: '+92 300 8452190'
    },
    shippingAddress: {
      fullName: 'Farhan Siddiqui',
      email: 'f.siddiqui@lahoredesign.pk',
      phone: '+92 300 8452190',
      street: 'House 88, Street 4, DHA Phase 5',
      city: 'Lahore',
      state: 'Punjab',
      postalCode: '54000',
      country: 'Pakistan'
    },
    items: [
      {
        productId: 'prod-001',
        productName: 'Infinity Mirror Coffee Table – Golden',
        productImage: IMAGE_1_GOLD_TABLE,
        price: 1280,
        quantity: 1
      }
    ],
    subtotal: 1280,
    shipping: 0,
    discount: 0,
    tax: 102.40,
    total: 1382.40,
    paymentStatus: 'Pending',
    orderStatus: 'Processing',
    paymentMethod: 'Cash on Delivery',
    createdAt: '2026-08-19T08:15:00Z',
    trackingNumber: 'LNV-LEOPARDS-99210',
    carrier: 'Leopards Courier COD Special',
    paymentNotes: 'Cash on Delivery: Collect Rs. 384,300 upon crate delivery.'
  }
];
