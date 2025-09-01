import React, { useState, useEffect } from 'react';
import { Car, MapPin, Clock, CreditCard, Plus, Calendar, Activity, User, Phone, Mail } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.tsx';
import { mockVehicles, mockBookings, mockParkingSessions, mockParkingLots } from '../../data/mockData';
import BookingForm from './bookingForm.tsx';
import { Booking } from '../../types';

const UserDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookings, setBookings] = useState(mockBookings);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const userVehicles = mockVehicles.filter(v => v.userId === user?.id);
  const userBookings = bookings.filter(b => b.userId === user?.id);
  const userSessions = mockParkingSessions.filter(s => s.userId === user?.id);
  const activeSession = userSessions.find(s => s.status === 'active');

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getActiveSessionDuration = () => {
    if (!activeSession) return 0;
    const checkIn = new Date(activeSession.checkInTime);
    const diffMs = currentTime.getTime() - checkIn.getTime();
    return Math.floor(diffMs / (1000 * 60));
  };

  const handleBookingSubmit = (bookingData: any) => {
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
      const availableLot = mockParkingLots.find(lot => lot.availableSpots > 0);
      
      if (!availableLot) {
        setErrors(['No available parking spots at the moment.']);
        return;
      }

      // Create new booking
      const newBooking: Booking = {
        id: Date.now().toString(),
        userId: user?.id || '',
        lotId: availableLot.id,
        spotId: `spot-${Date.now()}`,
        vehicleId: userVehicle.id,
        startTime: `2024-01-01T${bookingData.startTime}:00Z`,
        endTime: `2024-01-01T${bookingData.endTime}:00Z`,
        status: 'booked',
        totalAmount: calculateBookingAmount(bookingData.startTime, bookingData.endTime, bookingData.spotType)
      };

      // Add to bookings
      setBookings(prev => [...prev, newBooking]);
      
      // Clear errors and close form
      setErrors([]);
      setShowBookingForm(false);
      
      console.log('Booking created successfully:', newBooking);
      
    } catch (error) {
      console.error('Error creating booking:', error);
      setErrors(['An unexpected error occurred. Please try again.']);
    }
  };

  const calculateBookingAmount = (startTime: string, endTime: string, spotType: string): number => {
    const start = new Date(`2024-01-01T${startTime}:00`);
    const end = new Date(`2024-01-01T${endTime}:00`);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    
    const rates = {
      regular: 2,
      premium: 3,
      covered: 4,
      electric: 5
    };
    
    return hours * (rates[spotType as keyof typeof rates] || 2);
  };

  const handleCloseBookingForm = () => {
    setShowBookingForm(false);
    setErrors([]);
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
                  const lot = mockParkingLots.find(l => l.id === session.lotId);
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
                const lot = mockParkingLots.find(l => l.id === booking.lotId);
                const vehicle = mockVehicles.find(v => v.id === booking.vehicleId);
                
                return (
                  <div key={booking.id} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            booking.status === 'active' ? 'bg-green-100 text-green-800' :
                            booking.status === 'booked' ? 'bg-blue-100 text-blue-800' :
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
                      
                      {booking.totalAmount && (
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">${booking.totalAmount.toFixed(2)}</p>
                          <p className="text-sm text-gray-500">Total Cost</p>
                        </div>
                      )}
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
              <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
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
                        <p className="text-sm text-gray-500">{vehicle.color}</p>
                      </div>
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
                  </div>
                </div>
              ))}
            </div>
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