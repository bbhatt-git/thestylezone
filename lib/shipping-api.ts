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

export interface Country {
  id: string;
  code: string;
  name: string;
  shipping_cost: number;
  is_active: boolean;
}

export interface District {
  id: string;
  name: string;
  shipping_cost: number;
  is_active: boolean;
}

export interface Municipality {
  id: string;
  district_id: string;
  name: string;
  type: string;
  wards: number;
  shipping_cost: number | null;
  is_active: boolean;
}

export interface StoreSettings {
  id: string;
  auto_approve_reviews: boolean;
}

// Get all countries
export async function getCountries(): Promise<Country[]> {
  const client = getSupabaseClient();
  if (!client) return [];
  
  const { data, error } = await client
    .from('countries')
    .select('*')
    .eq('is_active', true)
    .order('name');
  
  if (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
  
  return data || [];
}

// Get country by code
export async function getCountryByCode(code: string): Promise<Country | null> {
  const client = getSupabaseClient();
  if (!client) return null;
  
  const { data, error } = await client
    .from('countries')
    .select('*')
    .eq('code', code)
    .eq('is_active', true)
    .single();
  
  if (error) {
    console.error('Error fetching country:', error);
    return null;
  }
  
  return data;
}

// Get all districts
export async function getDistricts(): Promise<District[]> {
  const client = getSupabaseClient();
  if (!client) return [];
  
  const { data, error } = await client
    .from('districts')
    .select('*')
    .eq('is_active', true)
    .order('name');
  
  if (error) {
    console.error('Error fetching districts:', error);
    return [];
  }
  
  return data || [];
}

// Get district by name
export async function getDistrictByName(name: string): Promise<District | null> {
  const client = getSupabaseClient();
  if (!client) return null;
  
  const { data, error } = await client
    .from('districts')
    .select('*')
    .eq('name', name)
    .eq('is_active', true)
    .single();
  
  if (error) {
    console.error('Error fetching district:', error);
    return null;
  }
  
  return data;
}

// Get municipalities by district
export async function getMunicipalitiesByDistrict(districtId: string): Promise<Municipality[]> {
  const client = getSupabaseClient();
  if (!client) return [];
  
  const { data, error } = await client
    .from('municipalities')
    .select('*')
    .eq('district_id', districtId)
    .eq('is_active', true)
    .order('name');
  
  if (error) {
    console.error('Error fetching municipalities:', error);
    return [];
  }
  
  return data || [];
}

// Get municipality by name and district
export async function getMunicipalityByName(name: string, districtId: string): Promise<Municipality | null> {
  const client = getSupabaseClient();
  if (!client) return null;
  
  const { data, error } = await client
    .from('municipalities')
    .select('*')
    .eq('name', name)
    .eq('district_id', districtId)
    .eq('is_active', true)
    .single();
  
  if (error) {
    console.error('Error fetching municipality:', error);
    return null;
  }
  
  return data;
}

// Calculate shipping cost based on location
export async function calculateShippingCost(
  countryCode: string,
  districtName?: string,
  municipalityName?: string
): Promise<number> {
  // First get the country rate
  const country = await getCountryByCode(countryCode);
  
  if (!country) {
    return 200; // Default fallback
  }
  
  // If not Nepal, return country rate
  if (countryCode !== 'NP') {
    return country.shipping_cost;
  }
  
  // For Nepal, check municipality first
  if (municipalityName && districtName) {
    const district = await getDistrictByName(districtName);
    if (district) {
      const municipality = await getMunicipalityByName(municipalityName, district.id);
      if (municipality && municipality.shipping_cost !== null) {
        return municipality.shipping_cost;
      }
      // If municipality has no override, use district rate
      return district.shipping_cost;
    }
  }
  
  // If district provided directly
  if (districtName) {
    const district = await getDistrictByName(districtName);
    if (district) {
      return district.shipping_cost;
    }
  }
  
  // Fallback to country rate
  return country.shipping_cost;
}

// Get store settings
export async function getStoreSettings(): Promise<StoreSettings | null> {
  const client = getSupabaseClient();
  if (!client) return null;
  
  const { data, error } = await client
    .from('store_settings')
    .select('*')
    .single();
  
  if (error) {
    console.error('Error fetching store settings:', error);
    return null;
  }
  
  return data;
}
