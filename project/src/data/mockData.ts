import { 
  User, 
  Vehicle, 
  ParkingLot, 
  ParkingSpot, 
  Booking, 
  ParkingSession, 
  Manager,
  Analytics,
  DashboardStats
} from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'jolie@gmail.com',
    name: 'Jolie',
    role: 'user',
    phone: '+250786862905',
    isActive: true,
    createdAt: '2025-08-29T00:00:00Z',
    lastLoginAt: '2025-01-15T08:30:00Z'
  },
  {
    id: '2',
    email: 'amandine@gmail.com',
    name: 'Amandine',
    role: 'manager',
    phone: '+250786862905',
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
    lastLoginAt: '2025-01-15T09:15:00Z'
  },
  {
    id: '3',
    email: 'gikundiro@gmail.com',
    name: 'GIKUNDIRO',
    role: 'admin',
    phone: '+250786862905',
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
    lastLoginAt: '2025-01-15T07:45:00Z'
  },
  {
    id: '4',
    email: 'john.doe@gmail.com',
    name: 'John Doe',
    role: 'user',
    phone: '+250786862906',
    isActive: true,
    createdAt: '2025-01-10T00:00:00Z',
    lastLoginAt: '2025-01-14T16:20:00Z'
  }
];

export const mockVehicles: Vehicle[] = [
  {
    id: '1',
    userId: '1',
    licensePlate: 'RAC123',
    make: 'Toyota',
    model: 'Camry',
    year: 2020,
    color: 'Blue',
    rfidCard: 'RFID001',
    isActive: true,
    vehicleType: 'car',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: '2',
    userId: '2',
    licensePlate: 'RAD789',
    make: 'Honda',
    model: 'Civic',
    year: 2019,
    color: 'Red',
    rfidCard: 'RFID002',
    isActive: true,
    vehicleType: 'car',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: '3',
    userId: '4',
    licensePlate: 'DEF456',
    make: 'BMW',
    model: 'X5',
    year: 2021,
    color: 'Black',
    rfidCard: 'RFID003',
    isActive: true,
    vehicleType: 'suv',
    createdAt: '2025-01-10T00:00:00Z'
  }
];

export const mockParkingLots: ParkingLot[] = [
  {
    id: '1',
    name: 'Downtown Plaza',
<<<<<<< HEAD
    address: 'KN4 Ave',
=======
    description: 'Premium parking in the heart of downtown',
    address: '123 Main St',
    city: 'Downtown',
    state: 'CA',
    zipCode: '90210',
    coordinates: {
      latitude: 34.0522,
      longitude: -118.2437
    },
>>>>>>> 286d2779cbcd9224bc3c4a387af14aac7de1f27f
    totalSpots: 50,
    availableSpots: 23,
    hourlyRate: 3.00,
    dailyRate: 25.00,
    monthlyRate: 400.00,
    managerId: '2',
    isActive: true,
    features: ['covered', 'security_cameras', 'disabled_access'],
    operatingHours: {
      monday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      tuesday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      wednesday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      thursday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      friday: { isOpen: true, openTime: '06:00', closeTime: '23:00' },
      saturday: { isOpen: true, openTime: '07:00', closeTime: '23:00' },
      sunday: { isOpen: true, openTime: '08:00', closeTime: '21:00' }
    },
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: '2',
<<<<<<< HEAD
    name: 'Chic Mall ',
    address: 'KN4 Ave',
=======
    name: 'Mall Parking',
    description: 'Convenient parking at the shopping mall',
    address: '456 Shopping Ave',
    city: 'Mall District',
    state: 'CA',
    zipCode: '90211',
    coordinates: {
      latitude: 34.0523,
      longitude: -118.2438
    },
>>>>>>> 286d2779cbcd9224bc3c4a387af14aac7de1f27f
    totalSpots: 100,
    availableSpots: 67,
    hourlyRate: 2.50,
    dailyRate: 20.00,
    monthlyRate: 300.00,
    managerId: '2',
    isActive: true,
    features: ['electric_charging', 'oversized_vehicles'],
    operatingHours: {
      monday: { isOpen: true, openTime: '08:00', closeTime: '22:00' },
      tuesday: { isOpen: true, openTime: '08:00', closeTime: '22:00' },
      wednesday: { isOpen: true, openTime: '08:00', closeTime: '22:00' },
      thursday: { isOpen: true, openTime: '08:00', closeTime: '22:00' },
      friday: { isOpen: true, openTime: '08:00', closeTime: '23:00' },
      saturday: { isOpen: true, openTime: '09:00', closeTime: '23:00' },
      sunday: { isOpen: true, openTime: '10:00', closeTime: '21:00' }
    },
    createdAt: '2025-01-01T00:00:00Z'
  }
];

