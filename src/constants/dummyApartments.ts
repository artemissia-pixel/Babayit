export interface Apartment {
  id: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  price: number;
  rooms: number;
  floor: number;
  size: number;
  address: string;
  availableFrom: string;
  isBrokerage: boolean;
  images: string[];
}

export const DUMMY_APARTMENTS: Apartment[] = [
  {
    id: '1',
    coordinate: { latitude: 32.0853, longitude: 34.7818 },
    price: 6500,
    rooms: 3,
    floor: 2,
    size: 75,
    address: 'רחוב דיזנגוף 120, תל אביב',
    availableFrom: '01/08/2026',
    isBrokerage: false,
    images: [],
  },
  {
    id: '2',
    coordinate: { latitude: 32.0871, longitude: 34.7845 },
    price: 4800,
    rooms: 2,
    floor: 4,
    size: 55,
    address: 'רחוב בן יהודה 45, תל אביב',
    availableFrom: '15/07/2026',
    isBrokerage: true,
    images: [],
  },
  {
    id: '3',
    coordinate: { latitude: 32.0829, longitude: 34.7792 },
    price: 8200,
    rooms: 4,
    floor: 6,
    size: 110,
    address: 'שדרות רוטשילד 80, תל אביב',
    availableFrom: '01/09/2026',
    isBrokerage: false,
    images: [],
  },
  {
    id: '4',
    coordinate: { latitude: 32.0862, longitude: 34.7801 },
    price: 5500,
    rooms: 3,
    floor: 1,
    size: 68,
    address: 'רחוב אלנבי 70, תל אביב',
    availableFrom: '01/07/2026',
    isBrokerage: false,
    images: [],
  },
  {
    id: '5',
    coordinate: { latitude: 32.0840, longitude: 34.7835 },
    price: 7100,
    rooms: 3.5,
    floor: 3,
    size: 85,
    address: 'רחוב פינסקר 22, תל אביב',
    availableFrom: '15/08/2026',
    isBrokerage: true,
    images: [],
  },
];

export const TEL_AVIV_CENTER = {
  latitude: 32.0853,
  longitude: 34.7818,
  latitudeDelta: 0.04,
  longitudeDelta: 0.04,
};
