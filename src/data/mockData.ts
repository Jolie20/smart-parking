import { User, Vehicle, ParkingLot, ParkingSpot, Booking, ParkingSession } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'jolie@gmail.com',
    name: 'Jolie',
    role: 'user',
    phone: '+250786862905',
    createdAt: '2025-08-29T00:00:00Z'
  },
  {
    id: '2',
    email: 'amandine@gmail.com',
    name: 'Amandine',
    role: 'manager',
    phone: '+250786862905',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: '3',
    email: 'gikundiro@gmail.com',
    name: 'GIKUNDIRO',
    role: 'admin',
    phone: '+250786862905',
    createdAt: '2025-01-01T00:00:00Z'
  }
];

export const mockVehicles: Vehicle[] = [
  {
    id: '1',
    userId: '1',
    licensePlate: 'ABC123',
    make: 'Toyota',
    model: 'Camry',
    color: 'Blue',
    rfidCard: 'RFID001'
  },
  {
    id: '2',
    userId: '2',
    licensePlate: 'XYZ789',
    make: 'Honda',
    model: 'Civic',
    color: 'Red',
    rfidCard: 'RFID002'
  }
];

export const mockParkingLots: ParkingLot[] = [
  {
    id: '1',
    name: 'Downtown Plaza',
    address: '123 Main St, Downtown',
    totalSpots: 50,
    availableSpots: 23,
    hourlyRate: 300,
    managerId: '1'
  },
  {
    id: '2',
    name: 'Mall Parking',
    address: '456 Shopping Ave',
    totalSpots: 100,
    availableSpots: 67,
    hourlyRate: 3.50,
    managerId: '2'
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
    totalAmount: 10.00
  },
  {
    id: '2',
    userId: '1',
    lotId: '1',
    spotId: '2',
    vehicleId: '1',
    startTime: '2024-01-16T14:00:00Z',
    endTime: '2024-01-16T16:00:00Z',
    status: 'booked'
  }
];

export const mockParkingSessions: ParkingSession[] = [
  {
    id: '1',
    userId: '1',
    vehicleId: '1',
    lotId: '1',
    spotId: '1',
    checkInTime: '2024-01-15T10:00:00Z',
    checkOutTime: '2024-01-15T12:00:00Z',
    duration: 120,
    amount: 10.00,
    status: 'completed'
  },
  {
    id: '2',
    userId: '1',
    vehicleId: '1',
    lotId: '1',
    spotId: '3',
    checkInTime: '2024-01-16T09:00:00Z',
    status: 'active'
  }
];