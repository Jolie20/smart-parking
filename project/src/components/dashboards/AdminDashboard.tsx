import React, { useState, useEffect } from "react";
import { useArduinoStream } from "../../hooks/useArduinoStream";
import {
  Car,
  Users,
  MapPin,
  BarChart3,
  Settings,
  Shield,
  TrendingUp,
  AlertTriangle,
  Activity,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth.tsx";
import { adminService } from '../../services/adminService';
import { userService } from '../../services/userService';
import { lotService } from '../../services/lotService';
import { sessionService } from '../../services/sessionService';
import { bookingService } from '../../services/bookingService';
import { 
  User, 
  ParkingLot, 
  ParkingSession, 
  Vehicle, 
  Booking, 
  Manager, 
  Analytics,
  DashboardStats 
} from "../../types";
import { mockParkingSessions, mockUsers, mockVehicles, mockParkingLots } from '../../data/mockData';
import UserForm from './forms/UserForm';
import LotForm from './forms/LotForm';
import ManagerForm from './forms/ManagerForm';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { latest } = useArduinoStream();
  const [showUserForm, setShowUserForm] = useState(false);
  const [showLotForm, setShowLotForm] = useState(false);
  const [showManagerForm, setShowManagerForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingLot, setEditingLot] = useState<ParkingLot | null>(null);
  const [editingManager, setEditingManager] = useState<Manager | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [lots, setLots] = useState<ParkingLot[]>([]);
  const [sessions, setSessions] = useState<ParkingSession[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);


  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const [u, l, s, m, b] = await Promise.all([
          adminService.listUsers().catch(() => mockUsers),
          lotService.list(),
          sessionService.list(),
          adminService.getManagers().catch(() => []),
          bookingService.list().catch(() => []),
        ]);
        setUsers(u || []);
        setLots(l || []);
        setSessions(s || []);
        setManagers(m || []);
        setBookings(b || []);
      } catch (e) {
        setErrors(["Failed to load dashboard data."]);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // System-wide statistics with error handling
  const totalUsers = users.length;
  const totalVehicles = mockVehicles.length; // Using mock data for now
  const totalParkingLots = lots.length;
  const activeSessions = sessions.filter((s: ParkingSession) => s.status === 'active');
  const totalRevenue = sessions
    .filter((s: ParkingSession) => s.amount)
    .reduce((sum: number, s: ParkingSession) => sum + (s.amount || 0), 0);

  const totalSpots = lots.reduce(
    (sum, lot) => sum + lot.totalSpots,
    0
  );
  const availableSpots = lots.reduce(
    (sum, lot) => sum + lot.availableSpots,
    0
  );
  const occupancyRate =
    totalSpots > 0 ? ((totalSpots - availableSpots) / totalSpots) * 100 : 0;

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getSessionDuration = (session: ParkingSession): number => {
    try {
      const checkIn = new Date(session.checkInTime);
      const diffMs = currentTime.getTime() - checkIn.getTime();
      return Math.floor(diffMs / (1000 * 60));
    } catch (error) {
      console.error("Error calculating session duration:", error);
      return 0;
    }
  };

  const handleAction = async (action: string, data?: any) => {
    setIsLoading(true);
    setErrors([]);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log(`Admin action: ${action}`, data);

      // Add success handling here
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
      setErrors([`Failed to ${action}. Please try again.`]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearErrors = () => {
    setErrors([]);
  };

  const handleUserSubmit = async (userData: any) => {
    try {
      setIsLoading(true);
      if (editingUser) {
        const updated = await adminService.updateUser(editingUser.id, userData);
        setUsers(prev => prev.map(u => u.id === editingUser.id ? updated : u));
      } else {
        const created = await adminService.createUser(userData);
        setUsers(prev => [...prev, created]);
      }
      setShowUserForm(false);
      setEditingUser(null);
      setErrors([]);
    } catch (error) {
      console.error('Error saving user:', error);
      setErrors(['Failed to save user. Please try again.']);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLotSubmit = async (lotData: any) => {
    try {
      setIsLoading(true);
      if (editingLot) {
        const updated = await lotService.update(editingLot.id, lotData);
        setLots(prev => prev.map(l => l.id === editingLot.id ? updated : l));
      } else {
        const created = await lotService.create(lotData);
        setLots(prev => [...prev, created]);
      }
      setShowLotForm(false);
      setEditingLot(null);
      setErrors([]);
    } catch (error) {
      console.error('Error saving lot:', error);
      setErrors(['Failed to save parking lot. Please try again.']);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManagerSubmit = async (managerData: any) => {
    try {
      setIsLoading(true);
      const created = await adminService.createManager({
        Id: managerData.Id,
        email: managerData.email,
        username: managerData.username,
        phone: managerData.phone,
        password: managerData.password
      });
      setManagers(prev => [...prev, created]);
      setShowManagerForm(false);
      setEditingManager(null);
      setErrors([]);
    } catch (error) {
      console.error('Error saving manager:', error);
      setErrors(['Failed to save manager. Please try again.']);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowUserForm(true);
  };

  const handleEditLot = (lot: ParkingLot) => {
    setEditingLot(lot);
    setShowLotForm(true);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      setIsLoading(true);
      await adminService.deleteUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
      setErrors([]);
    } catch (error) {
      console.error('Error deleting user:', error);
      setErrors(['Failed to delete user. Please try again.']);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLot = async (lotId: string) => {
    try {
      setIsLoading(true);
      await lotService.remove(lotId);
      setLots(prev => prev.filter(l => l.id !== lotId));
      setErrors([]);
    } catch (error) {
      console.error('Error deleting lot:', error);
      setErrors(['Failed to delete parking lot. Please try again.']);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "users", label: "User Management", icon: Users },
    { id: "lots", label: "Parking Lots", icon: MapPin },
    { id: "sessions", label: "Live Sessions", icon: Activity },
    { id: "gate", label: "Gate Control", icon: Shield },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "settings", label: "System Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold text-gray-900">
                SmartPark
              </span>
            </div>
            <div className="h-8 w-px bg-gray-300"></div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                System Administrator - {user?.name}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Logout"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white/60 backdrop-blur-sm border-b border-gray-200/50 px-6">
        <div className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-4 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-purple-600 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
                aria-label={`Switch to ${tab.label} tab`}
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
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* System Alerts */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white">
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6" />
                <h2 className="text-xl font-semibold">System Status</h2>
              </div>
              <p className="mt-2">
                All systems operational • Last updated:{" "}
                {currentTime.toLocaleTimeString()}
              </p>
            </div>

            {/* Key Metrics */}
            <div className="grid md:grid-cols-5 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {totalUsers}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Parking Lots</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {totalParkingLots}
                    </p>
                  </div>
                  <MapPin className="h-8 w-8 text-green-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Active Sessions</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {activeSessions.length}
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-purple-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Occupancy Rate</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {occupancyRate.toFixed(0)}%
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-orange-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Revenue</p>
                    <p className="text-3xl font-bold text-gray-900">
                      FRW {totalRevenue.toFixed(2)}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-red-600" />
                </div>
              </div>
            </div>

            {/* System Overview */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Parking Lots Status */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Parking Lots Overview
                </h3>
                <div className="space-y-4">
                  {lots.map((lot) => {
                    const lotOccupancy =
                      ((lot.totalSpots - lot.availableSpots) / lot.totalSpots) *
                      100;

                    return (
                      <div
                        key={lot.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {lot.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {lot.availableSpots}/{lot.totalSpots} available
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                lotOccupancy > 80
                                  ? "bg-red-500"
                                  : lotOccupancy > 60
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                              }`}
                              style={{
                                width: `${Math.min(lotOccupancy, 100)}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-600">
                            {lotOccupancy.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* User Statistics */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  User Statistics
                </h3>
                <div className="space-y-4">
                  {["user", "manager", "admin"].map((role) => {
                    const roleUsers = users.filter((u) => u.role === role || u.role === role.toUpperCase());
                    const percentage = totalUsers > 0 ? (roleUsers.length / totalUsers) * 100 : 0;

                    return (
                      <div
                        key={role}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900 capitalize">
                            {role}s
                          </p>
                          <p className="text-sm text-gray-500">
                            {roleUsers.length} users
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-purple-500"
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-600">
                            {percentage.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "gate" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Gate Control</h2>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Latest device message</p>
                  <p className="font-medium text-gray-900">
                    {latest || "No data yet"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    onClick={async () => {
                      await fetch("http://localhost:4000/api/gate/open", {
                        method: "POST",
                      });
                    }}
                  >
                    Open Gate
                  </button>
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    onClick={async () => {
                      await fetch("http://localhost:4000/api/gate/close", {
                        method: "POST",
                      });
                    }}
                  >
                    Close Gate
                  </button>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Use these controls to manually open or close the gate. Live
                messages from the device will appear here when cards are tapped.
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                User Management
              </h2>
              <div className="flex space-x-3">
                <button 
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                  onClick={() => setShowUserForm(true)}
                  disabled={isLoading}
                  aria-label="Add new user"
                >
                  {isLoading ? 'Adding...' : 'Add New User'}
                </button>
                <button 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  onClick={() => setShowManagerForm(true)}
                  disabled={isLoading}
                  aria-label="Add new manager"
                >
                  {isLoading ? 'Adding...' : 'Add Manager'}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                        User
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                        Phone
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                        Vehicles
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                        Sessions
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((u) => {
                      const userSessions = sessions.filter(
                        (s: ParkingSession) => s.userId === u.id
                      );

                      return (
                        <tr key={u.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-gray-900">
                                {u.name || u.email}
                              </p>
                              <p className="text-sm text-gray-500">
                                {u.email}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                u.role === "admin"
                                  ? "bg-purple-100 text-purple-800"
                                  : u.role === "manager"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {(u.role || '').toString().toLowerCase().replace(/^[a-z]/, c => c.toUpperCase())}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {u.phone || "N/A"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            -
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {userSessions.length}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <button 
                                className="text-purple-600 hover:text-purple-900 text-sm font-medium"
                                onClick={() => handleEditUser(u)}
                                aria-label={`Edit ${u.name || u.email}`}
                              >
                                Edit
                              </button>
                              <button 
                                className="text-red-600 hover:text-red-900 text-sm font-medium"
                                onClick={() => handleDeleteUser(u.id)}
                                disabled={isLoading}
                                aria-label={`Delete ${u.name || u.email}`}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "lots" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Parking Lot Management
              </h2>
              <button
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                onClick={() => setShowLotForm(true)}
                disabled={isLoading}
                aria-label="Add new parking lot"
              >
                {isLoading ? "Adding..." : "Add New Lot"}
              </button>
            </div>

            <div className="grid gap-6">
              {lots.map((lot) => {
                const lotOccupancy =
                  ((lot.totalSpots - lot.availableSpots) / lot.totalSpots) *
                  100;
                const lotSessions = sessions.filter(
                  (s: ParkingSession) => s.lotId === lot.id
                );
                const lotRevenue = lotSessions
                  .filter((s) => s.amount)
                  .reduce((sum, s) => sum + (s.amount || 0), 0);
                const manager = users.find((u) => u.id === lot.managerId);

                return (
                  <div
                    key={lot.id}
                    className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {lot.name}
                        </h3>
                        <p className="text-gray-500">{lot.address}</p>
                        <p className="text-sm text-gray-400 mt-1">
                          Manager: {manager?.name || "Unassigned"}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          lotOccupancy > 80
                            ? "bg-red-100 text-red-800"
                            : lotOccupancy > 60
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {lotOccupancy.toFixed(0)}% Occupied
                      </span>
                    </div>

                    <div className="grid md:grid-cols-5 gap-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">
                          {lot.totalSpots}
                        </p>
                        <p className="text-sm text-gray-500">Total Spots</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                          {lot.availableSpots}
                        </p>
                        <p className="text-sm text-gray-500">Available</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">
                          FRW {lot.hourlyRate.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">Hourly Rate</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">
                          {lotSessions.length}
                        </p>
                        <p className="text-sm text-gray-500">Total Sessions</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-orange-600">
                          FRW {lotRevenue.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">Revenue</p>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        className="px-4 py-2 text-purple-600 hover:text-purple-800 transition-colors"
                        onClick={() => handleEditLot(lot)}
                        aria-label={`Edit ${lot.name}`}
                      >
                        Edit
                      </button>
                      <button 
                        className="px-4 py-2 text-red-600 hover:text-red-800 transition-colors"
                        onClick={() => handleDeleteLot(lot.id)}
                        disabled={isLoading}
                        aria-label={`Delete ${lot.name}`}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "sessions" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Live Parking Sessions
            </h2>

            <div className="grid gap-6">
              {activeSessions.map((session) => {
                const lot = mockParkingLots.find((l) => l.id === session.lotId);
                const vehicle = mockVehicles.find(
                  (v) => v.id === session.vehicleId
                );
                const customer = mockUsers.find((u) => u.id === session.userId);
                const duration = getSessionDuration(session);
                const estimatedCost = (duration / 60) * (lot?.hourlyRate || 0);

                return (
                  <div
                    key={session.id}
                    className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {customer?.name || "Unknown User"}
                          </h3>
                          <span className="text-sm text-gray-500">
                            #{session.id}
                          </span>
                        </div>

                        <div className="grid md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">
                              {lot?.name || "Unknown Lot"}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Car className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">
                              {vehicle?.licensePlate || "Unknown Vehicle"}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Activity className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">
                              {new Date(
                                session.checkInTime
                              ).toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">
                              {formatDuration(duration)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          FRW {estimatedCost.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">Est. Cost</p>
                        <button
                          className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors"
                          onClick={() =>
                            handleAction("force checkout", session.id)
                          }
                          aria-label={`Force checkout for session ${session.id}`}
                        >
                          Force Checkout
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {activeSessions.length === 0 && (
                <div className="text-center py-12">
                  <Activity className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-500">
                    No Active Sessions
                  </h3>
                  <p className="text-gray-400">
                    All parking spots are currently vacant
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              System Analytics
            </h2>

            {/* Financial Overview */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Financial Overview
              </h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-3xl font-bold text-green-600">
                    FRW {totalRevenue.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-3xl font-bold text-blue-600">
                    {sessions.length}
                  </p>
                  <p className="text-sm text-gray-600">Total Sessions</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-3xl font-bold text-purple-600">
                    {sessions.length > 0
                      ? (totalRevenue / sessions.length).toFixed(2)
                      : "0.00"}
                  </p>
                  <p className="text-sm text-gray-600">Avg. Session Value</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <p className="text-3xl font-bold text-orange-600">
                    FRW {(totalRevenue * 0.1).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Platform Revenue (10%)
                  </p>
                </div>
              </div>
            </div>

            {/* Usage Statistics */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Usage Statistics
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">
                    Parking Lot Performance
                  </h4>
                  <div className="space-y-3">
                    {lots.map((lot) => {
                      const lotSessions = sessions.filter(
                        (s: ParkingSession) => s.lotId === lot.id
                      );
                      const percentage = sessions.length > 0
                        ? (lotSessions.length / sessions.length) * 100
                        : 0;

                      return (
                        <div
                          key={lot.id}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm text-gray-600">
                            {lot.name}
                          </span>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className="h-2 rounded-full bg-purple-500"
                                style={{
                                  width: `${Math.min(percentage, 100)}%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-600 w-12">
                              {percentage.toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-4">
                    User Activity
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Active Users
                      </span>
                      <span className="text-sm font-medium">
                        {users.filter((u) => (u.role || '').toString().toLowerCase() === "user").length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Registered Vehicles
                      </span>
                      <span className="text-sm font-medium">
                        {totalVehicles}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Total Bookings
                      </span>
                      <span className="text-sm font-medium">
                        {bookings.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        System Uptime
                      </span>
                      <span className="text-sm font-medium text-green-600">
                        99.9%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              System Settings
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* General Settings */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  General Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      System Name
                    </label>
                    <input
                      type="text"
                      defaultValue="SmartPark Management System"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      aria-label="System name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Parking Rate (FRW/hour)
                    </label>
                    <input
                      type="number"
                      defaultValue="300"
                      step="0.25"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      aria-label="Default parking rate"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grace Period (minutes)
                    </label>
                    <input
                      type="number"
                      defaultValue="15"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      aria-label="Grace period"
                    />
                  </div>
                </div>
                <button
                  className="mt-6 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                  onClick={() => handleAction("save general settings")}
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>

              {/* Security Settings */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Security Settings
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        Two-Factor Authentication
                      </p>
                      <p className="text-sm text-gray-500">
                        Require 2FA for admin accounts
                      </p>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        id="2fa-toggle"
                        aria-label="Enable two-factor authentication"
                      />
                      <label
                        htmlFor="2fa-toggle"
                        className="w-10 h-6 bg-green-500 rounded-full shadow-inner cursor-pointer block"
                      >
                        <div className="w-4 h-4 bg-white rounded-full shadow transform translate-x-5 transition-transform"></div>
                      </label>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        Session Timeout
                      </p>
                      <p className="text-sm text-gray-500">
                        Auto logout after inactivity
                      </p>
                    </div>
                    <select
                      className="px-3 py-1 border border-gray-300 rounded text-sm"
                      aria-label="Session timeout"
                    >
                      <option>30 minutes</option>
                      <option>1 hour</option>
                      <option>2 hours</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        API Rate Limiting
                      </p>
                      <p className="text-sm text-gray-500">
                        Limit requests per minute
                      </p>
                    </div>
                    <input
                      type="number"
                      defaultValue="100"
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                      aria-label="API rate limit"
                    />
                  </div>
                </div>
                <button
                  className="mt-6 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                  onClick={() => handleAction("update security settings")}
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Update Security"}
                </button>
              </div>
            </div>

            {/* System Maintenance */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                System Maintenance
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <button
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-center"
                  onClick={() => handleAction("generate report")}
                  aria-label="Generate system report"
                >
                  <BarChart3 className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="font-medium text-gray-700">Generate Report</p>
                  <p className="text-sm text-gray-500">
                    Export system analytics
                  </p>
                </button>
                <button
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-center"
                  onClick={() => handleAction("backup data")}
                  aria-label="Backup system data"
                >
                  <Shield className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="font-medium text-gray-700">Backup Data</p>
                  <p className="text-sm text-gray-500">Create system backup</p>
                </button>
                <button
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-center"
                  onClick={() => handleAction("check system health")}
                  aria-label="Check system health"
                >
                  <Settings className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="font-medium text-gray-700">System Health</p>
                  <p className="text-sm text-gray-500">Check system status</p>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Form Modals */}
      {showUserForm && (
        <UserForm 
          onClose={() => {
            setShowUserForm(false);
            setEditingUser(null);
          }}
          onSubmit={handleUserSubmit}
          editingUser={editingUser}
          isEditing={!!editingUser}
        />
      )}

      {showLotForm && (
        <LotForm 
          onClose={() => {
            setShowLotForm(false);
            setEditingLot(null);
          }}
          onSubmit={handleLotSubmit}
          editingLot={editingLot}
          isEditing={!!editingLot}
          managers={users.filter(u => u.role === 'manager')}
        />
      )}

      {showManagerForm && (
        <ManagerForm 
          onClose={() => {
            setShowManagerForm(false);
            setEditingManager(null);
          }}
          onSubmit={handleManagerSubmit}
          editingManager={editingManager}
          isEditing={!!editingManager}
        />
      )}

      {/* Error Display */}
      {errors.length > 0 && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  System Errors
                </h3>
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
                    onClick={clearErrors}
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

export default AdminDashboard;
