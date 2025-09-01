export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'manager' | 'admin';
  phone?: string;
  createdAt: string;
}

export interface Vehicle {
  id: string;
  userId: string;
  licensePlate: string;
  make: string;
  model: string;
  color: string;
  rfidCard: string;
}

export interface ParkingLot {
  id: string;
  name: string;
  address: string;
  totalSpots: number;
  availableSpots: number;
  hourlyRate: number;
  managerId: string;
}

export interface ParkingSpot {
  id: string;
  lotId: string;
  spotNumber: string;
  isAvailable: boolean;
  isReserved: boolean;
  vehicleId?: string;
}

export interface Booking {
  id: string;
  userId: string;
  lotId: string;
  spotId: string;
  vehicleId: string;
  startTime: string;
  endTime: string;
  status: 'booked' | 'active' | 'completed' | 'cancelled';
  totalAmount?: number;
}

export interface ParkingSession {
  id: string;
  userId: string;
  vehicleId: string;
  lotId: string;
  spotId: string;
  checkInTime: string;
  checkOutTime?: string;
  duration?: number;
  amount?: number;
  status: 'active' | 'completed';
}