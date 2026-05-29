import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Database file path
const DB_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'stylezone.db');

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    initializeSchema();
  }
  return db;
}

function initializeSchema(): void {
  const database = getDb();

  // Orders table
  database.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      order_number TEXT UNIQUE NOT NULL,
      session_token TEXT NOT NULL,
      status TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      payment_status TEXT NOT NULL,
      payment_txn_id TEXT,
      subtotal REAL NOT NULL,
      discount_amount REAL NOT NULL DEFAULT 0,
      shipping_fee REAL NOT NULL DEFAULT 0,
      total REAL NOT NULL,
      coupon_code TEXT,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_email TEXT,
      shipping_address TEXT NOT NULL,
      municipality TEXT NOT NULL,
      wardNo TEXT NOT NULL,
      notes TEXT,
      admin_note TEXT,
      shipped_at TEXT,
      delivered_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  // Order items table
  database.exec(`
    CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      variant_id TEXT NOT NULL,
      name TEXT NOT NULL,
      image_url TEXT NOT NULL,
      size TEXT NOT NULL,
      color TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      total_price REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    )
  `);

  // Coupons table
  database.exec(`
    CREATE TABLE IF NOT EXISTS coupons (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      discount_type TEXT NOT NULL,
      discount_value REAL NOT NULL,
      min_order_value REAL NOT NULL,
      expires_at TEXT,
      max_uses INTEGER,
      used_count INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      description TEXT
    )
  `);

  // Notifications table
  database.exec(`
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      data TEXT,
      is_read INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    )
  `);

  // Reviews table
  database.exec(`
    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      order_id TEXT,
      reviewer_name TEXT NOT NULL,
      rating INTEGER NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      is_approved INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    )
  `);

  // Payment QR configs table
  database.exec(`
    CREATE TABLE IF NOT EXISTS payment_qr_configs (
      method TEXT PRIMARY KEY,
      qr_image_url TEXT NOT NULL,
      account_name TEXT NOT NULL,
      account_id TEXT NOT NULL,
      instructions TEXT NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 1,
      updated_at TEXT NOT NULL
    )
  `);

  // Create indexes for better query performance
  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
    CREATE INDEX IF NOT EXISTS idx_orders_session_token ON orders(session_token);
    CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
    CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
    CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
  `);
}

// Orders CRUD operations
export function saveOrder(order: any): void {
  const database = getDb();
  const stmt = database.prepare(`
    INSERT OR REPLACE INTO orders (
      id, order_number, session_token, status, payment_method, payment_status,
      payment_txn_id, subtotal, discount_amount, shipping_fee, total, coupon_code,
      customer_name, customer_phone, customer_email, shipping_address, municipality,
      wardNo, notes, admin_note, shipped_at, delivered_at, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    order.id,
    order.order_number,
    order.session_token,
    order.status,
    order.payment_method,
    order.payment_status,
    order.payment_txn_id,
    order.subtotal,
    order.discount_amount,
    order.shipping_fee,
    order.total,
    order.coupon_code,
    order.customer_name,
    order.customer_phone,
    order.customer_email,
    order.shipping_address,
    order.municipality,
    order.wardNo,
    order.notes,
    order.admin_note,
    order.shipped_at || null,
    order.delivered_at || null,
    order.created_at,
    order.updated_at
  );
}

