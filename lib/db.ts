import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api';

let woocommerceClient: any = null;

export function getWooCommerce() {
  if (!woocommerceClient) {
    const url = process.env.WOOCOMMERCE_URL;
    const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY;
    const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET;

    if (!url || !consumerKey || !consumerSecret) {
      throw new Error('WooCommerce API credentials are not set in environment or JSON config.');
    }

    woocommerceClient = new WooCommerceRestApi({
      url: url,
      consumerKey: consumerKey,
      consumerSecret: consumerSecret,
      version: 'wc/v3',
      timeout: 10000, // 10 second timeout
    });
  }
  return woocommerceClient;
}

// Data Schema Interfaces - WooCommerce Native Structure
export interface Category {
  id: number;
  name: string;
  slug: string;
  parent?: number;
  image?: { src: string };
  menu_order: number;
  count?: number;
}

export interface ProductAttribute {
  id: number;
  name: string;
  slug: string;
  options: string[];
  position: number;
  visible: boolean;
  variation: boolean;
}

export interface ProductImage {
  id: number;
  src: string;
  alt: string;
  name: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
}

export interface ProductTag {
  id: number;
  name: string;
  slug: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  type: 'simple' | 'variable' | 'grouped' | 'external';
  status: 'publish' | 'draft' | 'pending' | 'private';
  regular_price: string;
  sale_price?: string;
  price: string;
  images: ProductImage[];
  categories: ProductCategory[];
  tags: ProductTag[];
  attributes: ProductAttribute[];
  stock_quantity?: number;
  manage_stock: boolean;
  stock_status: 'instock' | 'outofstock' | 'onbackorder';
  sku?: string;
  featured: boolean;
  average_rating: string;
  rating_count: number;
  date_created: string;
  date_modified: string;
}

export interface ProductVariation {
  id: number;
  product_id: number;
  attributes: Array<{ id: number; name: string; option: string }>;
  price: string;
  regular_price: string;
  sale_price?: string;
  sku?: string;
  stock_quantity?: number;
  manage_stock: boolean;
  stock_status: 'instock' | 'outofstock' | 'onbackorder';
  status: 'publish' | 'draft' | 'private';
  date_created: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string;
  name: string;
  image_url: string;
  size: string;
  color: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Order {
  id: string;
  order_number: string;
  session_token: string;
  status: 'payment_submitted' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | string;
  payment_method: 'esewa' | 'khalti' | 'cash_on_delivery' | string;
  payment_status: 'pending' | 'submitted' | 'verified' | 'failed' | string;
  payment_txn_id: string | null;
  subtotal: number;
  discount_amount: number;
  shipping_fee: number;
  total: number;
  coupon_code: string | null;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  shipping_address: string;
  country: string;
  district: string | null;
  municipality: string | null;
  wardNo: string | null;
  notes: string | null;
  admin_note: string | null;
  shipped_at?: string;
  delivered_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  data: any;
  is_read: boolean;
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_value: number;
  expires_at: string | null;
  max_uses: number | null;
  used_count: number;
  is_active: boolean;
  description: string;
}

export interface PaymentQrConfig {
  method: 'esewa' | 'khalti' | string;
  qr_image_url: string;
  account_name: string;
  account_id: string;
  instructions: string;
  is_active: boolean;
  updated_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  order_id: string | null;
  reviewer_name: string;
  rating: number;
  title: string;
  body: string;
  is_approved: boolean;
  created_at: string;
}

export interface DbData {
  products: Product[];
  categories: Category[];
  variations: ProductVariation[];
  orders: Order[];
  orderItems: OrderItem[];
  notifications: Notification[];
  coupons: Coupon[];
  paymentQrConfigs: PaymentQrConfig[];
  reviews: Review[];
}

// In-memory runtime data for non-WooCommerce synced entities (cart fallback, temporary states)
// This strictly avoids mock seed data or local JSON files.
const globalDb = globalThis as unknown as { __TSZ_DB__: DbData; __TSZ_CACHE__: { timestamp: number; data: DbData | null } };

if (!globalDb.__TSZ_DB__) {
  globalDb.__TSZ_DB__ = {
    products: [],
    categories: [],
    variations: [],
    orders: [],
    orderItems: [],
    notifications: [],
    coupons: [],
    paymentQrConfigs: [],
    reviews: []
  };
}
if (!globalDb.__TSZ_CACHE__) {
  globalDb.__TSZ_CACHE__ = { timestamp: 0, data: null };
}

const memoryData: DbData = globalDb.__TSZ_DB__;

export function generateId(): string {
  return 'id_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}

export async function saveDb(db: DbData): Promise<void> {
  // Update in-memory runtime data
  memoryData.orders = db.orders;
  memoryData.orderItems = db.orderItems;
  memoryData.notifications = db.notifications;
  memoryData.coupons = db.coupons;
  memoryData.paymentQrConfigs = db.paymentQrConfigs;
  memoryData.reviews = db.reviews;
}

export async function readDb(): Promise<DbData> {
  let db: DbData = { ...memoryData };

  // Skip WooCommerce sync if disabled
  if (process.env.DISABLE_WOOCOMMERCE_SYNC === 'true') {
    console.warn('WooCommerce sync is disabled via DISABLE_WOOCOMMERCE_SYNC environment variable.');
    return db;
  }

  try {
    const CACHE_TTL = 60 * 1000 * 5; // 5 minutes cache
    const now = Date.now();
    
    // Use cache if available and fresh
    if (globalDb.__TSZ_CACHE__.data && (now - globalDb.__TSZ_CACHE__.timestamp < CACHE_TTL)) {
      const cached = globalDb.__TSZ_CACHE__.data;
      db.products = cached.products;
      db.categories = cached.categories;
      db.variations = cached.variations;
      return db;
    }

    const api = getWooCommerce();
    
    // Use Promise.allSettled to prevent AggregateError when WooCommerce is unreachable
    const results = await Promise.allSettled([
      api.get('products', { per_page: 100, status: 'publish' }),
      api.get('products/categories', { per_page: 100 }),
    ]);

    const productsResult = results[0];
    const categoriesResult = results[1];

    // Process categories - use WooCommerce native structure
    if (categoriesResult.status === 'fulfilled') {
      const wcCategories = categoriesResult.value.data;
      if (Array.isArray(wcCategories)) {
        db.categories = wcCategories.map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          parent: c.parent || undefined,
          image: c.image ? { src: c.image.src } : undefined,
          menu_order: c.menu_order || 0,
          count: c.count
        }));
      } else {
        console.warn('WooCommerce categories data is not an array:', typeof wcCategories, wcCategories);
      }
    } else {
      console.warn('WooCommerce categories fetch failed:', categoriesResult.reason?.message || categoriesResult.reason);
    }

