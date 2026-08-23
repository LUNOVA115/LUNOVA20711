import { Customer, ProductReview } from '../types';

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-101',
    name: 'Alexander Vance',
    email: 'a.vance@architects.io',
    phone: '+1 (555) 234-8901',
    totalOrders: 4,
    totalSpent: 4890,
    lastOrderDate: '2026-08-14',
    tier: 'VIP',
    joinedDate: '2025-11-10'
  },
  {
    id: 'cust-102',
    name: 'Elena Rostova',
    email: 'elena.rostova@designhaus.com',
    phone: '+1 (555) 876-5432',
    totalOrders: 2,
    totalSpent: 2673,
    lastOrderDate: '2026-08-16',
    tier: 'Gold',
    joinedDate: '2026-01-22'
  },
  {
    id: 'cust-103',
    name: 'Dr. Marcus Sterling',
    email: 'marcus.sterling@quantumlab.org',
    phone: '+1 (555) 432-1098',
    totalOrders: 3,
    totalSpent: 1820,
    lastOrderDate: '2026-08-17',
    tier: 'Gold',
    joinedDate: '2026-02-04'
  },
  {
    id: 'cust-104',
    name: 'Chloe Nakamura',
    email: 'chloe.n@tokyostudio.jp',
    phone: '+81 90-1234-5678',
    totalOrders: 1,
    totalSpent: 1587,
    lastOrderDate: '2026-08-18',
    tier: 'Regular',
    joinedDate: '2026-08-18'
  },
  {
    id: 'cust-105',
    name: 'Julian Montgomery',
    email: 'j.montgomery@skyline.co.uk',
    phone: '+44 20 7946 0912',
    totalOrders: 1,
    totalSpent: 312,
    lastOrderDate: '2026-08-18',
    tier: 'Regular',
    joinedDate: '2026-08-18'
  },
  {
    id: 'cust-106',
    name: 'Seraphina De Luca',
    email: 's.deluca@milano-interiors.it',
    phone: '+39 02 6543 2100',
    totalOrders: 5,
    totalSpent: 7420,
    lastOrderDate: '2026-07-29',
    tier: 'VIP',
    joinedDate: '2025-09-14'
  }
];

export const INITIAL_REVIEWS: ProductReview[] = [
  {
    id: 'rev-01',
    userName: 'David K., Interior Architect',
    rating: 5,
    date: 'August 12, 2026',
    comment: 'The 3D Moon Lamp is hands down the most breathtaking lighting piece in our entire penthouse portfolio. The elevation detail on Mare Tranquillitatis is museum-quality.',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'rev-02',
    userName: 'Sophia Laurent, Milan',
    rating: 5,
    date: 'August 06, 2026',
    comment: 'Our guests literally freeze when they look down into the Golden Infinity Mirror Table. The optical depth is endless and the warm glow creates pure cinema.',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'rev-03',
    userName: 'Kenji Takahashi, Shibuya Gallery',
    rating: 5,
    date: 'July 28, 2026',
    comment: 'The craftsmanship of the metal chassis and optical coatings is unmatched. LUNOVA has redefined what high-end ambient home decor can be.',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80'
  }
];
