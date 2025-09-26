// Base interfaces
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt?: string;
}

// User Management
export interface User extends BaseEntity {
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  isActive: boolean;
  lastLoginAt?: string;
  profileImage?: string;
}

export type UserRole = 'user' | 'manager' | 'admin';

// Vehicle Management
export interface Vehicle extends BaseEntity {
  userId: string;
  licensePlate: string;
  make: string;
  model: string;
  year?: number;
  color: string;
  rfidCard: string;
  isActive: boolean;
  vehicleType: VehicleType;
  user?: User; // Populated when needed
}

export type VehicleType = 'car' | 'motorcycle' | 'truck' | 'van' | 'suv';

// Parking Lot Management
export interface ParkingLot extends BaseEntity {
  name: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  totalSpots: number;
  availableSpots: number;
  hourlyRate: number;
  dailyRate?: number;
  monthlyRate?: number;
  managerId: string;
  isActive: boolean;
  features: ParkingFeature[];
  operatingHours: OperatingHours;
  manager?: User; // Populated when needed
  spots?: ParkingSpot[]; // Populated when needed
}

export type ParkingFeature = 
  | 'covered' 
  | 'electric_charging' 
  | 'security_cameras' 
  | 'valet_service' 
  | 'disabled_access' 
  | 'oversized_vehicles';

export interface OperatingHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface DaySchedule {
  isOpen: boolean;
  openTime?: string; // HH:MM format
  closeTime?: string; // HH:MM format
}

// Parking Spot Management
export interface ParkingSpot extends BaseEntity {
  lotId: string;
  spotNumber: string;
  spotType: SpotType;
  isAvailable: boolean;
  isReserved: boolean;
  isMaintenance: boolean;
  vehicleId?: string;
  rfidReaderId?: string;
  lot?: ParkingLot; // Populated when needed
  vehicle?: Vehicle; // Populated when needed
}

export type SpotType = 'regular' | 'premium' | 'covered' | 'electric' | 'oversized' | 'disabled';

// Booking Management
export interface Booking extends BaseEntity {
  userId: string;
  lotId: string;
  spotId?: string;
  vehicleId: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  totalAmount?: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  specialRequests?: string;
  user?: User; // Populated when needed
  lot?: ParkingLot; // Populated when needed
  spot?: ParkingSpot; // Populated when needed
  vehicle?: Vehicle; // Populated when needed
}

export type BookingStatus = 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled' | 'expired';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'credit_card' | 'debit_card' | 'paypal' | 'apple_pay' | 'google_pay' | 'cash';

// Parking Session Management
export interface ParkingSession extends BaseEntity {
  userId: string;
  vehicleId: string;
  lotId: string;
  spotId: string;
  bookingId?: string;
  checkInTime: string;
  checkOutTime?: string;
  duration?: number; // in minutes
  amount?: number;
  status: SessionStatus;
  checkInMethod: CheckInMethod;
  checkOutMethod?: CheckOutMethod;
  user?: User; // Populated when needed
  vehicle?: Vehicle; // Populated when needed
  lot?: ParkingLot; // Populated when needed
  spot?: ParkingSpot; // Populated when needed
  booking?: Booking; // Populated when needed
}

export type SessionStatus = 'active' | 'completed' | 'overdue';
export type CheckInMethod = 'rfid' | 'qr_code' | 'mobile_app' | 'manual';
export type CheckOutMethod = 'rfid' | 'qr_code' | 'mobile_app' | 'manual' | 'auto';

// Manager Management
export interface Manager extends BaseEntity {
  Id: string;
  email: string;
  name: string;
  phone?: string;
  managedLots?: ParkingLot[]; // Populated when needed
}

export type ManagerPermission = 
  | 'view_sessions' 
  | 'manage_lots' 
  | 'view_analytics' 
  | 'manage_spots' 
  | 'view_reports' 
  | 'manage_users';

// Analytics and Reporting
export interface Analytics {
  totalUsers: number;
  totalVehicles: number;
  totalLots: number;
  totalSpots: number;
  activeSessions: number;
  totalRevenue: number;
  occupancyRate: number;
  averageSessionDuration: number;
  topPerformingLots: LotPerformance[];
  userGrowth: GrowthData[];
  revenueGrowth: GrowthData[];
}

export interface LotPerformance {
  lotId: string;
  lotName: string;
  occupancyRate: number;
  revenue: number;
  sessionCount: number;
  averageDuration: number;
}

export interface GrowthData {
  period: string;
  value: number;
  change: number; // percentage change from previous period
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
export interface sportRequest {
   spotNumber: string,
   isAvailable: boolean,
   isReserved: boolean,
   vehicleId?: string,
   lotname: string

}

// Form Types
export interface CreateUserRequest {
  email: string;
  name: string;
  password: string;
  phone: string;
}

export interface UpdateUserRequest {
  name?: string;
  phone?: string;
  isActive?: boolean;
}

export interface CreateVehicleRequest {
  licensePlate: string;
  make: string;
  model: string;
  color: string;
}

export interface UpdateVehicleRequest {
  licensePlate?: string;
  make?: string;
  model?: string;
  color?: string;
  isActive?: boolean;
}

export interface CreateLotRequest {
  name: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  totalSpots: number;
  hourlyRate: number;
  dailyRate?: number;
  monthlyRate?: number;
  managerId: string;
  features: ParkingFeature[];
  operatingHours: OperatingHours;
}

export interface UpdateLotRequest {
  name?: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  totalSpots?: number;
  hourlyRate?: number;
  dailyRate?: number;
  monthlyRate?: number;
  managerId?: string;
  features?: ParkingFeature[];
  operatingHours?: OperatingHours;
  isActive?: boolean;
}

export interface CreateBookingRequest {
  lotId: string;
  vehicleId: string;
  startTime: string;
  endTime: string;
  specialRequests?: string;
}

export interface UpdateBookingRequest {
  startTime?: string;
  endTime?: string;
  status?: BookingStatus;
  specialRequests?: string;
}

// Dashboard-specific types
export interface DashboardStats {
  totalUsers: number;
  totalVehicles: number;
  totalLots: number;
  activeSessions: number;
  totalRevenue: number;
  occupancyRate: number;
  todaySessions: number;
  todayRevenue: number;
}

export interface UserDashboardData {
  user: User;
  vehicles: Vehicle[];
  bookings: Booking[];
  sessions: ParkingSession[];
  stats: {
    totalBookings: number;
    totalVehicles: number;
    totalSessions: number;
    totalSpent: number;
  };
}

export interface ManagerDashboardData {
  manager: Manager;
  managedLots: ParkingLot[];
  activeSessions: ParkingSession[];
  todaySessions: ParkingSession[];
  stats: {
    activeSessions: number;
    todaySessions: number;
    managedLots: number;
    totalRevenue: number;
  };
}

export interface AdminDashboardData {
  users: User[];
  managers: Manager[];
  lots: ParkingLot[];
  sessions: ParkingSession[];
  bookings: Booking[];
  analytics: Analytics;
}