import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api';
import * as sqlite from './sqlite';

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

// Helper function to get order by order number (using SQLite)
export function getOrderByNumber(orderNumber: string): any | null {
  try {
    return sqlite.getOrderByOrderNumber(orderNumber);
  } catch (err) {
    console.warn('Failed to get order from SQLite, using memory data:', err);
    return memoryData.orders.find(o => o.order_number.toLowerCase() === orderNumber.toLowerCase()) || null;
  }
}

// Helper function to get order items by order ID (using SQLite)
export function getOrderItems(orderId: string): any[] {
  try {
    return sqlite.getOrderItemsByOrderId(orderId);
  } catch (err) {
    console.warn('Failed to get order items from SQLite, using memory data:', err);
    return memoryData.orderItems.filter(item => item.order_id === orderId);
  }
}

export async function saveDb(db: DbData): Promise<void> {
  // Update in-memory runtime data (for backward compatibility)
  memoryData.orders = db.orders;
  memoryData.orderItems = db.orderItems;
  memoryData.notifications = db.notifications;
  memoryData.coupons = db.coupons;
  memoryData.paymentQrConfigs = db.paymentQrConfigs;
  memoryData.reviews = db.reviews;

  // Persist to SQLite database
  try {
    // Save orders
    for (const order of db.orders) {
      sqlite.saveOrder(order);
    }

    // Save order items
    for (const item of db.orderItems) {
      sqlite.saveOrderItem(item);
    }

    // Save coupons
    for (const coupon of db.coupons) {
      sqlite.saveCoupon(coupon);
    }

    // Save notifications
    for (const notification of db.notifications) {
      sqlite.saveNotification(notification);
    }

    // Save reviews
    for (const review of db.reviews) {
      sqlite.saveReview(review);
    }

    // Save payment QR configs
    for (const config of db.paymentQrConfigs) {
      sqlite.savePaymentQrConfig(config);
    }
  } catch (err) {
    console.error('Failed to save to SQLite:', err);
    // Don't throw - we still have memory fallback
  }
}

export async function readDb(): Promise<DbData> {
  let db: DbData = { ...memoryData };

  // Try to load persistent data from SQLite
  try {
    db.orders = sqlite.getAllOrders();
    
    // Load all order items for backward compatibility
    const allOrderItems: any[] = [];
    for (const order of db.orders) {
      const items = sqlite.getOrderItemsByOrderId(order.id);
      allOrderItems.push(...items);
    }
    db.orderItems = allOrderItems;
    
    db.notifications = sqlite.getAllNotifications();
    db.coupons = sqlite.getAllCoupons();
    db.reviews = sqlite.getAllReviews();
    db.paymentQrConfigs = sqlite.getPaymentQrConfigs();
  } catch (err) {
    console.warn('Failed to load from SQLite, using memory data:', err);
    // Fall back to memory data if SQLite is not available
    db.orders = memoryData.orders;
    db.orderItems = memoryData.orderItems;
    db.notifications = memoryData.notifications;
    db.coupons = memoryData.coupons;
    db.reviews = memoryData.reviews;
    db.paymentQrConfigs = memoryData.paymentQrConfigs;
  }

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
        // First, fetch variations for variable products
        const variableProducts = wcProducts.filter((p: any) => p.type === 'variable');
        
        for (const product of variableProducts) {
          try {
            const variationsResult = await api.get(`products/${product.id}/variations`, { per_page: 100 });
            if (variationsResult.data && Array.isArray(variationsResult.data)) {
              const variations = variationsResult.data;
              const productVariants: ProductVariant[] = variations.map((v: any) => {
                // Extract size and color from variation attributes
                const sizeAttr = v.attributes?.find((a: any) => a.name?.toLowerCase() === 'size');
                const colorAttr = v.attributes?.find((a: any) => a.name?.toLowerCase() === 'color');
                
                return {
                  id: String(v.id),
                  product_id: String(product.id),
                  size: sizeAttr?.option || 'M',
                  color: colorAttr?.option || 'Default',
                  color_hex: '978877', // Default hex color
                  sku: v.sku || '',
                  stock: v.stock_quantity || (v.stock_status === 'instock' ? 10 : 0),
                  price_delta: v.price ? (parseFloat(v.price) - parseFloat(product.regular_price || product.price || '0')) : 0,
                  is_active: v.status === 'publish',
                  created_at: v.date_created || new Date().toISOString()
                };
              });
              
              // Only add variants that don't already exist
              productVariants.forEach(variant => {
                if (!db.variants.some(v => v.id === variant.id)) {
                  db.variants.push(variant);
                }
              });
            }
          } catch (varErr) {
            console.warn(`Failed to fetch variations for product ${product.id}:`, varErr);
          }
        }
        
        // Create default variants for simple products
        const simpleProducts = wcProducts.filter((p: any) => p.type === 'simple');
        for (const product of simpleProducts) {
          const existingVariant = db.variants.find(v => v.product_id === String(product.id));
          if (!existingVariant) {
            const colors = product.attributes?.find((a: any) => a.name?.toLowerCase() === 'color')?.options || [];
            const sizes = product.attributes?.find((a: any) => a.name?.toLowerCase() === 'size')?.options || [];
            
            const defaultVariant: ProductVariant = {
              id: `var_${product.id}`,
              product_id: String(product.id),
              size: sizes[0] || 'M',
              color: colors[0] || 'Default',
              color_hex: '978877',
              sku: product.sku || '',
              stock: product.stock_quantity || (product.stock_status === 'instock' ? 10 : 0),
              price_delta: 0,
              is_active: product.status === 'publish',
              created_at: product.date_created || new Date().toISOString()
            };
            db.variants.push(defaultVariant);
          }
        }
        
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

        // For variable products, get colors and sizes from variants
        if (p.type === 'variable') {
          const productVariants = db.variants.filter(v => v.product_id === String(p.id));
          if (productVariants.length > 0) {
            const variantColors = [...new Set(productVariants.map(v => v.color).filter(c => c && c !== 'Default'))];
            const variantSizes = [...new Set(productVariants.map(v => v.size).filter(s => s))];
            if (variantColors.length > 0) {
              colors.length = 0;
              colors.push(...variantColors);
            }
            if (variantSizes.length > 0) {
              sizes.length = 0;
              sizes.push(...variantSizes);
            }
          }
        }

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

