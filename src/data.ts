/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Category, Order, Customer, Coupon, GiftHamper, LabCertificateMapping, Supplier, ActivityLog, CMSPage, NDRCase } from './types.ts';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Royal Kashmiri Saffron',
    slug: 'kashmiri-saffron',
    description: 'A grade premium handpicked threads of Kashmiri Crocus sativus.',
    seoTitle: 'Buy Pure Kashmiri Saffron Online - Organic & Handpicked',
    seoDescription: 'Order pure handpicked original Kashmiri Saffron (Lacha & Mongra). Lab certified export grade vacuum packed.',
    productCount: 2
  },
  {
    id: 'cat-2',
    name: 'Raw Forest Honey & Nectars',
    slug: 'raw-honey',
    description: 'Unfiltered, unpasteurized natural honey collected from sustainable apiaries.',
    seoTitle: 'Mono-floral Raw Forest Honey - Unpasteurized, Organic',
    seoDescription: 'Discover pure raw wild cedar, lychee, and Himalayan forest honey with active antioxidant properties.',
    productCount: 2
  },
  {
    id: 'cat-3',
    name: 'Artisanal Cold Pressed Oils',
    slug: 'cold-pressed-oils',
    description: 'Single-estate wood-extruded organic cooking and body oils.',
    seoTitle: 'Premium Cold Pressed & Wood Pressed Oils',
    seoDescription: 'Pure mechanical cold extracted oils without heat or chemical solvents. Safe for cooking and wellness.',
    productCount: 1
  },
  {
    id: 'cat-4',
    name: 'Exclusive Gift Baskets',
    slug: 'gift-boxes',
    description: 'Exquisite custom handwoven gift sets and festive curated hampers.',
    seoTitle: 'Premium E-Commerce Festive Gift Boxes & Hampers',
    seoDescription: 'Exquisitely styled royal hampers with eco-packaging, printed cards, and lab certified raw elements.',
    productCount: 1
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Kashmiri Mongra Saffron (Grade A++)',
    slug: 'kashmiri-mongra-saffron',
    shortDescription: 'Deep crimson handpicked stigma threads of the Crocus Sativus flower.',
    description: 'Sourced directly from the fields of Pampore, Kashmir. Saffron is rich in crocin and picocrocin, which contribute to its famous golden color and characteristic aroma. Packaged in custom airtight visual crystal flasks.',
    category: 'kashmiri-saffron',
    price: 39.99,
    promoPrice: 34.99,
    inventory: 142,
    lowStockThreshold: 15,
    sku: 'KSH-MNG-SFN-01',
    status: 'Active',
    images: [
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400'
    ],
    variants: [
      { id: 'v-1-1', size: '1g', packaging: 'Crystal Vial', sku: 'KSH-MNG-SFN-01G', inventory: 80, lowStockThreshold: 10, price: 34.99 },
      { id: 'v-1-2', size: '5g', packaging: 'Royal Brass Container', sku: 'KSH-MNG-SFN-05G', inventory: 62, lowStockThreshold: 5, price: 159.99 }
    ],
    seoTitle: 'A++ Kashmir Mongra Saffron | Organic Culinary Grade Stigmas',
    seoDescription: 'Indulge in pure Organic Kashmir Saffron Grade 1. Unadulterated, pesticide-free, loaded with rich active crocin.',
    shippingWeight: 0.15,
    shippingDimensions: { length: 12, width: 8, height: 6 },
    hsnCode: '09102010',
    certificates: [
      { id: 'cert-1', name: 'ISO 3632 Saffron Purity Certificate', uploadDate: '2026-02-12', expiryDate: '2027-02-12', status: 'Active', url: '#', version: 2 },
      { id: 'cert-2', name: 'NABL Pesticide-Free Analysis', uploadDate: '2026-03-01', expiryDate: '2026-12-01', status: 'Active', url: '#', version: 1 }
    ],
    updatedAt: '2026-06-15T18:30:00Z',
    supplierId: 'sup-1'
  },
  {
    id: 'prod-2',
    name: 'Wild Himalayan Cedar Honey',
    slug: 'wild-himalayan-cedar-honey',
    shortDescription: 'Dark, highly aromatic mono-floral forest honey with therapeutic value.',
    description: 'Harvested from nests of Apis laboriosa bees in the pristine forests of the Himalayas. Loaded with antioxidants and enzymes, with a rich piney wood notes aftertaste.',
    category: 'raw-honey',
    price: 18.00,
    inventory: 11,
    lowStockThreshold: 20,
    sku: 'HML-CDR-HNY-250',
    status: 'Active',
    images: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=400'
    ],
    variants: [
      { id: 'v-2-1', size: '250g', packaging: 'Glass Jar', sku: 'HML-CDR-HNY-250G', inventory: 11, lowStockThreshold: 10, price: 18.00 },
      { id: 'v-2-2', size: '500g', packaging: 'Glass Jar', sku: 'HML-CDR-HNY-500G', inventory: 0, lowStockThreshold: 10, price: 32.00 }
    ],
    seoTitle: 'Raw Himalayan Cedar Honey | Mono-floral Forest Nectar',
    seoDescription: 'Experience medicinal grade dark forest honey sourced responsibly from the upper Himalayan ranges.',
    shippingWeight: 0.6,
    shippingDimensions: { length: 15, width: 10, height: 10 },
    hsnCode: '04090000',
    certificates: [
      { id: 'cert-3', name: 'FSSAI Heavy Metal Organic Verification', uploadDate: '2025-11-20', expiryDate: '2026-11-20', status: 'Active', url: '#', version: 1 }
    ],
    updatedAt: '2026-06-14T11:00:00Z',
    supplierId: 'sup-2'
  },
  {
    id: 'prod-3',
    name: 'Himalayan Acacia Light Honey',
    slug: 'himalayan-acacia-honey',
    shortDescription: 'Pale, slow-crystallizing clean dessert honey.',
    description: 'Deliciously light and floral, ideal for organic sweetening without overshadowing primary flavors.',
    category: 'raw-honey',
    price: 15.00,
    inventory: 95,
    lowStockThreshold: 10,
    sku: 'HML-ACC-HNY-250',
    status: 'Active',
    images: [
      'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&q=80&w=400'
    ],
    variants: [],
    seoTitle: 'Raw Acacia Honey | Mild Natural Sweetener',
    seoDescription: 'Pale liquid nectar from white acacia black locust blossoms. Pure, raw, non-GMO verified.',
    shippingWeight: 0.55,
    shippingDimensions: { length: 14, width: 9, height: 9 },
    hsnCode: '04090000',
    certificates: [],
    updatedAt: '2026-06-10T09:00:00Z',
    supplierId: 'sup-2'
  },
  {
    id: 'prod-4',
    name: 'Single Estate Cold Pressed Walnut Oil',
    slug: 'cold-pressed-walnut-oil',
    shortDescription: 'Extra virgin, wood-pressed oil from premium organic walnuts.',
    description: 'Perfect for skin nourishment or gourmet dressing. Rich in Omega-3 acids and unsaturated fats. Extracted at temperatures kept safely below 30°C.',
    category: 'cold-pressed-oils',
    price: 24.50,
    inventory: 48,
    lowStockThreshold: 10,
    sku: 'EST-WLN-OIL-100',
    status: 'Active',
    images: [
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=400'
    ],
    variants: [],
    seoTitle: 'Wood Extracted Kashmiri Walnut Oil | Single-Estate Cold Pressed',
    seoDescription: 'Extra virgin premium organic walnut oil. Direct cold press method retains key nutrients and distinct nutty flavour.',
    shippingWeight: 0.35,
    shippingDimensions: { length: 18, width: 6, height: 6 },
    hsnCode: '15159099',
    certificates: [
      { id: 'cert-4', name: 'Agmark Extra Virgin Conformity', uploadDate: '2024-05-18', expiryDate: '2025-05-18', status: 'Expired', url: '#', version: 1 }
    ],
    updatedAt: '2026-06-02T13:42:00Z',
    supplierId: 'sup-1'
  },
  {
    id: 'prod-5',
    name: 'Royal Heritage Festive Box (Gift Edition)',
    slug: 'royal-heritage-festive-box',
    shortDescription: 'Luxury silk-lined pine wood gift chest containing Saffron and Raw Honey.',
    description: 'Contains: 2g Kashmir Mongra Saffron, 1 Glass Vial of Wild Cedar Honey, and 1 Brass Stiffer. Curated visually for special celebrations.',
    category: 'gift-boxes',
    price: 65.00,
    inventory: 35,
    lowStockThreshold: 8,
    sku: 'GFT-RYL-HRTG-01',
    status: 'Draft',
    images: [
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=400'
    ],
    variants: [],
    seoTitle: 'Royal Heritage Festive E-Commerce Gift Set',
    seoDescription: 'Shop our luxury handcrafted pine chests packed with certified organic saffron threads and forest honeys.',
    shippingWeight: 1.25,
    shippingDimensions: { length: 30, width: 20, height: 12 },
    hsnCode: '44201100',
    certificates: [],
    updatedAt: '2026-06-15T20:10:00Z'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Devika Singhania',
    email: 'devika.s@singhaniagroup.com',
    phone: '+91 98765 43210',
    tags: ['VIP', 'Frequently Warm', 'High Basket Value'],
    notes: 'Prefers personal greeting card inserts. High affinity for saffron batches.',
    lifetimeValue: 849.50,
    joinedDate: '2025-02-15',
    ordersCount: 4,
    savedAddresses: [
      { id: 'add-1-1', label: 'Primary Residence', street: 'Penthouse A, Skyline Towers, Sector 45', city: 'Gurgaon', state: 'Haryana', zip: '122002' },
      { id: 'add-1-2', label: 'Corporate Office', street: 'Singhania Towers, Level 14, Golf Course Road', city: 'Gurgaon', state: 'Haryana', zip: '122002' }
    ],
    couponsUsed: [
      { code: 'VIPFESTIVE', date: '2025-10-22', saving: 50.00 },
      { code: 'WELCOME10', date: '2025-02-15', saving: 15.00 }
    ]
  },
  {
    id: 'cust-2',
    name: 'Rohan Mehta',
    email: 'rohanmehta@outlook.com',
    phone: '+91 91234 56789',
    tags: ['Repeat Buyer', 'Gift Hampers'],
    notes: 'Orders gifts frequently. Track carefully to avoid logistics delays.',
    lifetimeValue: 245.00,
    joinedDate: '2025-08-30',
    ordersCount: 2,
    savedAddresses: [
      { id: 'add-2-1', label: 'Home', street: 'Flat 402, Sea Breeze Apts, Worli Seaface', city: 'Mumbai', state: 'Maharashtra', zip: '400030' }
    ],
    couponsUsed: []
  },
  {
    id: 'cust-3',
    name: 'Ananya Raghavan',
    email: 'ananya.ragh@gmail.com',
    phone: '+91 99887 76655',
    tags: ['Organic Enthusiast'],
    notes: 'Enquired about FSSAI details of the Wild Cedar honey.',
    lifetimeValue: 98.00,
    joinedDate: '2026-01-10',
    ordersCount: 1,
    savedAddresses: [
      { id: 'add-3-1', label: 'Home', street: '12, Crescent Orchard, Jayanagar 4th Block', city: 'Bangalore', state: 'Karnataka', zip: '560011' }
    ],
    couponsUsed: [{ code: 'FREESHIP', date: '2026-01-10', saving: 8.00 }]
  },
  {
    id: 'cust-4',
    name: 'Kabir Kapoor',
    email: 'k.kapoor@hotstar.net',
    phone: '+91 97712 34567',
    tags: ['New Customer', 'NDR Candidate'],
    notes: 'Triggered first NDR attempt due to customer unavailable during shoot.',
    lifetimeValue: 125.00,
    joinedDate: '2026-06-01',
    ordersCount: 1,
    savedAddresses: [
      { id: 'add-4-1', label: 'Duplex', street: '74, Gulmohar Enclave, Greater Kailash-II', city: 'New Delhi', state: 'Delhi', zip: '110048' }
    ],
    couponsUsed: []
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: '#ORD-1104',
    customer: { id: 'cust-1', name: 'Devika Singhania', email: 'devika.s@singhaniagroup.com', phone: '+91 98765 43210' },
    shippingAddress: { street: 'Penthouse A, Skyline Towers, Sector 45', city: 'Gurgaon', state: 'Haryana', zip: '122002', country: 'India' },
    items: [
      { id: 'item-1-1', productId: 'prod-1', productName: 'Kashmiri Mongra Saffron (Grade A++)', image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=400', sku: 'KSH-MNG-SFN-05G', variantDetails: 'Size: 5g, Royal Brass Container', price: 159.99, quantity: 2 },
      { id: 'item-1-2', productId: 'prod-2', productName: 'Wild Himalayan Cedar Honey', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=400', sku: 'HML-CDR-HNY-250G', variantDetails: 'Size: 250g, Glass Jar', price: 18.00, quantity: 1 }
    ],
    amount: 337.98,
    taxAmount: 16.90,
    shippingAmount: 0.00,
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Unfulfilled',
    date: '2026-06-15T21:45:00Z',
    notes: 'Include a personalized hand-signed card saying: "Warmest greetings from Baskly Collections, enjoy the Pure Saffron!"',
    timeline: [
      { id: 't-1', date: '21:45, 15 Jun 2026', title: 'Order Standard Placement', desc: 'Placed securely online by buyer Devika Singhania.', user: 'Customer' },
      { id: 't-2', date: '21:45, 15 Jun 2026', title: 'Payment Confirmed', desc: 'Amount of ₹354.88 authenticated via Razorpay Gateway.', user: 'System' }
    ]
  },
  {
    id: '#ORD-1103',
    customer: { id: 'cust-2', name: 'Rohan Mehta', email: 'rohanmehta@outlook.com', phone: '+91 91234 56789' },
    shippingAddress: { street: 'Flat 402, Sea Breeze Apts, Worli Seaface', city: 'Mumbai', state: 'Maharashtra', zip: '400030', country: 'India' },
    items: [
      { id: 'item-2-1', productId: 'prod-1', productName: 'Kashmiri Mongra Saffron (Grade A++)', image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=400', sku: 'KSH-MNG-SFN-01G', variantDetails: 'Size: 1g, Crystal Vial', price: 34.99, quantity: 1 }
    ],
    amount: 34.99,
    taxAmount: 1.75,
    shippingAmount: 5.00,
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Shipped',
    date: '2026-06-14T10:15:00Z',
    notes: 'Wrap in luxury standard packaging.',
    shiprocket: {
      courierName: 'Delhivery - Premium Air',
      awbNumber: 'SR-709841120059',
      trackingStatus: 'In Transit',
      deliveryEta: '2026-06-17',
      logs: [
        { id: 'sl-1', timestamp: '11:00, 14 Jun 2026', status: 'Approved', location: 'Warehousing Hub', activity: 'Shipment scheduled on Shiprocket portal.' },
        { id: 'sl-2', timestamp: '17:30, 14 Jun 2026', status: 'Picked Up', location: 'NCR Sorting Depot', activity: 'Consignment handed over to Delhivery vehicle.' },
        { id: 'sl-3', timestamp: '01:45, 15 Jun 2026', status: 'In Transit', location: 'Delhi Airport Gateway', activity: 'Departed airport for Mumbai hub.' }
      ]
    },
    timeline: [
      { id: 't-3', date: '10:15, 14 Jun 2026', title: 'Order Checked Out', desc: 'Placed by buyer Rohan Mehta.', user: 'Customer' },
      { id: 't-4', date: '11:00, 14 Jun 2026', title: 'Courier Slips Handled', desc: 'Fulfillment processed. Created Shiprocket Shipment ID #SR-1103.', user: 'Admin' },
      { id: 't-5', date: '17:30, 14 Jun 2026', title: 'Manifest Dispatched', desc: 'Picked up by Delhivery agent.', user: 'Logistics' }
    ]
  },
  {
    id: '#ORD-1102',
    customer: { id: 'cust-4', name: 'Kabir Kapoor', email: 'k.kapoor@hotstar.net', phone: '+91 97712 34567' },
    shippingAddress: { street: '74, Gulmohar Enclave, Greater Kailash-II', city: 'New Delhi', state: 'Delhi', zip: '110048', country: 'India' },
    items: [
      { id: 'item-4-1', productId: 'prod-4', productName: 'Single Estate Cold Pressed Walnut Oil', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=400', sku: 'EST-WLN-OIL-100', price: 24.50, quantity: 5 }
    ],
    amount: 122.50,
    taxAmount: 6.12,
    shippingAmount: 0.00,
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Shipped',
    date: '2026-06-13T14:12:00Z',
    shiprocket: {
      courierName: 'Blue Dart - Express',
      awbNumber: 'SR-809184511200',
      trackingStatus: 'In Transit',
      deliveryEta: '2026-06-15',
      logs: [
        { id: 'sl-4', timestamp: '15:00, 13 Jun 2026', status: 'Scheduled', location: 'NCR Warehouse', activity: 'Shipment manifested successfully.' },
        { id: 'sl-5', timestamp: '19:40, 13 Jun 2026', status: 'Picked Up', location: 'Okhla Hub', activity: 'Carrier received parcel.' },
        { id: 'sl-6', timestamp: '11:15, 14 Jun 2026', status: 'Undelivered', location: 'South Delhi Hub', activity: 'First attempt failed. Tag: Customer Not Responding to Calls.' }
      ]
    },
    timeline: [
      { id: 't-6', date: '14:12, 13 Jun 2026', title: 'Placed Online', desc: 'Order logged.', user: 'Customer' },
      { id: 't-7', date: '15:00, 13 Jun 2026', title: 'Fulfill Initiated', desc: 'Shiprocket generated label and printed box slips.', user: 'Inventory Manager' },
      { id: 't-8', date: '11:15, 14 Jun 2026', title: 'NDR Alert Received', desc: 'Blue Dart courier registered an customer-uncontactable event. Shifted case to active NDR board.', user: 'System' }
    ]
  },
  {
    id: '#ORD-1101',
    customer: { id: 'cust-3', name: 'Ananya Raghavan', email: 'ananya.ragh@gmail.com', phone: '+91 99887 76655' },
    shippingAddress: { street: '12, Crescent Orchard, Jayanagar 4th Block', city: 'Bangalore', state: 'Karnataka', zip: '560011', country: 'India' },
    items: [
      { id: 'item-3-1', productId: 'prod-2', productName: 'Wild Himalayan Cedar Honey', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=400', sku: 'HML-CDR-HNY-250G', price: 18.00, quantity: 1 },
      { id: 'item-3-2', productId: 'prod-3', productName: 'Himalayan Acacia Light Honey', image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&q=80&w=400', sku: 'HML-ACC-HNY-250', price: 15.00, quantity: 2 }
    ],
    amount: 48.00,
    taxAmount: 2.40,
    shippingAmount: 0.00,
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Delivered',
    date: '2026-06-10T12:00:00Z',
    shiprocket: {
      courierName: 'Delhivery Standard',
      awbNumber: 'SR-609121855410',
      trackingStatus: 'Delivered',
      deliveryEta: '2026-06-13',
      logs: [
        { id: 'sl-7', timestamp: '15:20, 10 Jun 2026', status: 'Manifested', location: 'Logistics Desk', activity: 'AWB generated online.' },
        { id: 'sl-8', timestamp: '12:15, 13 Jun 2026', status: 'Delivered', location: 'Jayanagar Hub', activity: 'Delivered to resident with OTP verification.' }
      ]
    },
    timeline: [
      { id: 't-9', date: '12:00, 10 Jun 2026', title: 'Purchased', desc: 'Session authenticated.', user: 'Customer' },
      { id: 't-10', date: '12:15, 13 Jun 2026', title: 'Delivered Successfully', desc: 'Customer marked as happy. OTP: 9541.', user: ' delhivery' }
    ]
  }
];

export const INITIAL_NDR_CASES: NDRCase[] = [
  {
    id: 'ndr-1',
    orderNumber: '#ORD-1102',
    customerName: 'Kabir Kapoor',
    customerPhone: '+91 97712 34567',
    dateRaised: '2026-06-14',
    reason: 'Customer Uncontactable (Door Locked / Calls Ringing)',
    attempts: 1,
    lastCustomerResponse: 'Spoke with client on WhatsApp: He requested delivery on Tuesday morning instead under his porch.',
    status: 'Open',
    history: [
      { date: '14 Jun 2026', action: 'Case Opened', remark: 'Blue Dart flagged delivery failure at 11:15 AM.' }
    ]
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'cp-1',
    code: 'WELCOME10',
    type: 'Percentage',
    value: 10,
    rules: { minOrderValue: 20, maxUsage: 1000, currentUsage: 452, expiryDate: '2026-12-31' }
  },
  {
    id: 'cp-2',
    code: 'FESTIVE50',
    type: 'Flat',
    value: 50,
    rules: { minOrderValue: 250, maxUsage: 100, currentUsage: 28, expiryDate: '2026-07-31', customerRestriction: 'VIP' }
  },
  {
    id: 'cp-3',
    code: 'FREESHIP',
    type: 'Free Shipping',
    value: 0,
    rules: { minOrderValue: 40, maxUsage: 500, currentUsage: 120, expiryDate: '2026-09-30' }
  }
];

export const INITIAL_HAMPERS: GiftHamper[] = [
  {
    id: 'hmp-1',
    name: 'Imperial Saffron & Wild Sweet Box',
    price: 85.00,
    discountedPrice: 75.00,
    products: [
      { productId: 'prod-1', quantity: 1 }, // Mongra Saffron
      { productId: 'prod-2', quantity: 2 }  // Cedar Honey
    ],
    packagingType: 'Premium Box',
    giftMessageTemplate: 'To someone special, wishing you health and pure luxury.',
    inventory: 20,
    status: 'Active'
  }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-1',
    name: 'Kashmir Highlands Saffron Orchards',
    contactPerson: 'Bashir Mir Ahmed',
    phone: '+91 94191 00223',
    email: 'contact@kashmirhighlands.org',
    country: 'India',
    address: 'Saffron Boulevard, Pampore, Pulwama, Jammu & Kashmir',
    complianceDocuments: [
      { name: 'NABL Chemical Purity Declaration', type: 'Lab Assay', expiry: '2027-02-12', status: 'Valid' },
      { name: 'FSSAI Regional Processor License', type: 'Regulatory Certification', expiry: '2026-11-30', status: 'Valid' }
    ],
    purchaseHistory: [
      { date: '2026-01-15', value: 8500, sku: 'KSH-MNG-SFN-01G', qty: 250 },
      { date: '2026-05-10', value: 12200, sku: 'KSH-MNG-SFN-05G', qty: 100 }
    ],
    mappedProductIds: ['prod-1', 'prod-4']
  },
  {
    id: 'sup-2',
    name: 'Western Himalayan Organic Apiaries Ltd.',
    contactPerson: 'Sardar Jagminder Singh',
    phone: '+91 88941 12345',
    email: 'jagminder@westernapiary.in',
    country: 'India',
    address: 'Apiary Valley Road, Manali, Himachal Pradesh',
    complianceDocuments: [
      { name: 'Pure Honey Origin Certificate', type: 'Botanical Trace', expiry: '2026-03-10', status: 'Expired' }
    ],
    purchaseHistory: [
      { date: '2026-03-22', value: 3400, sku: 'HML-CDR-HNY-250G', qty: 150 }
    ],
    mappedProductIds: ['prod-2', 'prod-3']
  }
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  { id: 'act-1', timestamp: '2026-06-16T08:15:22Z', user: 'virajptl00@gmail.com', role: 'Super Admin', action: 'Modified price of Variant 5g (Mongra Saffron)', target: 'prod-1', category: 'Product' },
  { id: 'act-2', timestamp: '2026-06-16T07:44:11Z', user: 'inventory_mgr_raj', role: 'Inventory Manager', action: 'Increased stock level for Acacia Light Honey by +45', target: 'prod-3', category: 'Product' },
  { id: 'act-3', timestamp: '2026-06-15T15:20:00Z', user: 'support_sarah', role: 'Customer Support', action: 'Logged customer response update for Kabir Kapoor NDR case', target: 'ndr-1', category: 'Order' },
  { id: 'act-4', timestamp: '2026-06-14T11:00:10Z', user: 'virajptl00@gmail.com', role: 'Super Admin', action: 'Authorized and created VIPFESTIVE coupon rule', target: 'cp-2', category: 'Coupon' }
];

export const INITIAL_CMS_PAGES: CMSPage[] = [
  {
    id: 'cms-1',
    title: 'About Baskly Premium Agronomy',
    slug: 'about-us',
    content: '<h1>Our Legacy of Purity</h1><p>Since 1985, we have worked directly with farm co-operatives in the Himalayan ranges and J&K plains to source the highest quality ingredients. Every single jar is lab certified for purity, heavy-metals, and trace allergens.</p>',
    status: 'Published',
    seoTitle: 'Our Saffron & Honey Legacy | Baskly Premium',
    seoDescription: 'Discover how Baskly curates top tier hand-picked spices, mono-floral raw forest nectar, and cold pressed single-estate oils.',
    updatedAt: '2026-06-10T12:00:00Z',
    version: 3
  },
  {
    id: 'cms-2',
    title: 'FAQs on Certifications',
    slug: 'purity-faq',
    content: '<h2>Lab Certifications & ISO Standards</h2><p>Our customers deserve full transparency. We map active lab batches directly to our products page. This FAQ addresses how to read Saffron ISO-3632 indices and honey botanical markers.</p>',
    status: 'Draft',
    seoTitle: 'Certifications FAQ - Uncompromised Quality Assurance',
    seoDescription: 'Learn about our rigorous ISO-3632 Saffron grading, heavy-metal pesticide assays and botanical purity verification reports.',
    updatedAt: '2026-06-15T10:14:00Z',
    version: 1
  }
];
