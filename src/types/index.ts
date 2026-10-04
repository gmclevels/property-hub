export type UserRole = 'seeker' | 'owner' | 'agent' | 'developer' | 'admin';

export type VerificationStatus = 'VERIFIED' | 'VERIFICATION_PENDING' | 'UNVERIFIED';

export type PropertyStatus = 'available' | 'sold' | 'rented' | 'reserved';

export type TransactionType = 'sale' | 'rent';

export type PropertyCategory = 'Residential' | 'Land' | 'Commercial';

export type ResidentialType =
  | 'Detached house'
  | 'Semi-detached house'
  | 'Duplex'
  | 'Bungalow'
  | 'Apartment'
  | 'Flat'
  | 'Mansion'
  | 'Self-contained'
  | 'Room and parlour'
  | 'Studio apartment';

export type LandType =
  | 'Residential land'
  | 'Commercial land'
  | 'Agricultural land'
  | 'Industrial land'
  | 'Mixed-use land';

export type CommercialType =
  | 'Shop'
  | 'Office'
  | 'Warehouse'
  | 'Hotel'
  | 'Event centre'
  | 'Commercial building'
  | 'Estate';

export type DocumentType =
  | 'C of O'
  | 'Deed of Assignment'
  | 'Gazette'
  | 'Registered Survey'
  | "Governor's Consent"
  | 'Excision'
  | 'Other'
  | 'Not specified';

export type RentalFrequency = 'monthly' | 'yearly';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  role: UserRole;
  profilePhoto?: string;
  location?: string;
  businessName?: string;
  about?: string;
  yearsOfExperience?: number;
  officeLocation?: string;
  isSuspended?: boolean;
  createdAt: string;
}

export interface VerificationRecord {
  status: VerificationStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  documentsReviewed?: string[];
  verificationSource?: string;
  notes?: string;
}

export interface Property {
  id: string;
  ownerId: string;
  ownerRole: UserRole;
  sellerName: string;
  sellerPhone: string;
  sellerWhatsapp: string;
  sellerAvatar?: string;
  businessName?: string;
  
  title: string;
  category: PropertyCategory;
  propertyType: string;
  transactionType: TransactionType;
  description: string;
  
  // Location
  state: string;
  lga: string;
  city: string;
  area: string;
  street?: string;
  approximateLocation?: {
    lat: number;
    lng: number;
    addressNote?: string;
  };
  
  // Financials
  price: number; // in Naira
  rentalFrequency?: RentalFrequency;
  
  // Specs
  bedrooms?: number;
  bathrooms?: number;
  toilets?: number;
  landSize?: string; // e.g. "500 sqm", "2 plots"
  buildingSize?: string;
  propertyCondition?: 'brand_new' | 'fairly_used' | 'uncompleted' | 'renovated';
  
  // Land specific
  landPurpose?: 'Residential' | 'Commercial' | 'Agricultural' | 'Industrial' | 'Mixed-use';
  documentType?: DocumentType;
  documentDetails?: string;

  // Amenities & Features
  features: string[];
  images: string[];
  
  // Status & Verification
  status: PropertyStatus;
  verificationStatus: VerificationStatus;
  verificationRecord?: VerificationRecord;
  
  // Stats
  viewsCount: number;
  savesCount: number;
  enquiriesCount: number;
  isFeatured?: boolean;
  isDemo?: boolean; // clearly marks demo listings
  
  createdAt: string;
  updatedAt: string;
}

export interface Enquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyPrice: number;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  sellerId: string;
  message: string;
  status: 'new' | 'contacted' | 'closed';
  createdAt: string;
}

export interface PropertyAlert {
  id: string;
  userId: string;
  propertyType?: string;
  transactionType?: TransactionType;
  state?: string;
  city?: string;
  area?: string;
  minPrice?: number;
  maxPrice?: number;
  requirements?: string;
  active: boolean;
  notificationChannels: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
  };
  createdAt: string;
}

export interface BuyerRequest {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  propertyType: string;
  transactionType: TransactionType;
  state: string;
  city: string;
  area?: string;
  minBudget: number;
  maxBudget: number;
  size?: string;
  purpose?: string;
  requirements: string;
  status: 'open' | 'matched' | 'fulfilled';
  createdAt: string;
}

export interface ListingReport {
  id: string;
  propertyId: string;
  propertyTitle: string;
  reporterId: string;
  reporterName?: string;
  reporterEmail?: string;
  reason:
    | 'suspected_scam'
    | 'incorrect_price'
    | 'property_already_sold'
    | 'property_already_rented'
    | 'false_information'
    | 'duplicate_listing'
    | 'inappropriate_content'
    | 'other';
  description: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  adminNotes?: string;
  createdAt: string;
}

export interface AISearchCriteria {
  rawQuery: string;
  transactionType?: TransactionType;
  propertyType?: string;
  state?: string;
  city?: string;
  area?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  features?: string[];
  keywords?: string[];
}