export const mockParkingSpots: ParkingSpot[] = [
  {
    id: '1',
    lotId: '1',
    spotNumber: 'A1',
    spotType: 'regular',
    isAvailable: false,
    isReserved: false,
    isMaintenance: false,
    vehicleId: '1',
    rfidReaderId: 'READER001',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: '2',
    lotId: '1',
    spotNumber: 'A2',
    spotType: 'premium',
    isAvailable: true,
    isReserved: false,
    isMaintenance: false,
    rfidReaderId: 'READER002',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: '3',
    lotId: '1',
    spotNumber: 'A3',
    spotType: 'electric',
    isAvailable: false,
    isReserved: false,
    isMaintenance: false,
    vehicleId: '3',
    rfidReaderId: 'READER003',
    createdAt: '2025-01-01T00:00:00Z'
  }
];

export const mockBookings: Booking[] = [
  {
    id: '1',
    userId: '1',
    lotId: '1',
    spotId: '1',
    vehicleId: '1',
    startTime: '2024-01-15T10:00:00Z',
    endTime: '2024-01-15T12:00:00Z',
    status: 'completed',
<<<<<<< HEAD
    totalAmount: 400.00
=======
    totalAmount: 6.00,
    paymentStatus: 'paid',
    paymentMethod: 'credit_card',
    createdAt: '2024-01-15T09:30:00Z'
>>>>>>> 286d2779cbcd9224bc3c4a387af14aac7de1f27f
  },
  {
    id: '2',
    userId: '1',
    lotId: '1',
    spotId: '2',
    vehicleId: '1',
<<<<<<< HEAD
    startTime: '2025-09-16T14:00:00Z',
    endTime: '2025-09-16T16:00:00Z',
    status: 'booked'
=======
    startTime: '2024-01-16T14:00:00Z',
    endTime: '2024-01-16T16:00:00Z',
    status: 'confirmed',
    totalAmount: 6.00,
    paymentStatus: 'paid',
    paymentMethod: 'credit_card',
    createdAt: '2024-01-16T13:30:00Z'
  },
  {
    id: '3',
    userId: '4',
    lotId: '2',
    vehicleId: '3',
    startTime: '2024-01-17T09:00:00Z',
    endTime: '2024-01-17T17:00:00Z',
    status: 'active',
    totalAmount: 20.00,
    paymentStatus: 'paid',
    paymentMethod: 'apple_pay',
    specialRequests: 'Electric vehicle charging needed',
    createdAt: '2024-01-17T08:30:00Z'
>>>>>>> 286d2779cbcd9224bc3c4a387af14aac7de1f27f
  }
];

export const mockParkingSessions: ParkingSession[] = [
  {
    id: '1',
    userId: '1',
    vehicleId: '1',
    lotId: '1',
    spotId: '1',
<<<<<<< HEAD
    checkInTime: '2025-09-15T10:00:00Z',
    checkOutTime: '2025-09-15T12:00:00Z',
    duration: 120,
    amount: 400.00,
    status: 'completed'
=======
    bookingId: '1',
    checkInTime: '2024-01-15T10:00:00Z',
    checkOutTime: '2024-01-15T12:00:00Z',
    duration: 120,
    amount: 6.00,
    status: 'completed',
    checkInMethod: 'rfid',
    checkOutMethod: 'rfid',
    createdAt: '2024-01-15T10:00:00Z'
>>>>>>> 286d2779cbcd9224bc3c4a387af14aac7de1f27f
  },
  {
    id: '2',
    userId: '4',
    vehicleId: '3',
    lotId: '2',
    spotId: '3',
<<<<<<< HEAD
    checkInTime: '2025-09-16T09:00:00Z',
    status: 'active'
=======
    bookingId: '3',
    checkInTime: '2024-01-17T09:00:00Z',
    status: 'active',
    checkInMethod: 'mobile_app',
    createdAt: '2024-01-17T09:00:00Z'
>>>>>>> 286d2779cbcd9224bc3c4a387af14aac7de1f27f
  }
];

export const mockManagers: Manager[] = [
  {
    id: '1',
    userId: '2',
    employeeId: 'EMP001',
    department: 'Operations',
    permissions: ['view_sessions', 'manage_lots', 'view_analytics', 'manage_spots', 'view_reports'],
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  }
];

export const mockDashboardStats: DashboardStats = {
  totalUsers: 4,
  totalVehicles: 3,
  totalLots: 2,
  activeSessions: 1,
  totalRevenue: 26.00,
  occupancyRate: 23,
  todaySessions: 1,
  todayRevenue: 20.00
};

export const mockAnalytics: Analytics = {
  totalUsers: 4,
  totalVehicles: 3,
  totalLots: 2,
  totalSpots: 150,
  activeSessions: 1,
  totalRevenue: 26.00,
  occupancyRate: 23,
  averageSessionDuration: 120,
  topPerformingLots: [
    {
      lotId: '1',
      lotName: 'Downtown Plaza',
      occupancyRate: 46,
      revenue: 6.00,
      sessionCount: 1,
      averageDuration: 120
    },
    {
      lotId: '2',
      lotName: 'Mall Parking',
      occupancyRate: 33,
      revenue: 20.00,
      sessionCount: 1,
      averageDuration: 480
    }
  ],
  userGrowth: [
    { period: '2024-12', value: 2, change: 0 },
    { period: '2025-01', value: 4, change: 100 }
  ],
  revenueGrowth: [
    { period: '2024-12', value: 0, change: 0 },
    { period: '2025-01', value: 26.00, change: 0 }
  ]
};