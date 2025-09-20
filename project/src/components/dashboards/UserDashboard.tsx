import React, { useState, useEffect } from 'react';
import { Car, MapPin, Clock, CreditCard, Plus, Calendar, Activity, User, Phone, Mail, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.tsx';
import { vehicleService } from '../../services/vehicleService';
import { bookingService } from '../../services/bookingService';
import { sessionService } from '../../services/sessionService';
import { lotService } from '../../services/lotService';
import { Vehicle, Booking, ParkingSession, ParkingLot, CreateVehicleRequest } from '../../types';
import BookingForm from './bookingForm.tsx';
import VehicleForm from './VehicleForm.tsx';

const UserDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [, setCurrentTime] = useState(new Date());
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [sessions, setSessions] = useState<ParkingSession[]>([]);
  const [lots, setLots] = useState<ParkingLot[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const [b, v, s, l] = await Promise.all([
          bookingService.getByUserId(user?.id || ''),
          vehicleService.getByUserId(user?.id || ''),
          sessionService.getByUserId(user?.id || ''),
          lotService.list(),
        ]);
        setBookings(b || []);
        setVehicles(v || []);
        setSessions(s || []);
        setLots(l || []);
      } catch (e) {
        setErrors(['Failed to load your data.']);
      } finally {
        setIsLoading(false);
      }
    };
    if (user?.id) {
      load();
    }
  }, [user?.id]);

  const userVehicles = vehicles.filter((v: Vehicle) => v.userId === user?.id);
  const userBookings = bookings.filter((b: Booking) => b.userId === user?.id);
  const userSessions = sessions.filter((s: ParkingSession) => s.userId === user?.id);
  // const activeSession = userSessions.find(s => s.status === 'active');

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // active session duration can be computed inline when needed

  const handleBookingSubmit = async (bookingData: any) => {
    try {
      // Validate booking data
      const validationErrors: string[] = [];
      
      if (!bookingData.vehicleNumber) {
        validationErrors.push('Vehicle number is required');
      }
      
      if (!bookingData.startTime || !bookingData.endTime) {
        validationErrors.push('Start and end times are required');
      }
      
      if (bookingData.startTime && bookingData.endTime) {
        const startTime = new Date(`2024-01-01T${bookingData.startTime}:00`);
        const endTime = new Date(`2024-01-01T${bookingData.endTime}:00`);
        
        if (endTime <= startTime) {
          validationErrors.push('End time must be after start time');
        }
      }
      
      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        return;
      }

      // Find a vehicle for the user
      const userVehicle = userVehicles.find(v => v.licensePlate === bookingData.vehicleNumber) || userVehicles[0];
      
      if (!userVehicle) {
        setErrors(['No vehicle found. Please add a vehicle first.']);
        return;
      }

      // Find an available parking lot
      const availableLot = lots.find((lot: any) => lot.availableSpots > 0);
      
      if (!availableLot) {
        setErrors(['No available parking spots at the moment.']);
        return;
      }

      // Create new booking
      const created = await bookingService.create({
        lotId: availableLot.id,
        vehicleId: userVehicle.id,
        startTime: `2024-01-01T${bookingData.startTime}:00Z`,
        endTime: `2024-01-01T${bookingData.endTime}:00Z`,
      });
      setBookings(prev => [...prev, created]);
      
      // Clear errors and close form
      setErrors([]);
      setShowBookingForm(false);
      
      console.log('Booking created successfully:', created);
      
    } catch (error) {
      console.error('Error creating booking:', error);
      setErrors(['An unexpected error occurred. Please try again.']);
    }
  };

  // const calculateBookingAmount = (startTime: string, endTime: string, spotType: string): number => {
  //   const start = new Date(`2024-01-01T${startTime}:00`);
  //   const end = new Date(`2024-01-01T${endTime}:00`);
  //   const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    
  //   const rates = {
  //     regular: 2,
  //     premium: 3,
  //     covered: 4,
  //     electric: 5
  //   };
    
  //   return hours * (rates[spotType as keyof typeof rates] || 2);
  // };

  const handleCloseBookingForm = () => {
    setShowBookingForm(false);
    setErrors([]);
  };

  const handleVehicleSubmit = async (vehicleData: CreateVehicleRequest) => {
    try {
      setIsLoading(true);
      const created = await vehicleService.create(vehicleData);
      setVehicles(prev => [...prev, created]);
      setShowVehicleForm(false);
      setErrors([]);
    } catch (error) {
      console.error('Error creating vehicle:', error);
      setErrors(['Failed to add vehicle. Please try again.']);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    try {
      setIsLoading(true);
      await vehicleService.remove(vehicleId);
      setVehicles(prev => prev.filter(v => v.id !== vehicleId));
      setErrors([]);
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      setErrors(['Failed to delete vehicle. Please try again.']);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      setIsLoading(true);
      await bookingService.cancel(bookingId);
      setBookings(prev => prev.map(b => 
        b.id === bookingId ? { ...b, status: 'cancelled' as const } : b
      ));
      setErrors([]);
    } catch (error) {
      console.error('Error cancelling booking:', error);
      setErrors(['Failed to cancel booking. Please try again.']);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'bookings', label: 'My Bookings', icon: Calendar },
    { id: 'vehicles', label: 'My Vehicles', icon: Car },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">SmartPark</span>
            </div>
            <div className="h-8 w-px bg-gray-300"></div>
            <h1 className="text-xl font-semibold text-gray-900">
              Welcome back, {user?.name}!
            </h1>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white/60 backdrop-blur-sm border-b border-gray-200/50 px-6">
        <div className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Content */}
      <main className="px-6 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Bookings</p>
                    <p className="text-3xl font-bold text-gray-900">{userBookings.length}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">My Vehicles</p>
                    <p className="text-3xl font-bold text-gray-900">{userVehicles.length}</p>
                  </div>
                  <Car className="h-8 w-8 text-green-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Sessions</p>
                    <p className="text-3xl font-bold text-gray-900">{userSessions.length}</p>
                  </div>
                  <Clock className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Spent</p>
                    <p className="text-3xl font-bold text-gray-900">
                      ${userSessions.filter(s => s.amount).reduce((sum, s) => sum + (s.amount || 0), 0).toFixed(2)}
                    </p>
                  </div>
                  <CreditCard className="h-8 w-8 text-orange-600" />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {userSessions.slice(0, 3).map((session) => {
                  const lot = lots.find((l: any) => l.id === session.lotId);
                  return (
                    <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${
                          session.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                        }`}></div>
                        <div>
                          <p className="font-medium text-gray-900">{lot?.name}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(session.checkInTime).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {session.amount ? `$${session.amount.toFixed(2)}` : 'Active'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {session.duration ? formatDuration(session.duration) : 'In progress'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">My Bookings</h2>
              <button 
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => setShowBookingForm(true)}
              >
                <Plus className="h-5 w-5" />
                <span>New Booking</span>
              </button>
            </div>

            <div className="grid gap-6">
              {userBookings.map((booking) => {
                const lot = lots.find((l: any) => l.id === booking.lotId);
                const vehicle = vehicles.find((v: any) => v.id === booking.vehicleId);
                
                return (
                  <div key={booking.id} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            booking.status === 'active' ? 'bg-green-100 text-green-800' :
                            booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                            booking.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                          <h3 className="text-lg font-semibold text-gray-900">{lot?.name}</h3>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">{lot?.address}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Car className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">{vehicle?.licensePlate} - {vehicle?.make} {vehicle?.model}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">
                              {new Date(booking.startTime).toLocaleDateString()} - {new Date(booking.endTime).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        {booking.totalAmount && (
                          <>
                            <p className="text-2xl font-bold text-gray-900">${booking.totalAmount.toFixed(2)}</p>
                            <p className="text-sm text-gray-500">Total Cost</p>
                          </>
                        )}
                        {booking.status === 'confirmed' && (
                          <button 
                            className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors"
                            onClick={() => handleCancelBooking(booking.id)}
                            disabled={isLoading}
                          >
                            Cancel Booking
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'vehicles' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">My Vehicles</h2>
              <button 
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                onClick={() => setShowVehicleForm(true)}
                disabled={isLoading}
              >
                <Plus className="h-5 w-5" />
                <span>Add Vehicle</span>
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {userVehicles.map((vehicle) => (
                <div key={vehicle.id} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Car className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {vehicle.make} {vehicle.model}
                        </h3>
                        <p className="text-sm text-gray-500">{vehicle.color} • {vehicle.year}</p>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                          vehicle.vehicleType === 'car' ? 'bg-blue-100 text-blue-800' :
                          vehicle.vehicleType === 'suv' ? 'bg-green-100 text-green-800' :
                          vehicle.vehicleType === 'truck' ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {vehicle.vehicleType.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        onClick={() => {/* Edit vehicle */}}
                        title="Edit vehicle"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        onClick={() => handleDeleteVehicle(vehicle.id)}
                        disabled={isLoading}
                        title="Delete vehicle"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">License Plate</span>
                      <span className="font-medium">{vehicle.licensePlate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">RFID Card</span>
                      <span className="font-medium">{vehicle.rfidCard}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status</span>
                      <span className={`font-medium ${vehicle.isActive ? 'text-green-600' : 'text-red-600'}`}>
                        {vehicle.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {userVehicles.length === 0 && (
              <div className="text-center py-12">
                <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-500">No Vehicles Added</h3>
                <p className="text-gray-400">Add your first vehicle to start making bookings</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-2xl space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
              
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <User className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-900">{user?.name}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-900">{user?.email}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-900">{user?.phone || 'Not provided'}</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Member Since
                  </label>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-900">
                      {new Date(user?.createdAt || '').toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <button className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Edit Profile
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <BookingForm 
          onClose={handleCloseBookingForm}
          onBook={handleBookingSubmit}
        />
      )}

      {/* Vehicle Form Modal */}
      {showVehicleForm && (
        <VehicleForm 
          onClose={() => setShowVehicleForm(false)}
          onSubmit={handleVehicleSubmit}
        />
      )}

      {/* Error Display */}
      {errors.length > 0 && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Booking Errors</h3>
                <div className="mt-2 text-sm text-red-700">
                  <ul className="list-disc pl-5 space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    className="bg-red-50 px-2 py-1.5 rounded-md text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
                    onClick={() => setErrors([])}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;