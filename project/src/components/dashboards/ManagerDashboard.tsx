import React, { useState, useEffect } from 'react';
import { Car, Users, Activity, AlertTriangle, MapPin, Clock, TrendingUp, Eye } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.tsx';
import { managerService } from '../../services/managerService';
import { ParkingLot, ParkingSession, ManagerDashboardData, ParkingSpot } from '../../types';
import { mockParkingSessions, mockUsers, mockVehicles, mockParkingSpots } from '../../data/mockData';
import SpotForm from './forms/SpotForm';

const ManagerDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const [managedLots, setManagedLots] = useState<ParkingLot[]>([]);
  const [activeSessions, setActiveSessions] = useState<ParkingSession[]>([]);
  const [todaySessions, setTodaySessions] = useState<ParkingSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const [lots, sessions] = await Promise.all([
          managerService.getLots(),
          managerService.getSessions(),
        ]);
        setManagedLots(lots || []);
        const active = (sessions || []).filter((s: ParkingSession) => s.status === 'active');
        setActiveSessions(active);
        const today = new Date().toDateString();
        setTodaySessions((sessions || []).filter((s: ParkingSession) => new Date(s.checkInTime).toDateString() === today));
      } catch (e) {
        setManagedLots([]);
        setActiveSessions([]);
        setTodaySessions([]);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const managedLotIds = managedLots.map(lot => lot.id);

  const totalRevenue = activeSessions
    .filter(session => session.amount && managedLotIds.includes(session.lotId))
    .reduce((sum, session) => sum + (session.amount || 0), 0);

  const getOccupancyRate = (lotId: string) => {
    const lot = managedLots.find(l => l.id === lotId);
    if (!lot) return 0;
    return ((lot.totalSpots - lot.availableSpots) / lot.totalSpots) * 100;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getSessionDuration = (session: ParkingSession) => {
    const checkIn = new Date(session.checkInTime);
    const diffMs = currentTime.getTime() - checkIn.getTime();
    return Math.floor(diffMs / (1000 * 60));
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'live', label: 'Live Sessions', icon: Eye },
    { id: 'lots', label: 'Parking Lots', icon: MapPin },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-900">SmartPark</span>
            </div>
            <div className="h-8 w-px bg-gray-300"></div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Manager Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome, {user?.name}</p>
            </div>
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
                    ? 'border-green-600 text-green-600'
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
            {/* Key Metrics */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Active Sessions</p>
                    <p className="text-3xl font-bold text-gray-900">{activeSessions.length}</p>
                  </div>
                  <Activity className="h-8 w-8 text-green-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Today's Sessions</p>
                    <p className="text-3xl font-bold text-gray-900">{todaySessions.length}</p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Managed Lots</p>
                    <p className="text-3xl font-bold text-gray-900">{managedLots.length}</p>
                  </div>
                  <MapPin className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Revenue</p>
                    <p className="text-3xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-orange-600" />
                </div>
              </div>
            </div>

            {/* Parking Lots Overview */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Parking Lots Status</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {managedLots.map((lot) => {
                  const occupancyRate = getOccupancyRate(lot.id);
                  const lotActiveSessions = activeSessions.filter(s => s.lotId === lot.id);
                  
                  return (
                    <div key={lot.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">{lot.name}</h4>
                          <p className="text-sm text-gray-500">{lot.address}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          occupancyRate > 80 ? 'bg-red-100 text-red-800' :
                          occupancyRate > 60 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {occupancyRate.toFixed(0)}% Full
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Available Spots</span>
                          <span className="font-medium">{lot.availableSpots}/{lot.totalSpots}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Active Sessions</span>
                          <span className="font-medium">{lotActiveSessions.length}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Hourly Rate</span>
                          <span className="font-medium">${lot.hourlyRate.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'live' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Live Parking Sessions</h2>
            
            <div className="grid gap-6">
              {activeSessions.map((session) => {
                const lot = managedLots.find(l => l.id === session.lotId);
                const vehicle = session.vehicle;
                const customer = session.user;
                const duration = getSessionDuration(session);
                const estimatedCost = (duration / 60) * (lot?.hourlyRate || 0);
                
                return (
                  <div key={session.id} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                          <h3 className="text-lg font-semibold text-gray-900">{customer?.name}</h3>
                          <span className="text-sm text-gray-500">#{session.id}</span>
                        </div>
                        
                        <div className="grid md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">{lot?.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Car className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">{vehicle?.licensePlate}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">
                              {new Date(session.checkInTime).toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">{formatDuration(duration)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">${estimatedCost.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">Est. Cost</p>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {activeSessions.length === 0 && (
                <div className="text-center py-12">
                  <Activity className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-500">No Active Sessions</h3>
                  <p className="text-gray-400">All parking spots are currently vacant</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'lots' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Parking Lot Management</h2>
            
            <div className="grid gap-6">
              {managedLots.map((lot) => {
                const occupancyRate = getOccupancyRate(lot.id);
                const lotSessions = mockParkingSessions.filter(s => s.lotId === lot.id);
                const lotRevenue = lotSessions
                  .filter(s => s.amount)
                  .reduce((sum, s) => sum + (s.amount || 0), 0);
                
                return (
                  <div key={lot.id} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{lot.name}</h3>
                        <p className="text-gray-500">{lot.address}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        occupancyRate > 80 ? 'bg-red-100 text-red-800' :
                        occupancyRate > 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {occupancyRate.toFixed(0)}% Occupied
                      </span>
                    </div>
                    
                    <div className="grid md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">{lot.totalSpots}</p>
                        <p className="text-sm text-gray-500">Total Spots</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{lot.availableSpots}</p>
                        <p className="text-sm text-gray-500">Available</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">${lot.hourlyRate.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">Hourly Rate</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">${lotRevenue.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">Total Revenue</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>
            
            {/* Revenue Summary */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Summary</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-3xl font-bold text-blue-600">${totalRevenue.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-3xl font-bold text-green-600">{todaySessions.length}</p>
                  <p className="text-sm text-gray-600">Today's Sessions</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-3xl font-bold text-purple-600">
                    {todaySessions.length > 0 ? (totalRevenue / todaySessions.length).toFixed(2) : '0.00'}
                  </p>
                  <p className="text-sm text-gray-600">Avg. Session Value</p>
                </div>
              </div>
            </div>

            {/* Session History */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Sessions</h3>
              <div className="space-y-4">
                {mockParkingSessions
                  .filter(session => managedLotIds.includes(session.lotId))
                  .slice(0, 5)
                  .map((session) => {
                    const lot = managedLots.find(l => l.id === session.lotId);
                    const customer = mockUsers.find(u => u.id === session.userId);
                    
                    return (
                      <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className={`w-3 h-3 rounded-full ${
                            session.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                          }`}></div>
                          <div>
                            <p className="font-medium text-gray-900">{customer?.name}</p>
                            <p className="text-sm text-gray-500">{lot?.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            {session.amount ? `$${session.amount.toFixed(2)}` : 'Active'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(session.checkInTime).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ManagerDashboard;