import React, { useState, useEffect } from "react";
import { useArduinoStream } from "../../hooks/useArduinoStream";
import {
  Car,
  Activity,
  MapPin,
  Clock,
  TrendingUp,
  Eye,
  Settings,
} from "lucide-react";
import { lotService } from "../../services/lotService.ts";
import { useAuth } from "../../hooks/useAuth.tsx";
import { managerService } from "../../services/managerService";
import { ParkingLot, ParkingSession, ParkingSpot, Booking } from "../../types";
import SpotForm from "./forms/SpotForm";
import LotForm from "./forms/LotForm";
import { spotsService } from "../../services/spotsService"; // <-- Add this import

const ManagerDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [currentTime, setCurrentTime] = useState(new Date());
  const { latest } = useArduinoStream();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const [managedLots, setManagedLots] = useState<ParkingLot[]>([]);
  const [activeSessions, setActiveSessions] = useState<ParkingSession[]>([]);
  const [todaySessions, setTodaySessions] = useState<ParkingSession[]>([]);
  const [spots, setSpots] = useState<ParkingSpot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingStats, setBookingStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSpotForm, setShowSpotForm] = useState(false);
  const [editingSpot, setEditingSpot] = useState<ParkingSpot | null>(null);
  const [selectedLotId, setSelectedLotId] = useState<string>("");
  const [showLotForm, setShowLotForm] = useState(false);

  // Show LotForm automatically if manager has no lots
  useEffect(() => {
    if (managedLots.length === 0) {
      setShowLotForm(true);
    }
  }, [managedLots.length]);
  const [editingLot, setEditingLot] = useState(null);

  const handleAddLot = () => {
    setEditingLot(null);
    setShowLotForm(true);
  };

  const handleLotSubmit = (lotData: Partial<ParkingLot>) => {
    if (!lotData.name || !lotData.address || !lotData.totalSpots || !lotData.availableSpots || !lotData.hourlyRate) {
      alert("Please provide all required fields for the parking lot.");
      return;
    }
    setManagedLots((prev) => [
      ...prev,
      {
        ...lotData,
        id: Date.now().toString(),
        name: lotData.name,
        address: lotData.address,
        totalSpots: lotData.totalSpots,
        availableSpots: lotData.availableSpots,
        hourlyRate: lotData.hourlyRate,
        managerId: user?.id ?? "",
        manager: { id: user?.id ?? "", name: user?.name ?? "", email: user?.email ?? "" },
        description: lotData.description ?? "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as ParkingLot,
    ]);
    setShowLotForm(false);
    setEditingLot(null);
  };

  // --- DYNAMIC DATA FETCHING ---
  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const [lots, sessions, bookingsData, stats] = await Promise.all([
          lotService.list(),
          managerService.getSessions(),
          managerService.getBookings(),
          managerService.getBookingStats(),
        ]);
        // Only show lots assigned to this manager
        const assignedLots = (lots || []).filter(
          (lot) => lot.managerId === user?.id
        );
        setManagedLots(assignedLots);

        const active = (sessions || []).filter(
          (s: ParkingSession) => s.status === "active"
        );
        setActiveSessions(active);
        const today = new Date().toDateString();
        setTodaySessions(
          (sessions || []).filter(
            (s: ParkingSession) =>
              new Date(s.checkInTime).toDateString() === today
          )
        );
        setBookings(bookingsData || []);
        setBookingStats(stats || null);

        // Fetch all spots for the manager's lots dynamically
        let allSpots: ParkingSpot[] = [];
        for (const lot of assignedLots) {
          const lotSpots = await managerService.getSpots(lot.id);
          allSpots = allSpots.concat(lotSpots || []);
        }
        setSpots(allSpots);
      } catch (e) {
        setManagedLots([]);
        setActiveSessions([]);
        setTodaySessions([]);
        setSpots([]);
        setBookings([]);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [user?.id]);
  // --- END DYNAMIC DATA FETCHING ---

  const managedLotIds = managedLots.map((lot) => lot.id);

  const totalRevenue = activeSessions
    .filter(
      (session) => session.amount && managedLotIds.includes(session.lotId)
    )
    .reduce((sum, session) => sum + (session.amount || 0), 0);

  const getOccupancyRate = (lotId: string) => {
    const lot = managedLots.find((l) => l.id === lotId);
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

  const handleSpotSubmit = async (spotData: any) => {
    try {
      setIsLoading(true);
      // If editing, update; else, create
      if (editingSpot) {
        await spotsService.updateSpot(editingSpot.id, spotData);
      } else {
        await spotsService.createSpot({
          ...spotData,
          lotId: selectedLotId,
        });
      }
      setShowSpotForm(false);
      setEditingSpot(null);
      // Refetch spots for the selected lot
      if (selectedLotId) {
        const updatedSpots = await spotsService.getAllSpots(selectedLotId);
        setSpots((prev) => [
          ...prev.filter((s) => s.lotId !== selectedLotId),
          ...(updatedSpots || []),
        ]);
      }
    } catch (error) {
      console.error("Error saving spot:", error);
      alert("Failed to save spot.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSpot = (spot: ParkingSpot) => {
    setEditingSpot(spot);
    setSelectedLotId(spot.lotId);
    setShowSpotForm(true);
  };

  const handleAddSpot = (lotId: string) => {
    setSelectedLotId(lotId);
    setEditingSpot(null);
    setShowSpotForm(true);
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "bookings", label: "Bookings", icon: Clock },
    { id: "live", label: "Live Sessions", icon: Eye },
    { id: "lots", label: "Parking Lots", icon: MapPin },
    { id: "spots", label: "Spot Management", icon: Car },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-900">
                SmartPark
              </span>
            </div>
            <div className="h-8 w-px bg-gray-300"></div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Manager Dashboard
              </h1>
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
                    ? "border-green-600 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
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
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Active Sessions</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {activeSessions.length}
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-green-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Today's Sessions</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {todaySessions.length}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Managed Lots</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {managedLots.length}
                    </p>
                  </div>
                  <MapPin className="h-8 w-8 text-purple-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Revenue</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {totalRevenue.toFixed(2)}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-orange-600" />
                </div>
              </div>
            </div>

            {/* Parking Lots Overview */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Parking Lots Status
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {managedLots.map((lot) => {
                  const occupancyRate = getOccupancyRate(lot.id);
                  const lotActiveSessions = activeSessions.filter(
                    (s) => s.lotId === lot.id
                  );

                  return (
                    <div
                      key={lot.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {lot.name}
                          </h4>
                          <p className="text-sm text-gray-500">{lot.address}</p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            occupancyRate > 80
                              ? "bg-red-100 text-red-800"
                              : occupancyRate > 60
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {occupancyRate.toFixed(0)}% Full
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Available Spots</span>
                          <span className="font-medium">
                            {lot.availableSpots}/{lot.totalSpots}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Active Sessions</span>
                          <span className="font-medium">
                            {lotActiveSessions.length}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Hourly Rate</span>
                          <span className="font-medium">
                            FRW {lot.hourlyRate.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === "bookings" && (
          <div className="space-y-8">
            {/* Booking Statistics */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Bookings</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {bookingStats?.totalBookings || 0}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Today's Bookings</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {bookingStats?.todayBookings || 0}
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-green-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Active Bookings</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {bookingStats?.activeBookings || 0}
                    </p>
                  </div>
                  <Eye className="h-8 w-8 text-orange-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Completed</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {bookingStats?.completedBookings || 0}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">
                  Recent Bookings
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vehicle
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lot
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Spot
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookings
                      .filter((booking) =>
                        managedLots.some((lot) => lot.id === booking.lotId)
                      )
                      .slice(0, 10)
                      .map((booking) => (
                        <tr key={booking.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {booking.user?.name || "Unknown User"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.user?.email || ""}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {booking.vehicle?.licensePlate || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.vehicle?.make} {booking.vehicle?.model}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {booking.lot?.name || "Unknown Lot"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {booking.spot?.spotNumber || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(booking.startTime).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(booking.startTime).toLocaleTimeString()}{" "}
                              - {new Date(booking.endTime).toLocaleTimeString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                booking.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : booking.status === "completed"
                                  ? "bg-blue-100 text-blue-800"
                                  : booking.status === "cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {booking.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                {bookings.length === 0 && (
                  <div className="text-center py-8">
                    <Clock className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No bookings
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      No bookings have been made for your managed lots yet.
                    </p>
                  </div>
                )}
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

        {activeTab === "live" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Live Parking Sessions
            </h2>

            <div className="grid gap-6">
              {activeSessions.map((session) => {
                const lot = managedLots.find((l) => l.id === session.lotId);
                const vehicle = session.vehicle;
                const customer = session.user;
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
                            {customer?.name}
                          </h3>
                          <span className="text-sm text-gray-500">
                            #{session.id}
                          </span>
                        </div>

                        <div className="grid md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">{lot?.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Car className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">
                              {vehicle?.licensePlate}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-400" />
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

        {activeTab === "spots" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Spot Management
              </h2>
              {managedLots.length > 0 && (
                <select
                  className="border border-gray-300 rounded px-2 py-1 mr-2"
                  value={selectedLotId}
                  onChange={(e) => setSelectedLotId(e.target.value)}
                >
                  <option value="">Select Lot</option>
                  {managedLots.map((lot) => (
                    <option key={lot.id} value={lot.id}>
                      {lot.name}
                    </option>
                  ))}
                </select>
              )}
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                onClick={() => {
                  if (selectedLotId) {
                    setEditingSpot(null);
                    setShowSpotForm(true);
                  } else {
                    alert("Please select a lot to add a spot.");
                  }
                }}
                disabled={managedLots.length === 0}
              >
                Add Spot
              </button>
            </div>
            {/* Render SpotForm inline below the Add Spot button */}
            {showSpotForm && (
              <div className="mb-6">
                <SpotForm
                  onClose={() => {
                    setShowSpotForm(false);
                    setEditingSpot(null);
                  }}
                  onSubmit={handleSpotSubmit}
                  editingSpot={editingSpot}
                  isEditing={!!editingSpot}
                  lotId={selectedLotId}
                />
              </div>
            )}
            <div className="grid gap-6">
              {managedLots.map((lot) => {
                const lotSpots = spots.filter((spot) => spot.lotId === lot.id);
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
                          {lotSpots.length} spots configured
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {lotSpots.map((spot) => (
                        <div
                          key={spot.id}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {spot.spotNumber}
                              </h4>
                              <span
                                className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                                  spot.spotType === "regular"
                                    ? "bg-blue-100 text-blue-800"
                                    : spot.spotType === "premium"
                                    ? "bg-purple-100 text-purple-800"
                                    : spot.spotType === "electric"
                                    ? "bg-green-100 text-green-800"
                                    : spot.spotType === "covered"
                                    ? "bg-gray-100 text-gray-800"
                                    : "bg-orange-100 text-orange-800"
                                }`}
                              >
                                {spot.spotType?.toUpperCase?.() || "SPOT"}
                              </span>
                            </div>
                            <div className="flex space-x-1">
                              <button
                                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                onClick={() => handleEditSpot(spot)}
                                title="Edit spot"
                              >
                                <Settings className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Status</span>
                              <span
                                className={`font-medium ${
                                  spot.isAvailable
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {spot.isAvailable ? "Available" : "Occupied"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">RFID Reader</span>
                              <span className="font-medium">
                                {spot.rfidReaderId}
                              </span>
                            </div>
                            {spot.isMaintenance && (
                              <div className="flex justify-between">
                                <span className="text-gray-500">
                                  Maintenance
                                </span>
                                <span className="font-medium text-orange-600">
                                  Yes
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    {lotSpots.length === 0 && (
                      <div className="text-center py-8">
                        <Car className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">
                          No spots configured for this lot
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Analytics & Reports
            </h2>

            {/* Revenue Summary */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Revenue Summary
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-3xl font-bold text-blue-600">
                    FRW {totalRevenue.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-3xl font-bold text-green-600">
                    {todaySessions.length}
                  </p>
                  <p className="text-sm text-gray-600">Today's Sessions</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-3xl font-bold text-purple-600">
                    {todaySessions.length > 0
                      ? (totalRevenue / todaySessions.length).toFixed(2)
                      : "0.00"}
                  </p>
                  <p className="text-sm text-gray-600">Avg. Session Value</p>
                </div>
              </div>
            </div>

            {/* Session History */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Sessions
              </h3>
              <div className="space-y-4">
                {/* You can fetch and display recent sessions here using your real data */}
                {activeSessions
                  .filter((session) => managedLotIds.includes(session.lotId))
                  .slice(0, 5)
                  .map((session) => {
                    const lot = managedLots.find((l) => l.id === session.lotId);
                    const customer = session.user;

                    return (
                      <div
                        key={session.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              session.status === "active"
                                ? "bg-green-500"
                                : "bg-gray-400"
                            }`}
                          ></div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {customer?.name}
                            </p>
                            <p className="text-sm text-gray-500">{lot?.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            {session.amount
                              ? `FRW ${session.amount.toFixed(2)}`
                              : "Active"}
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

      {/* Spot Form Modal */}
      {showSpotForm && (
        <SpotForm
          onClose={() => {
            setShowSpotForm(false);
            setEditingSpot(null);
          }}
          onSubmit={handleSpotSubmit}
          editingSpot={editingSpot}
          isEditing={!!editingSpot}
          lotId={selectedLotId}
        />
      )}
    </div>
  );
};

export default ManagerDashboard;