    // Process products - use WooCommerce native structure
    if (productsResult.status === 'fulfilled') {
      const wcProducts = productsResult.value.data;
      if (Array.isArray(wcProducts)) {
        db.products = wcProducts.map((p: any) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          description: p.description || '',
          short_description: p.short_description || '',
          type: p.type || 'simple',
          status: p.status || 'publish',
          regular_price: p.regular_price || '0',
          sale_price: p.sale_price || undefined,
          price: p.price || p.regular_price || '0',
          images: p.images || [],
          categories: p.categories || [],
          tags: p.tags || [],
          attributes: p.attributes || [],
          stock_quantity: p.stock_quantity,
          manage_stock: p.manage_stock || false,
          stock_status: p.stock_status || 'instock',
          sku: p.sku,
          featured: p.featured || false,
          average_rating: p.average_rating || '0',
          rating_count: p.rating_count || 0,
          date_created: p.date_created || new Date().toISOString(),
          date_modified: p.date_modified || new Date().toISOString()
        }));

        // Fetch variations for variable products
        const variableProducts = db.products.filter((p: Product) => p.type === 'variable');
        for (const product of variableProducts) {
          try {
            const variationsResult = await api.get(`products/${product.id}/variations`, { per_page: 100 });
            if (variationsResult.data && Array.isArray(variationsResult.data)) {
              const variations = variationsResult.data.map((v: any) => ({
                id: v.id,
                product_id: product.id,
                attributes: v.attributes || [],
                price: v.price || '0',
                regular_price: v.regular_price || '0',
                sale_price: v.sale_price || undefined,
                sku: v.sku,
                stock_quantity: v.stock_quantity,
                manage_stock: v.manage_stock || false,
                stock_status: v.stock_status || 'instock',
                status: v.status || 'publish',
                date_created: v.date_created || new Date().toISOString()
              }));
              
              // Add variations to db
              variations.forEach((variation: ProductVariation) => {
                if (!db.variations.some((v: ProductVariation) => v.id === variation.id)) {
                  db.variations.push(variation);
                }
              });
            }
          } catch (varErr) {
            console.warn(`Failed to fetch variations for product ${product.id}:`, varErr);
          }
        }
      } else {
        console.warn('WooCommerce products data is not an array:', typeof wcProducts, wcProducts);
      }
    } else {
      console.warn('WooCommerce products fetch failed:', productsResult.reason?.message || productsResult.reason);
    }

    // Save to cache
    globalDb.__TSZ_CACHE__ = {
      timestamp: Date.now(),
      data: {
        ...db,
        products: db.products,
        categories: db.categories,
        variations: db.variations
      }
    };

  } catch (err) {
    console.error('WooCommerce REST sync failed:', err);
    console.warn('Returning cached database state due to API unavailability.');
    if (globalDb.__TSZ_CACHE__.data) {
      const cached = globalDb.__TSZ_CACHE__.data;
      db.products = cached.products;
      db.categories = cached.categories;
      db.variations = cached.variations;
    }
  }

  return db;
}