export function getOrderByOrderNumber(orderNumber: string): any | null {
  const database = getDb();
  const stmt = database.prepare('SELECT * FROM orders WHERE order_number = ?');
  const row = stmt.get(orderNumber) as any;
  if (!row) return null;
  
  return {
    id: row.id,
    order_number: row.order_number,
    session_token: row.session_token,
    status: row.status,
    payment_method: row.payment_method,
    payment_status: row.payment_status,
    payment_txn_id: row.payment_txn_id,
    subtotal: row.subtotal,
    discount_amount: row.discount_amount,
    shipping_fee: row.shipping_fee,
    total: row.total,
    coupon_code: row.coupon_code,
    customer_name: row.customer_name,
    customer_phone: row.customer_phone,
    customer_email: row.customer_email,
    shipping_address: row.shipping_address,
    municipality: row.municipality,
    wardNo: row.wardNo,
    notes: row.notes,
    admin_note: row.admin_note,
    shipped_at: row.shipped_at,
    delivered_at: row.delivered_at,
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

export function getOrdersBySessionToken(sessionToken: string): any[] {
  const database = getDb();
  const stmt = database.prepare('SELECT * FROM orders WHERE session_token = ? ORDER BY created_at DESC');
  const rows = stmt.all(sessionToken) as any[];
  
  return rows.map(row => ({
    id: row.id,
    order_number: row.order_number,
    session_token: row.session_token,
    status: row.status,
    payment_method: row.payment_method,
    payment_status: row.payment_status,
    payment_txn_id: row.payment_txn_id,
    subtotal: row.subtotal,
    discount_amount: row.discount_amount,
    shipping_fee: row.shipping_fee,
    total: row.total,
    coupon_code: row.coupon_code,
    customer_name: row.customer_name,
    customer_phone: row.customer_phone,
    customer_email: row.customer_email,
    shipping_address: row.shipping_address,
    municipality: row.municipality,
    wardNo: row.wardNo,
    notes: row.notes,
    admin_note: row.admin_note,
    shipped_at: row.shipped_at,
    delivered_at: row.delivered_at,
    created_at: row.created_at,
    updated_at: row.updated_at
  }));
}

export function getAllOrders(): any[] {
  const database = getDb();
  const stmt = database.prepare('SELECT * FROM orders ORDER BY created_at DESC');
  const rows = stmt.all() as any[];
  
  return rows.map(row => ({
    id: row.id,
    order_number: row.order_number,
    session_token: row.session_token,
    status: row.status,
    payment_method: row.payment_method,
    payment_status: row.payment_status,
    payment_txn_id: row.payment_txn_id,
    subtotal: row.subtotal,
    discount_amount: row.discount_amount,
    shipping_fee: row.shipping_fee,
    total: row.total,
    coupon_code: row.coupon_code,
    customer_name: row.customer_name,
    customer_phone: row.customer_phone,
    customer_email: row.customer_email,
    shipping_address: row.shipping_address,
    municipality: row.municipality,
    wardNo: row.wardNo,
    notes: row.notes,
    admin_note: row.admin_note,
    shipped_at: row.shipped_at,
    delivered_at: row.delivered_at,
    created_at: row.created_at,
    updated_at: row.updated_at
  }));
}

// Order items CRUD operations
export function saveOrderItem(item: any): void {
  const database = getDb();
  const stmt = database.prepare(`
    INSERT OR REPLACE INTO order_items (
      id, order_id, product_id, variant_id, name, image_url, size, color,
      quantity, unit_price, total_price
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    item.id,
    item.order_id,
    item.product_id,
    item.variant_id,
    item.name,
    item.image_url,
    item.size,
    item.color,
    item.quantity,
    item.unit_price,
    item.total_price
  );
}

export function getOrderItemsByOrderId(orderId: string): any[] {
  const database = getDb();
  const stmt = database.prepare('SELECT * FROM order_items WHERE order_id = ?');
  const rows = stmt.all(orderId) as any[];
  
  return rows.map(row => ({
    id: row.id,
    order_id: row.order_id,
    product_id: row.product_id,
    variant_id: row.variant_id,
    name: row.name,
    image_url: row.image_url,
    size: row.size,
    color: row.color,
    quantity: row.quantity,
    unit_price: row.unit_price,
    total_price: row.total_price
  }));
}

export function deleteOrderItemsByOrderId(orderId: string): void {
  const database = getDb();
  const stmt = database.prepare('DELETE FROM order_items WHERE order_id = ?');
  stmt.run(orderId);
}

// Coupons CRUD operations
export function saveCoupon(coupon: any): void {
  const database = getDb();
  const stmt = database.prepare(`
    INSERT OR REPLACE INTO coupons (
      id, code, discount_type, discount_value, min_order_value, expires_at,
      max_uses, used_count, is_active, description
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    coupon.id,
    coupon.code,
    coupon.discount_type,
    coupon.discount_value,
    coupon.min_order_value,
    coupon.expires_at || null,
    coupon.max_uses || null,
    coupon.used_count,
    coupon.is_active ? 1 : 0,
    coupon.description
  );
}

export function getAllCoupons(): any[] {
  const database = getDb();
  const stmt = database.prepare('SELECT * FROM coupons');
  const rows = stmt.all() as any[];
  
  return rows.map(row => ({
    id: row.id,
    code: row.code,
    discount_type: row.discount_type,
    discount_value: row.discount_value,
    min_order_value: row.min_order_value,
    expires_at: row.expires_at,
    max_uses: row.max_uses,
    used_count: row.used_count,
    is_active: row.is_active === 1,
    description: row.description
  }));
}

// Notifications CRUD operations
export function saveNotification(notification: any): void {
  const database = getDb();
  const stmt = database.prepare(`
    INSERT OR REPLACE INTO notifications (
      id, type, title, body, data, is_read, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    notification.id,
    notification.type,
    notification.title,
    notification.body,
    notification.data ? JSON.stringify(notification.data) : null,
    notification.is_read ? 1 : 0,
    notification.created_at
  );
}

export function getAllNotifications(): any[] {
  const database = getDb();
  const stmt = database.prepare('SELECT * FROM notifications ORDER BY created_at DESC');
  const rows = stmt.all() as any[];
  
  return rows.map(row => ({
    id: row.id,
    type: row.type,
    title: row.title,
    body: row.body,
    data: row.data ? JSON.parse(row.data) : null,
    is_read: row.is_read === 1,
    created_at: row.created_at
  }));
}

// Reviews CRUD operations
export function saveReview(review: any): void {
  const database = getDb();
  const stmt = database.prepare(`
    INSERT OR REPLACE INTO reviews (
      id, product_id, order_id, reviewer_name, rating, title, body, is_approved, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    review.id,
    review.product_id,
    review.order_id || null,
    review.reviewer_name,
    review.rating,
    review.title,
    review.body,
    review.is_approved ? 1 : 0,
    review.created_at
  );
}

export function getReviewsByProductId(productId: string): any[] {
  const database = getDb();
  const stmt = database.prepare('SELECT * FROM reviews WHERE product_id = ? AND is_approved = 1');
  const rows = stmt.all(productId) as any[];
  
  return rows.map(row => ({
    id: row.id,
    product_id: row.product_id,
    order_id: row.order_id,
    reviewer_name: row.reviewer_name,
    rating: row.rating,
    title: row.title,
    body: row.body,
    is_approved: row.is_approved === 1,
    created_at: row.created_at
  }));
}

export function getAllReviews(): any[] {
  const database = getDb();
  const stmt = database.prepare('SELECT * FROM reviews ORDER BY created_at DESC');
  const rows = stmt.all() as any[];
  
  return rows.map(row => ({
    id: row.id,
    product_id: row.product_id,
    order_id: row.order_id,
    reviewer_name: row.reviewer_name,
    rating: row.rating,
    title: row.title,
    body: row.body,
    is_approved: row.is_approved === 1,
    created_at: row.created_at
  }));
}

// Payment QR configs CRUD operations
export function savePaymentQrConfig(config: any): void {
  const database = getDb();
  const stmt = database.prepare(`
    INSERT OR REPLACE INTO payment_qr_configs (
      method, qr_image_url, account_name, account_id, instructions, is_active, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    config.method,
    config.qr_image_url,
    config.account_name,
    config.account_id,
    config.instructions,
    config.is_active ? 1 : 0,
    config.updated_at
  );
}

export function getPaymentQrConfigs(): any[] {
  const database = getDb();
  const stmt = database.prepare('SELECT * FROM payment_qr_configs WHERE is_active = 1');
  const rows = stmt.all() as any[];
  
  return rows.map(row => ({
    method: row.method,
    qr_image_url: row.qr_image_url,
    account_name: row.account_name,
    account_id: row.account_id,
    instructions: row.instructions,
    is_active: row.is_active === 1,
    updated_at: row.updated_at
  }));
}

// Utility function to close database connection
export function closeDb(): void {
  if (db) {
    db.close();
    db = null;
  }
}