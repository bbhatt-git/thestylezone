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
    });
  }
  return woocommerceClient;
}

// Data Schema Interfaces
export interface Category {
  id: any;
  name: string;
  slug: string;
  parent_id?: any;
  image_url?: string | null;
  gender?: 'men' | 'women' | 'unisex' | string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  count?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  category_id: any;
  brand: string;
  gender: string;
  base_price: number;
  sale_price: number | null;
  discount_pct: number;
  images: string[];
  tags: string[];
  is_active: boolean;
  is_featured: boolean;
  stock_total: number;
  rating_avg: number;
  rating_count: number;
  categories: string[];
  colors: string[];
  sizes: string[];
  sku: string;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size: string;
  color: string;
  color_hex: string;
  sku: string;
  stock: number;
  price_delta: number;
  is_active: boolean;
  created_at: string;
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
  municipality: string;
  wardNo: string;
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
  variants: ProductVariant[];
  orders: Order[];
  orderItems: OrderItem[];
  notifications: Notification[];
  coupons: Coupon[];
  paymentQrConfigs: PaymentQrConfig[];
  reviews: Review[];
}

// In-memory runtime data for non-WooCommerce synced entities (cart fallback, temporary states)
// This strictly avoids mock seed data or local JSON files.
const memoryData: DbData = {
  products: [],
  categories: [],
  variants: [],
  orders: [],
  orderItems: [],
  notifications: [],
  coupons: [],
  paymentQrConfigs: [],
  reviews: []
};

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

  try {
    const api = getWooCommerce();
    
    // Use Promise.allSettled to prevent AggregateError when WooCommerce is unreachable
    const results = await Promise.allSettled([
      api.get('products', { per_page: 100, status: 'publish' }),
      api.get('products/categories', { per_page: 100 }),
    ]);

    const productsResult = results[0];
    const categoriesResult = results[1];

    // Process categories only if that specific call succeeded
    if (categoriesResult.status === 'fulfilled') {
      const wcCategories = categoriesResult.value.data;
      if (Array.isArray(wcCategories)) {
        db.categories = wcCategories.map((c: any) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        parent_id: c.parent || null,
        image_url: c.image?.src || null,
        gender: 'unisex',
        sort_order: c.menu_order || 0,
        is_active: true,
        created_at: new Date().toISOString(),
        count: c.count
      }));
      } else {
        console.warn('WooCommerce categories data is not an array:', typeof wcCategories, wcCategories);
      }
    } else {
      console.warn('WooCommerce categories fetch failed:', categoriesResult.reason?.message || categoriesResult.reason);
    }

    // Process products only if that specific call succeeded
    if (productsResult.status === 'fulfilled') {
      const wcProducts = productsResult.value.data;
      if (Array.isArray(wcProducts)) {
        db.products = wcProducts.map((p: any) => {
        const basePrice = parseFloat(p.regular_price || p.price || '0');
        const salePrice = p.sale_price ? parseFloat(p.sale_price) : null;
        
        let discountPct = 0;
        if (salePrice && basePrice > 0) {
          discountPct = Math.round(((basePrice - salePrice) / basePrice) * 100);
        }

        const images = p.images && p.images.length > 0 
          ? p.images.map((img: any) => img.src) 
          : ['https://picsum.photos/seed/placeholder/600/800'];

        const colors = p.attributes?.find((a: any) => a.name?.toLowerCase() === 'color')?.options || [];
        const sizes = p.attributes?.find((a: any) => a.name?.toLowerCase() === 'size')?.options || [];

        return {
          id: String(p.id),
          name: p.name,
          slug: p.slug,
          description: p.description || 'No description available.',
          short_description: p.short_description || p.description?.substring(0, 160) || 'No description details.',
          category_id: p.categories && p.categories.length > 0 ? p.categories[0].id : 'cat_apparel',
          brand: p.brands && p.brands.length > 0 ? p.brands[0].name : 'The Style Zone',
          gender: 'unisex',
          base_price: basePrice,
          sale_price: salePrice,
          discount_pct: discountPct,
          images: images,
          tags: p.tags ? p.tags.map((t: any) => t.name) : [],
          is_active: p.status === 'publish',
          is_featured: p.featured || false,
          stock_total: p.stock_quantity !== null && p.stock_quantity !== undefined ? p.stock_quantity : (p.stock_status === 'instock' ? 15 : 0),
          rating_avg: parseFloat(p.average_rating || '0'),
          rating_count: parseInt(p.rating_count || '0'),
          categories: p.categories ? p.categories.map((c: any) => c.name) : [],
          colors: colors,
          sizes: sizes,
          sku: p.sku || '',
          created_at: p.date_created || new Date().toISOString(),
          updated_at: p.date_modified || new Date().toISOString()
        };
      });
      } else {
        console.warn('WooCommerce products data is not an array:', typeof wcProducts, wcProducts);
      }
    } else {
      console.warn('WooCommerce products fetch failed:', productsResult.reason?.message || productsResult.reason);
    }

  } catch (err) {
    console.error('WooCommerce REST sync failed:', err);
    console.warn('Returning empty database state due to API unavailability.');
  }

  return db;
}

