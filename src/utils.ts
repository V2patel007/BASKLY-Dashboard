/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Order, Customer } from './types.ts';

/**
 * Global Currency Formatting Helper
 * Converts base numbers (assumed in USD) to target currencies using realistic conversion factors.
 */
export function formatPrice(amount: number, currency: string = 'INR'): string {
  if (currency === 'INR') {
    // Standard conversion factor from USD base to Indian Rupee (INR)
    const inrValue = amount * 83.5;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(inrValue);
  } else if (currency === 'EUR') {
    const eurValue = amount * 0.92;
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(eurValue);
  } else {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }
}

/**
 * Returns a clean numeric representation in target currency without symbol
 */
export function convertPriceOnly(amount: number, currency: string = 'INR'): number {
  if (currency === 'INR') {
    return amount * 83.5;
  } else if (currency === 'EUR') {
    return amount * 0.92;
  }
  return amount;
}

/**
 * Generates a mock realistic transaction order to simulate real business activity
 */
export function generateMockOrder(
  products: Product[],
  customers: Customer[],
  existingOrdersCount: number
): Order {
  const indianNames = [
    { name: 'Siddharth Sharma', email: 'sid.sharma@yahoo.co.in', phone: '+91 98123 45678' },
    { name: 'Priyanka Sen', email: 'priyanka.sen@outlook.com', phone: '+91 99332 11223' },
    { name: 'Vikram Malhotra', email: 'vikram.m@goldman.com', phone: '+91 91122 33445' },
    { name: 'Meera Iyer', email: 'meera.iyer@jio.com', phone: '+91 98450 12345' },
    { name: 'Amitabh Joshi', email: 'a.joshi@tcs.com', phone: '+91 93311 55667' }
  ];

  const addresses = [
    { street: 'Apt 1201, Imperial Towers, Baner', city: 'Pune', state: 'Gujarat', zip: '411045' },
    { street: '45, Palm Avenue, Ballygunge', city: 'Kolkata', state: 'West Bengal', zip: '700019' },
    { street: 'Vila 9, Prestige Boulevard, Whitefield', city: 'Bangalore', state: 'Karnataka', zip: '560066' },
    { street: 'Flat 10B, Sukhdev Vihar', city: 'New Delhi', state: 'Delhi', zip: '110025' },
    { street: 'B-302, Sagar Darshan, Juhu Scheme', city: 'Mumbai', state: 'Maharashtra', zip: '400049' }
  ];

  const randomIndex = Math.floor(Math.random() * indianNames.length);
  const contact = indianNames[randomIndex];
  const address = addresses[randomIndex];

  // Pick 1 or 2 random products
  const selectedProducts: Product[] = [];
  const numItems = Math.random() > 0.6 ? 2 : 1;
  
  for (let i = 0; i < numItems; i++) {
    const randProd = products[Math.floor(Math.random() * products.length)];
    if (!selectedProducts.some(p => p.id === randProd.id)) {
      selectedProducts.push(randProd);
    }
  }

  const items = selectedProducts.map(p => {
    const qty = Math.floor(Math.random() * 2) + 1;
    return {
      id: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      productId: p.id,
      productName: p.name,
      image: p.images[0] || 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=400',
      sku: p.sku,
      variantDetails: p.variants[0] ? `Size: ${p.variants[0].size}, Packaging: ${p.variants[0].packaging}` : 'Standard pack',
      price: p.price,
      quantity: qty
    };
  });

  const baseAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const taxAmount = baseAmount * 0.05; // GST 5%
  const shippingAmount = baseAmount > 50 ? 0 : 5.00;

  const orderId = `#ORD-${1104 + existingOrdersCount + 1}`;
  const nowStr = new Date().toISOString();

  return {
    id: orderId,
    customer: {
      id: `cust-gen-${Date.now()}`,
      name: contact.name,
      email: contact.email,
      phone: contact.phone
    },
    shippingAddress: {
      street: address.street,
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: 'India'
    },
    items,
    amount: parseFloat(baseAmount.toFixed(2)),
    taxAmount: parseFloat(taxAmount.toFixed(2)),
    shippingAmount: parseFloat(shippingAmount.toFixed(2)),
    paymentStatus: Math.random() > 0.1 ? 'Paid' : 'Pending',
    fulfillmentStatus: 'Unfulfilled',
    date: nowStr,
    notes: 'Generated via Live Business Activity Simulator',
    timeline: [
      {
        id: `t-g1-${Date.now()}`,
        date: new Date().toLocaleTimeString() + ', Today',
        title: 'Order Placed (Simulator)',
        desc: `Simulated transaction generated for ${contact.name}.`,
        user: 'Simulator Agent'
      }
    ]
  };
}
