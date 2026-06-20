/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Database, FileCode, Server, Cpu, Copy, Check } from 'lucide-react';

export default function DeveloperFilesViewer() {
  const [activeSubTab, setActiveSubTab] = useState<'prisma' | 'sql' | 'express' | 'r2'>('prisma');
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const PRISMA_SCHEMA = `// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  role      String   // "SUPER_ADMIN" | "ADMIN" | "MANAGER" | "INVENTORY_MGR" | "SUPPORT"
  createdAt DateTime @default(now())
}

model Product {
  id               String            @id @default(uuid())
  sku              String            @unique
  name             String
  slug             String            @unique
  shortDescription String
  description      String            @db.Text
  price            Float
  promoPrice       Float?
  inventory        Int               @default(0)
  lowStockThreshold Int              @default(10)
  status           String            // "ACTIVE" | "DRAFT" | "ARCHIVED"
  images           String[]          // Array of Cloudflare R2 URLs
  seoTitle         String
  seoDescription   String
  shippingWeight   Float             // kg
  hsnCode          String
  supplierId       String?
  supplier         Supplier?         @relation(fields: [supplierId], references: [id])
  categorySlug     String
  category         Category          @relation(fields: [categorySlug], references: [slug])
  variants         ProductVariant[]
  certificates     LabCertificate[]
  orderItems       OrderItem[]
  createdAt        DateTime          @default(now())
  updatedAt        DateTime          @updatedAt
}

model ProductVariant {
  id                String   @id @default(uuid())
  productId         String
  product           Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  sku               String   @unique
  price             Float
  inventory         Int      @default(0)
  lowStockThreshold Int      @default(5)
  size              String?
  weight            String?
  flavor            String?
  packaging         String?
}

model Category {
  id             String    @id @default(uuid())
  name           String
  slug           String    @unique
  description    String
  parentSlug     String?
  bannerUrl      String?
  seoTitle       String
  seoDescription String
  products       Product[]
}

model Order {
  id                String       @id // e.g., "ORD-1101"
  customerId        String
  customerName      String
  customerEmail     String
  customerPhone     String
  shippingStreet    String
  shippingCity      String
  shippingState     String
  shippingZip       String
  shippingCountry   String
  amount            Float
  taxAmount         Float
  shippingAmount    Float
  paymentStatus     String       // "PAID" | "PENDING" | "REFUNDED" | "FAILED"
  fulfillmentStatus String       // "UNFULFILLED" | "FULFILLED" | "SHIPPED" | "DELIVERED"
  courierName       String?
  awbNumber         String?
  trackingStatus    String?      // "PENDING" | "IN_TRANSIT" | "DELIVERED" | "RTO"
  notes             String?
  items             OrderItem[]
  createdAt         DateTime     @default(now())
  updatedAt         DateTime     @updatedAt
}

model OrderItem {
  id          String   @id @default(uuid())
  orderId     String
  order       Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId   String
  product     Product  @relation(fields: [productId], references: [id])
  sku         String
  name        String
  price       Float
  quantity    Int
}

model LabCertificate {
  id          String   @id @default(uuid())
  name        String
  uploadDate  DateTime @default(now())
  expiryDate  DateTime
  url         String
  version     Int      @default(1)
  productId   String
  product     Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
}

model Supplier {
  id             String          @id @default(uuid())
  name           String
  contactPerson  String
  phone          String
  email          String
  country        String
  address        String
  products       Product[]
  createdAt      DateTime        @default(now())
}

model Coupon {
  id             String    @id @default(uuid())
  code           String    @unique
  type           String    // "PERCENTAGE" | "FLAT" | "FREE_SHIPPING"
  value          Float
  minOrderValue  Float     @default(0)
  maxUsage       Int       @default(100)
  currentUsage   Int       @default(0)
  expiryDate     DateTime
  customerTier   String?
}`;

  const POSTGRES_SQL = `-- database/migrations/init.sql
CREATE TABLE IF NOT EXISTS "User" (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Category" (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    "parentSlug" VARCHAR(255),
    "bannerUrl" VARCHAR(512),
    "seoTitle" VARCHAR(255),
    "seoDescription" TEXT
);

CREATE TABLE IF NOT EXISTS "Product" (
    id VARCHAR(36) PRIMARY KEY,
    sku VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    "shortDescription" VARCHAR(1024),
    description TEXT,
    price DOUBLE PRECISION NOT NULL,
    "promoPrice" DOUBLE PRECISION,
    inventory INTEGER DEFAULT 0,
    "lowStockThreshold" INTEGER DEFAULT 10,
    status VARCHAR(50) NOT NULL,
    images TEXT[], -- Postgres Array of Strings
    "seoTitle" VARCHAR(255),
    "seoDescription" TEXT,
    "shippingWeight" DOUBLE PRECISION,
    "hsnCode" VARCHAR(50),
    "supplierId" VARCHAR(36),
    "categorySlug" VARCHAR(255) REFERENCES "Category"(slug),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "ProductVariant" (
    id VARCHAR(36) PRIMARY KEY,
    "productId" VARCHAR(36) REFERENCES "Product"(id) ON DELETE CASCADE,
    sku VARCHAR(100) UNIQUE NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    inventory INTEGER DEFAULT 0,
    size VARCHAR(50),
    weight VARCHAR(50),
    flavor VARCHAR(50),
    packaging VARCHAR(50)
);`;

  const EXPRESS_ROUTES = `// src/server/routes/shiprocket.ts
import express from 'express';
import axios from 'axios';

const router = express.Router();
const SHIPROCKET_API = 'https://api.shiprocket.in/v1/external';

async function getAuthToken() {
  const res = await axios.post(\`\${SHIPROCKET_API}/auth/login\`, {
    email: process.env.SHIPROCKET_EMAIL,
    password: process.env.SHIPROCKET_PASSWORD,
  });
  return res.data.token;
}

// Create Custom Order & Generate Shipment
router.post('/shipping/create', async (req, res) => {
  try {
    const token = await getAuthToken();
    const headers = { Authorization: \`Bearer \${token}\` };
    
    const payload = {
      order_id: req.body.orderId,
      order_date: req.body.date,
      pickup_location: "Primary Warehouse NCR",
      billing_customer_name: req.body.customer.name,
      billing_last_name: "",
      billing_address: req.body.shippingAddress.street,
      billing_city: req.body.shippingAddress.city,
      billing_state: req.body.shippingAddress.state,
      billing_pincode: req.body.shippingAddress.zip,
      billing_country: "India",
      billing_email: req.body.customer.email,
      billing_phone: req.body.customer.phone,
      shipping_is_billing: true,
      order_items: req.body.items.map((item: any) => ({
        name: item.productName,
        sku: item.sku,
        units: item.quantity,
        selling_price: item.price
      })),
      payment_method: "Prepaid",
      sub_total: req.body.amount,
      length: req.body.length || 10,
      width: req.body.width || 10,
      height: req.body.height || 10,
      weight: req.body.weight || 0.5
    };

    const shiprocketOrder = await axios.post(\`\${SHIPROCKET_API}/shipments/create\`, payload, { headers });
    res.json(shiprocketOrder.data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});`;

  const CLOUDFLARE_R2 = `// src/server/services/r2.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const r2Client = new S3Client({
  endpoint: \`https://\${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com\`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
  region: 'auto',
});

export async function uploadToR2(fileBuffer: Buffer, fileName: string, contentType: string) {
  const publicUrl = \`https://pub-\${process.env.R2_SUBDOMAIN_HASH}.r2.dev/\${fileName}\`;
  
  await r2Client.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: fileName,
    Body: fileBuffer,
    ContentType: contentType,
  }));

  return publicUrl;
}`;

  const currentText = {
    prisma: PRISMA_SCHEMA,
    sql: POSTGRES_SQL,
    express: EXPRESS_ROUTES,
    r2: CLOUDFLARE_R2
  }[activeSubTab];

  return (
    <div className="bg-white rounded-xl border border-natural-200 shadow-xs overflow-hidden">
      <div className="border-b border-natural-100 bg-linear-to-r from-stone-50 to-stone-100 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-stone-900 flex items-center gap-2">
              <Cpu className="h-5 w-5 text-indigo-600" />
              SaaS Backend Architecture Blueprint
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Production-grade configuration spec, Prisma database mappings, SQL schemas, and Cloudflare R2 services matching full enterprise requirements.
            </p>
          </div>
          <div className="flex gap-1.5 self-start sm:self-center">
            <button
              onClick={() => handleCopy(currentText)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 rounded-md transition-colors shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  Copied Code
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy Config
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex gap-2 mt-4 overflow-x-auto pb-1 flex-nowrap scrollbar-thin">
          <button
            onClick={() => setActiveSubTab('prisma')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg shrink-0 transition-colors ${
              activeSubTab === 'prisma'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            <FileCode className="h-3.5 w-3.5" />
            Prisma Schema
          </button>
          <button
            onClick={() => setActiveSubTab('sql')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg shrink-0 transition-colors ${
              activeSubTab === 'sql'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            <Database className="h-3.5 w-3.5" />
            PostgreSQL Migrations
          </button>
          <button
            onClick={() => setActiveSubTab('express')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg shrink-0 transition-colors ${
              activeSubTab === 'express'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            <Server className="h-3.5 w-3.5" />
            Shiprocket API Proxy (Express)
          </button>
          <button
            onClick={() => setActiveSubTab('r2')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg shrink-0 transition-colors ${
              activeSubTab === 'r2'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            <Database className="h-3.5 w-3.5" />
            CF R2 Cloud Storage
          </button>
        </div>
      </div>

      <div className="bg-stone-950 p-5 overflow-x-auto max-h-[500px]">
        <pre className="text-[11px] md:text-xs font-mono text-zinc-300 leading-relaxed scrollbar-thin">
          <code>{currentText}</code>
        </pre>
      </div>

      <div className="bg-stone-50 px-5 py-3 border-t border-stone-200 flex justify-between items-center text-xs text-stone-500">
        <span>Production DB Engine: <b>PostgreSQL 16</b></span>
        <span>Storage Proxy: <b>Cloudflare R2 Bucket</b></span>
      </div>
    </div>
  );
}
