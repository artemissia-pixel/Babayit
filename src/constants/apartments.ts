export interface Apartment {
  id: string
  lat: number
  lng: number
  price: number          // base rent
  bills: number          // avg monthly bills (water + electricity)
  rooms: number
  floor: number
  size: number
  address: string
  availableFrom: string
  isBrokerage: boolean
  phone: string
  whatsapp?: string      // present only if landlord enabled it
}

export const APARTMENTS: Apartment[] = [
  {
    id: '1',
    lat: 32.0853,
    lng: 34.7818,
    price: 6500,
    bills: 450,
    rooms: 3,
    floor: 2,
    size: 75,
    address: 'רחוב דיזנגוף 120, תל אביב',
    availableFrom: '01/08/2026',
    isBrokerage: false,
    phone: '052-1234567',
    whatsapp: '972521234567',
  },
  {
    id: '2',
    lat: 32.0871,
    lng: 34.7845,
    price: 4800,
    bills: 380,
    rooms: 2,
    floor: 4,
    size: 55,
    address: 'רחוב בן יהודה 45, תל אביב',
    availableFrom: '15/07/2026',
    isBrokerage: true,
    phone: '054-9876543',
  },
  {
    id: '3',
    lat: 32.0829,
    lng: 34.7792,
    price: 8200,
    bills: 600,
    rooms: 4,
    floor: 6,
    size: 110,
    address: 'שדרות רוטשילד 80, תל אביב',
    availableFrom: '01/09/2026',
    isBrokerage: false,
    phone: '050-5556789',
    whatsapp: '972505556789',
  },
  {
    id: '4',
    lat: 32.0862,
    lng: 34.7801,
    price: 5500,
    bills: 420,
    rooms: 3,
    floor: 1,
    size: 68,
    address: 'רחוב אלנבי 70, תל אביב',
    availableFrom: '01/07/2026',
    isBrokerage: false,
    phone: '053-3334455',
  },
  {
    id: '5',
    lat: 32.084,
    lng: 34.7835,
    price: 7100,
    bills: 510,
    rooms: 3,
    floor: 3,
    size: 85,
    address: 'רחוב פינסקר 22, תל אביב',
    availableFrom: '15/08/2026',
    isBrokerage: true,
    phone: '058-7778899',
    whatsapp: '972587778899',
  },
]

export const TEL_AVIV_CENTER = { lat: 32.0853, lng: 34.7818 }
