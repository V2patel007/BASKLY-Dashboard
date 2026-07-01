/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Variant {
  id: string;
  size?: string;
  weight?: string;
  flavor?: string;
  packaging?: string;
  sku: string;
  inventory: number;
  lowStockThreshold: number;
  price: number;
  costPrice?: number;
}

export interface InventoryHistory {
  id: string;
  date: string;
  delta: number;
  reason: string;
  user: string;
}

export interface LabCertificateMapping {
  id: string;
  name: string;
  uploadDate: string;
  expiryDate: string;
  status: 'Active' | 'Expired' | 'Expiring Soon';
  url: string;
  version: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: string; // matches Category slug or id
  price: number;
  promoPrice?: number;
  inventory: number;
  lowStockThreshold: number;
  sku: string;
  status: 'Active' | 'Draft' | 'Archived';
  images: string[]; // URLs (drag/drop simulates R2 placement)
  variants: Variant[];
  seoTitle: string;
  seoDescription: string;
  ogImage?: string;
  shippingWeight: number; // in kg
  shippingDimensions: { length: number; width: number; height: number };
  hsnCode: string;
  certificates: LabCertificateMapping[];
  updatedAt: string;
  supplierId?: string;
  costPrice?: number;
  shelfLife?: string;
  wholesaleTiers?: { moq: number; discount: number; suggestedPrice: number }[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  parentCategory?: string; // nested level
  bannerUrl?: string; // R2 simulated
  seoTitle: string;
  seoDescription: string;
  productCount: number;
}

export interface ShippingLog {
  id: string;
  timestamp: string;
  status: string;
  location: string;
  activity: string;
}

export interface ShiprocketDetails {
  courierName: string;
  awbNumber: string;
  trackingStatus: 'Pending' | 'Picked Up' | 'In Transit' | 'Out For Delivery' | 'Delivered' | 'RTO' | 'Cancelled';
  deliveryEta: string;
  logs: ShippingLog[];
}

export interface NDRCase {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  dateRaised: string;
  reason: string;
  attempts: number;
  lastCustomerResponse?: string;
  status: 'Open' | 'Action Taken' | 'Retrying' | 'Resolved' | 'Returned to Origin';
  history: { date: string; action: string; remark: string }[];
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  image: string;
  sku: string;
  variantDetails?: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string; // e.g. #ORD-1001
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  items: OrderItem[];
  amount: number;
  taxAmount: number;
  shippingAmount: number;
  paymentStatus: 'Paid' | 'Pending' | 'Refunded' | 'Failed';
  fulfillmentStatus: 'Unfulfilled' | 'Fulfilled' | 'Ready to Ship' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
  shiprocket?: ShiprocketDetails;
  notes?: string;
  timeline: { id: string; date: string; title: string; desc: string; user?: string }[];
}

export interface SavedAddress {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  tags: string[];
  notes: string;
  lifetimeValue: number;
  joinedDate: string;
  ordersCount: number;
  savedAddresses: SavedAddress[];
  couponsUsed: { code: string; date: string; saving: number }[];
  membershipTier?: 'Regular' | 'Silver' | 'Gold' | 'Platinum';
}

export interface Coupon {
  id: string;
  code: string;
  type: 'Percentage' | 'Flat' | 'Free Shipping';
  value: number; // representation base on type
  rules: {
    minOrderValue: number;
    maxUsage: number;
    currentUsage: number;
    expiryDate: string;
    customerRestriction?: string; // CRM tag or 'all'
    productRestriction?: string; // Category or product ID
  };
}

export interface HomeBanner {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
  isActive: boolean;
}

export interface HomeFeaturedSection {
  id: string;
  type: 'grid' | 'carousel' | 'hero-split';
  title: string;
  targetCategoryOrIds: string;
  limit: number;
  isActive: boolean;
}

export interface CMSPage {
  id: string;
  title: string;
  slug: string;
  content: string; // HTML-ish
  status: 'Draft' | 'Published';
  seoTitle: string;
  seoDescription: string;
  updatedAt: string;
  version: number;
}

export interface GiftHamper {
  id: string;
  name: string;
  price: number;
  discountedPrice: number;
  products: { productId: string; quantity: number }[];
  packagingType: 'Premium Box' | 'Eco Jute Bag' | 'Festive Basket';
  giftMessageTemplate: string;
  inventory: number;
  status: 'Active' | 'Draft';
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  country: string;
  address: string;
  complianceDocuments: { name: string; type: string; expiry: string; status: 'Valid' | 'Expiring' | 'Expired' }[];
  purchaseHistory: { date: string; value: number; sku: string; qty: number }[];
  mappedProductIds: string[];
  productsSupplied?: string[];
  leadTimeDays?: number;
  status?: 'Active' | 'Inactive';
}

export interface UserRole {
  role: 'Super Admin' | 'Admin' | 'Manager' | 'Inventory Manager' | 'Customer Support';
  permissions: string[]; // array of view/edit scopes
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  target: string;
  category: 'Product' | 'Order' | 'Customer' | 'Settings' | 'CMS' | 'Coupon';
}
