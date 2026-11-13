export type NavTab = 'explore' | 'destinations' | 'saved' | 'trips' | 'host';

export type StayCategory =
  | 'All Stays'
  | 'Cliffside Villas'
  | 'Beachfront'
  | 'Heritage'
  | 'Workation Studios';

export type CoastalRegion =
  | 'All Coastline'
  | 'North Goa'
  | 'South Goa'
  | 'Gokarna'
  | 'Alibaug'
  | 'Varkala';

export type ImageKey =
  | 'hero_cliff'
  | 'morjim_villa'
  | 'gokarna_cliff'
  | 'alibaug_courtyard'
  | 'varkala_studio'
  | 'south_goa_heritage';

export interface HostProfile {
  name: string;
  sinceYear: number;
  responseTime: string;
  phone: string;
  languages: string[];
  bio: string;
}

export interface Stay {
  id: string;
  title: string;
  region: Exclude<CoastalRegion, 'All Coastline'>;
  locationDetail: string;
  category: Exclude<StayCategory, 'All Stays'>;
  imageKey: ImageKey;
  nightlyRateInr: number;
  cleaningFeeInr: number;
  maxGuests: number;
  bedrooms: number;
  shoreDistance: string;
  rating: number;
  reviewCount: number;
  instantDirect: boolean;
  amenities: string[];
  highlights: string[];
  houseRules: string[];
  description: string;
  host: HostProfile;
}

export interface BookingAddon {
  id: string;
  label: string;
  priceInr: number;
  perNight?: boolean;
}

export interface Booking {
  id: string;
  reference: string;
  stayId: string;
  stayTitle: string;
  region: string;
  imageKey: ImageKey;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  arrivalNote: string;
  selectedAddons: string[];
  subtotalInr: number;
  cleaningFeeInr: number;
  addonsTotalInr: number;
  brokerageInr: number;
  totalInr: number;
  estimatedOtaSavingsInr: number;
  status: 'Confirmed' | 'Cancelled';
  createdAt: string;
  hostName: string;
  hostPhone: string;
}

export interface HostInquiry {
  id: string;
  stayId: string;
  stayTitle: string;
  hostName: string;
  senderName: string;
  senderContact: string;
  message: string;
  hostReply: string;
  createdAt: string;
}

export interface DestinationInfo {
  region: Exclude<CoastalRegion, 'All Coastline'>;
  subtitle: string;
  bestSeason: string;
  coastCharacter: string;
  avgDirectRateInr: number;
  imageKey: ImageKey;
  summary: string;
}
