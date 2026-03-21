// ─── Domain Types ─────────────────────────────────────────────────────────────

export type VehicleSize = 'SMALL' | 'MEDIUM' | 'SUV' | 'LARGE';
export type ServiceCategory = 'INTERIOR' | 'EXTERIOR';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
export type UserRole = 'ADMIN' | 'WORKER';

export interface Service {
  id: string;
  name: string;
  namePt: string;
  nameEn: string;
  descriptionPt: string | null;
  descriptionEn: string | null;
  includesPt: string[];
  includesEn: string[];
  price: number;
  duration: number;
  category: ServiceCategory;
  isActive: boolean;
  sortOrder: number;
}

export interface Addon {
  id: string;
  name: string;
  namePt: string;
  nameEn: string;
  price: number;
  duration: number;
  isActive: boolean;
  sortOrder: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  carModel: string;
  licensePlate: string;
  notes: string | null;
}

export interface BookingAddon {
  id: string;
  addonId: string;
  addon: Addon;
}

export interface Booking {
  id: string;
  customerId: string;
  customer: Customer;
  serviceId: string;
  service: Service;
  addons: BookingAddon[];
  vehicleSize: VehicleSize;
  date: string | Date;
  startTime: string;
  endTime: string;
  totalDuration: number;
  totalPrice: number;
  vehicleAdjustment: number;
  depositAmount: number;
  remainingAmount: number;
  status: BookingStatus;
  stripeSessionId: string | null;
  stripePaymentId: string | null;
  cancelledAt: string | Date | null;
  createdAt: string | Date;
}

export interface GalleryImage {
  id: string;
  beforeImageUrl: string;
  afterImageUrl: string;
  description: string | null;
  descriptionPt: string | null;
  descriptionEn: string | null;
  servicePerformed: string | null;
  isActive: boolean;
  sortOrder: number;
}

export interface BlockedSlot {
  id: string;
  date: string | Date;
  startTime: string;
  endTime: string;
  reason: string | null;
}

// ─── Booking Wizard State ─────────────────────────────────────────────────────

export interface CustomerForm {
  name: string;
  email: string;
  phone: string;
  carModel: string;
  licensePlate: string;
  notes: string;
}

export type BookingStep = 1 | 2 | 3 | 4 | 5;

export interface BookingState {
  step: BookingStep;
  vehicleSize: VehicleSize | null;
  service: Service | null;
  selectedAddons: Addon[];
  date: string | null;
  startTime: string | null;
  customer: CustomerForm;
  totalPrice: number;
  totalDuration: number;
  vehicleAdjustment: number;
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface AvailabilityResponse {
  slots: string[];
  date: string;
  duration: number;
}

export interface CreateBookingPayload {
  vehicleSize: VehicleSize;
  serviceId: string;
  addonIds: string[];
  date: string;
  startTime: string;
  customer: CustomerForm;
  totalPrice: number;
  totalDuration: number;
  vehicleAdjustment: number;
}

// ─── NextAuth Extensions ──────────────────────────────────────────────────────

declare module 'next-auth' {
  interface User {
    id: string;
    role: UserRole;
  }
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: UserRole;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: UserRole;
  }
}
