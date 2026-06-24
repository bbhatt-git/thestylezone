export interface District {
  id: string;
  name: string;
  shipping_cost: number;
}

export const NEPAL_DISTRICTS: District[] = [
  { id: '1', name: 'Achham', shipping_cost: 200 },
  { id: '2', name: 'Arghakhanchi', shipping_cost: 200 },
  { id: '3', name: 'Baglung', shipping_cost: 200 },
  { id: '4', name: 'Baitadi', shipping_cost: 200 },
  { id: '5', name: 'Bajhang', shipping_cost: 200 },
  { id: '6', name: 'Bajura', shipping_cost: 200 },
  { id: '7', name: 'Banke', shipping_cost: 200 },
  { id: '8', name: 'Bara', shipping_cost: 200 },
  { id: '9', name: 'Bardiya', shipping_cost: 200 },
  { id: '10', name: 'Bhaktapur', shipping_cost: 200 },
  { id: '11', name: 'Bhojpur', shipping_cost: 200 },
  { id: '12', name: 'Chitwan', shipping_cost: 200 },
  { id: '13', name: 'Dadeldhura', shipping_cost: 200 },
  { id: '14', name: 'Dailekh', shipping_cost: 200 },
  { id: '15', name: 'Dang', shipping_cost: 200 },
  { id: '16', name: 'Darchula', shipping_cost: 200 },
  { id: '17', name: 'Dhading', shipping_cost: 200 },
  { id: '18', name: 'Dhankuta', shipping_cost: 200 },
  { id: '19', name: 'Dhanusa', shipping_cost: 200 },
  { id: '20', name: 'Dolakha', shipping_cost: 200 },
  { id: '21', name: 'Dolpa', shipping_cost: 200 },
  { id: '22', name: 'Doti', shipping_cost: 200 },
  { id: '23', name: 'Eastern Rukum', shipping_cost: 200 },
  { id: '24', name: 'Gorkha', shipping_cost: 200 },
  { id: '25', name: 'Gulmi', shipping_cost: 200 },
  { id: '26', name: 'Humla', shipping_cost: 200 },
  { id: '27', name: 'Ilam', shipping_cost: 200 },
  { id: '28', name: 'Jajarkot', shipping_cost: 200 },
  { id: '29', name: 'Jhapa', shipping_cost: 200 },
  { id: '30', name: 'Jumla', shipping_cost: 200 },
  { id: '31', name: 'Kailali', shipping_cost: 200 },
  { id: '32', name: 'Kalikot', shipping_cost: 200 },
  { id: '33', name: 'Kapilvastu', shipping_cost: 200 },
  { id: '34', name: 'Kaski', shipping_cost: 200 },
  { id: '35', name: 'Kathmandu', shipping_cost: 200 },
  { id: '36', name: 'Kavrepalanchok', shipping_cost: 200 },
  { id: '37', name: 'Khotang', shipping_cost: 200 },
  { id: '38', name: 'Lalitpur', shipping_cost: 200 },
  { id: '39', name: 'Lamjung', shipping_cost: 200 },
  { id: '40', name: 'Mahottari', shipping_cost: 200 },
  { id: '41', name: 'Makwanpur', shipping_cost: 200 },
  { id: '42', name: 'Manang', shipping_cost: 200 },
  { id: '43', name: 'Mugu', shipping_cost: 200 },
  { id: '44', name: 'Mustang', shipping_cost: 200 },
  { id: '45', name: 'Myagdi', shipping_cost: 200 },
  { id: '46', name: 'Nawalparasi (Bardaghat)', shipping_cost: 200 },
  { id: '47', name: 'Nawalparasi (Ramgram)', shipping_cost: 200 },
  { id: '48', name: 'Nuwakot', shipping_cost: 200 },
  { id: '49', name: 'Okhaldhunga', shipping_cost: 200 },
  { id: '50', name: 'Palpa', shipping_cost: 200 },
  { id: '51', name: 'Panchthar', shipping_cost: 200 },
  { id: '52', name: 'Parasi', shipping_cost: 200 },
  { id: '53', name: 'Parbat', shipping_cost: 200 },
  { id: '54', name: 'Parsa', shipping_cost: 200 },
  { id: '55', name: 'Pyuthan', shipping_cost: 200 },
  { id: '56', name: 'Ramechhap', shipping_cost: 200 },
  { id: '57', name: 'Rasuwa', shipping_cost: 200 },
  { id: '58', name: 'Rautahat', shipping_cost: 200 },
  { id: '59', name: 'Rolpa', shipping_cost: 200 },
  { id: '60', name: 'Rupandehi', shipping_cost: 200 },
  { id: '61', name: 'Salyan', shipping_cost: 200 },
  { id: '62', name: 'Sankhuwasabha', shipping_cost: 200 },
  { id: '63', name: 'Saptari', shipping_cost: 200 },
  { id: '64', name: 'Sarlahi', shipping_cost: 200 },
  { id: '65', name: 'Sindhuli', shipping_cost: 200 },
  { id: '66', name: 'Sindhupalcok', shipping_cost: 200 },
  { id: '67', name: 'Siraha', shipping_cost: 200 },
  { id: '68', name: 'Solukhumbu', shipping_cost: 200 },
  { id: '69', name: 'Sunsari', shipping_cost: 200 },
  { id: '70', name: 'Surkhet', shipping_cost: 200 },
  { id: '71', name: 'Syangja', shipping_cost: 200 },
  { id: '72', name: 'Tanahu', shipping_cost: 200 },
  { id: '73', name: 'Taplejung', shipping_cost: 200 },
  { id: '74', name: 'Terhathum', shipping_cost: 200 },
  { id: '75', name: 'Udayapur', shipping_cost: 200 },
  { id: '76', name: 'Western Rukum', shipping_cost: 200 },
  { id: '77', name: 'Sindhupalchok', shipping_cost: 200 },
];

export const INTERNATIONAL_SHIPPING_COST = 2500;

export function getDistricts(): District[] {
  return NEPAL_DISTRICTS;
}

export function getDistrictById(id: string): District | undefined {
  return NEPAL_DISTRICTS.find(d => d.id === id);
}

export function getDistrictByName(name: string): District | undefined {
  return NEPAL_DISTRICTS.find(d => d.name === name);
}

export function calculateShippingCost(countryCode: string, districtId?: string): number {
  if (countryCode !== 'NP') {
    return INTERNATIONAL_SHIPPING_COST;
  }
  
  if (districtId) {
    const district = getDistrictById(districtId);
    if (district) {
      return district.shipping_cost;
    }
  }
  
  return 200; // Default Nepal rate
}
