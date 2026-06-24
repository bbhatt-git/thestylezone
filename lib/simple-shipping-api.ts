import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let supabase: any = null;

function getSupabaseClient() {
  if (!supabase && supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabase;
}

export interface ShippingCost {
  id: number;
  district_name: string;
  shipping_cost: number;
  updated_at: string;
}

export interface StoreConfig {
  id: number;
  key: string;
  value: string;
  updated_at: string;
}

// Get all shipping costs
export async function getShippingCosts(): Promise<ShippingCost[]> {
  const client = getSupabaseClient();
  if (!client) return [];
  
  const { data, error } = await client
    .from('shipping_costs')
    .select('*')
    .order('district_name');
  
  if (error) {
    console.error('Error fetching shipping costs:', error);
    return [];
  }
  
  return data || [];
}

// Get shipping cost by district name
export async function getShippingCostByDistrict(districtName: string): Promise<ShippingCost | null> {
  const client = getSupabaseClient();
  if (!client) return null;
  
  const { data, error } = await client
    .from('shipping_costs')
    .select('*')
    .eq('district_name', districtName)
    .single();
  
  if (error) {
    console.error('Error fetching shipping cost:', error);
    return null;
  }
  
  return data;
}

// Get store config value
export async function getStoreConfig(key: string): Promise<string | null> {
  const client = getSupabaseClient();
  if (!client) return null;
  
  const { data, error } = await client
    .from('store_config')
    .select('value')
    .eq('key', key)
    .single();
  
  if (error) {
    console.error('Error fetching store config:', error);
    return null;
  }
  
  return data?.value || null;
}

// Calculate shipping cost
export async function calculateShippingCost(countryCode: string, districtName?: string): Promise<number> {
  // Get international shipping cost
  const internationalCost = await getStoreConfig('international_shipping_cost');
  const intlRate = internationalCost ? parseInt(internationalCost) : 2500;
  
  // If not Nepal, return international rate
  if (countryCode !== 'NP') {
    return intlRate;
  }
  
  // For Nepal, use district shipping cost
  if (districtName) {
    const districtCost = await getShippingCostByDistrict(districtName);
    if (districtCost) {
      return districtCost.shipping_cost;
    }
  }
  
  // Fallback to default Nepal rate
  return 200;
}
