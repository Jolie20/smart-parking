import React, { useState, useEffect } from "react";
import {
  Car,
  MapPin,
  Clock,
  CreditCard,
  Plus,
  Calendar,
  Activity,
  User,
  Phone,
  Mail,
  Edit,
  Trash2,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth.tsx";
import { vehicleService } from "../../services/vehicleService";
import { bookingService } from "../../services/bookingService";
import { sessionService } from "../../services/sessionService";
import { lotService } from "../../services/lotService";
import {
  Vehicle,
  Booking,
  ParkingSession,
  ParkingLot,
  CreateVehicleRequest,
} from "../../types";
import BookingForm from "./forms/BookingForm.tsx";
import VehicleForm from "./VehicleForm.tsx";

const UserDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [, setCurrentTime] = useState(new Date());
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [sessions, setSessions] = useState<ParkingSession[]>([]);
  const [lots, setLots] = useState<ParkingLot[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [successes, setSuccesses] = useState<string[]>([]);
  const [deviceMessage, setDeviceMessage] = useState<string | null>(null);
  const [deviceBalance, setDeviceBalance] = useState<number | null>(null);
  const [deviceCost, setDeviceCost] = useState<number | null>(null);
  const [deviceTime, setDeviceTime] = useState<number | null>(null);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Derive available slots from lots state
  useEffect(() => {
    const mapped = (lots || []).map((lot: any) => ({
      id: lot.id,
      name: lot.name,
      address: lot.address,
      availableSpots: lot.availableSpots,
      hourlyRate: lot.hourlyRate,
      occupancyRate:
        lot.totalSpots > 0
          ? Math.round(
              ((lot.totalSpots - lot.availableSpots) / lot.totalSpots) * 100
            )
          : 0,
    }));
    setAvailableSlots(mapped);
  }, [lots]);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const [b, v, s, l] = await Promise.all([
          bookingService.list(),
          vehicleService.list(),
          sessionService.list(),
          lotService.list(),
        ]);
        setBookings(b || []);
        setVehicles(v || []);
        setSessions(s || []);
        setLots(l || []);
      } catch (e) {
        setErrors(["Failed to load your data."]);
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
  const userSessions = sessions.filter(
    (s: ParkingSession) => s.userId === user?.id
  );
  // const activeSession = userSessions.find((s) => s.status === "active");

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

      if (!bookingData.startTime || !bookingData.endTime) {
        validationErrors.push("Start and end times are required");
      }

      if (bookingData.startTime && bookingData.endTime) {
        const startTime = new Date(`2025-09-16T${bookingData.startTime}:00`);
        const endTime = new Date(`2026-0-01T${bookingData.endTime}:00`);

        if (endTime <= startTime) {
          validationErrors.push("End time must be after start time");
        }
      }

      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        return;
      }

      // Build body the way backend expects
      const lotName =
        bookingData.lotName ||
        lots.find((l: any) => l.id === bookingData.lotId)?.name;
      const vehiclePlate =
        bookingData.vehiclePlate || userVehicles[0]?.licensePlate;
      const spotNumber = bookingData.spotNumber || "A1";
      // Estimate amount based on lot hourlyRate and duration
      const start = new Date(`2024-01-01T${bookingData.startTime}:00Z`);
      const end = new Date(`2024-01-01T${bookingData.endTime}:00Z`);
      const hours = Math.max(
        1,
        (end.getTime() - start.getTime()) / (1000 * 60 * 60)
      );
      const lotForRate: any = lots.find((l: any) => l.name === lotName);
      const totalAmount = lotForRate
        ? lotForRate.hourlyRate * hours
        : undefined;

      const created = await bookingService.create({
        lotName: String(lotName || ""),
        spotNumber: String(spotNumber),
        vehiclePlate: String(vehiclePlate || ""),
        startTime: `2024-01-01T${bookingData.startTime}:00Z`,
        endTime: `2024-01-01T${bookingData.endTime}:00Z`,
        totalAmount,
      } as any);
      setBookings((prev) => [...prev, created]);
      setSuccesses(["Booking created successfully."]);

      // Clear errors and close form
      setErrors([]);
      setShowBookingForm(false);

      console.log("Booking created successfully:", created);
    } catch (error) {
      console.error("Error creating booking:", error);
      setErrors(["An unexpected error occurred. Please try again."]);
    }
  };

  // const calculateBookingAmount = (
  //   startTime: string,
  //   endTime: string,
  //   spotType: string
  // ): number => {
  //   const start = new Date(`2024-01-01T${startTime}:00`);
  //   const end = new Date(`2024-01-01T${endTime}:00`);
  //   const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

  //   const rates = {
  //     regular: 2,
  //     premium: 3,
  //     covered: 4,
  //     electric: 5,
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
      const createdWithUser = {
        ...created,
        // Ensure it appears under "My Vehicles" even if API omits userId
        userId: (created as any)?.userId ?? user?.id,
      } as Vehicle;
      setVehicles((prev) => [...prev, createdWithUser]);
      setShowVehicleForm(false);
      setErrors([]);
      setSuccesses(["Vehicle added successfully. See it under My Vehicles."]);
      // Jump user to Vehicles tab so the new item is visible immediately
      setActiveTab("vehicles");
    } catch (error) {
      console.error("Error creating vehicle:", error);
      setErrors(["Failed to add vehicle. Please try again."]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    try {
      setIsLoading(true);
      await vehicleService.remove(vehicleId);
      setVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
      setErrors([]);
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      setErrors(["Failed to delete vehicle. Please try again."]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      setIsLoading(true);
      await bookingService.cancel(bookingId);
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: "cancelled" as const } : b
        )
      );
      setErrors([]);
    } catch (error) {
      console.error("Error cancelling booking:", error);
      setErrors(["Failed to cancel booking. Please try again."]);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "bookings", label: "My Bookings", icon: Calendar },
    { id: "vehicles", label: "My Vehicles", icon: Car },
    { id: "profile", label: "Profile", icon: User },
  ];

  useEffect(() => {
    let interval: any;
    if (activeTab === "bookings") {
      const fetchStatus = async () => {
        try {
          const [mRes, bRes, cRes, tRes] = await Promise.all([
            fetch("http://localhost:4000/api/arduino/message"),
            fetch("http://localhost:4000/api/arduino/balance"),
            fetch("http://localhost:4000/api/arduino/cost"),
            fetch("http://localhost:4000/api/arduino/time"),
          ]);
          const mJson = await mRes.json();
          const bJson = await bRes.json();
          const cJson = await cRes.json();
          const tJson = await tRes.json();

          // Only show payment success messages to users
          const isPaymentSuccess =
            mJson?.message && /Payment\s*successful/i.test(mJson.message);
          setDeviceMessage(isPaymentSuccess ? mJson.message : null);
          setDeviceBalance(
            typeof bJson?.balance === "number" ? bJson.balance : null
          );
          setDeviceCost(typeof cJson?.cost === "number" ? cJson.cost : null);
          setDeviceTime(typeof tJson?.time === "number" ? tJson.time : null);

          // If payment succeeded and we have a cost, attach it to the latest booking
          const paid = typeof cJson?.cost === "number" && isPaymentSuccess;
          if (paid && user?.id) {
            setBookings((prev) => {
              const copy = [...prev];
              const lastIdx = copy
                .map((b, idx) => ({ b, idx }))
                .filter(({ b }) => b.userId === user.id)
                .map(({ idx }) => idx)
                .pop();
              if (lastIdx !== undefined) {
                copy[lastIdx] = {
                  ...copy[lastIdx],
                  totalAmount: cJson.cost,
                  status: "completed",
                } as Booking;
              }
              return copy;
            });
          }
        } catch (e) {
          // ignore network errors
        }
      };
      fetchStatus();
      interval = setInterval(fetchStatus, 3000);
    }
    return () => interval && clearInterval(interval);
  }, [activeTab, user?.id]);

  // const getmessage = async () => {
  //   try {
  //     const res = await fetch("http://localhost:4000/api/arduino", {
  //       method: "GET",
  //       headers: { "Content-Type": "application/json" },
  //     });
  //     const data = await res.json();
  //     console.log("received Arduino:", data);
  //   } catch (err) {
  //     console.error("Error:", err);
  //   }
  // };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">
                SmartPark
              </span>
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
                    ? "border-blue-600 text-blue-600"
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
            {/* Available Parking Slots */}
            {availableSlots.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Available Parking Slots
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableSlots.map((lot) => (
                    <div
                      key={lot.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {lot.name}
                          </h4>
                          <p className="text-sm text-gray-500">{lot.address}</p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            lot.availableSpots > 5
                              ? "bg-green-100 text-green-800"
                              : lot.availableSpots > 0
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {lot.availableSpots} available
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Rate:</span>
                          <span className="font-medium">
                            FRW {lot.hourlyRate}/hr
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Occupancy:</span>
                          <span className="font-medium">
                            {lot.occupancyRate}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              lot.occupancyRate > 80
                                ? "bg-red-500"
                                : lot.occupancyRate > 60
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            }`}
                            style={{
                              width: `${Math.min(lot.occupancyRate, 100)}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Bookings</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {userBookings.length}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">My Vehicles</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {userVehicles.length}
                    </p>
                  </div>
                  <Car className="h-8 w-8 text-green-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Sessions</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {userSessions.length}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-purple-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Spent</p>
                    <p className="text-3xl font-bold text-gray-900">
                      FRW
                      {userSessions
                        .filter((s) => s.amount)
                        .reduce((sum, s) => sum + (s.amount || 0), 0)
                        .toFixed(2)}
                    </p>
                  </div>
                  <CreditCard className="h-8 w-8 text-orange-600" />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {userSessions.slice(0, 3).map((session) => {
                  const lot = lots.find((l: any) => l.id === session.lotId);
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
                            {lot?.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(session.checkInTime).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {session.amount
                            ? `FRW ${session.amount.toFixed(2)}`
                            : "Active"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {session.duration
                            ? formatDuration(session.duration)
                            : "In progress"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === "bookings" && (
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

            {(deviceMessage ||
              deviceBalance !== null ||
              deviceCost !== null ||
              deviceTime !== null) && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 shadow-lg">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Device Status
                    </h3>
                    <p className="text-sm text-gray-600">
                      Real-time parking information
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {deviceMessage && (
                    <div className="bg-white rounded-lg p-4 border border-blue-100">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-medium text-blue-700 uppercase tracking-wide">
                          Message
                        </span>
                      </div>
                      <p className="text-sm text-gray-800 font-medium leading-relaxed">
                        {deviceMessage}
                      </p>
                    </div>
                  )}

                  {deviceBalance !== null && (
                    <div className="bg-white rounded-lg p-4 border border-green-100">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-medium text-green-700 uppercase tracking-wide">
                          Balance
                        </span>
                      </div>
                      <p className="text-lg font-bold text-gray-900">
                        FRW {deviceBalance}
                      </p>
                      <p className="text-xs text-gray-500">Remaining</p>
                    </div>
                  )}

                  {deviceCost !== null && (
                    <div className="bg-white rounded-lg p-4 border border-purple-100">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-medium text-purple-700 uppercase tracking-wide">
                          Cost
                        </span>
                      </div>
                      <p className="text-lg font-bold text-gray-900">
                        FRW {deviceCost}
                      </p>
                      <p className="text-xs text-gray-500">Last Payment</p>
                    </div>
                  )}

                  {deviceTime !== null && (
                    <div className="bg-white rounded-lg p-4 border border-orange-100">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-medium text-orange-700 uppercase tracking-wide">
                          Duration
                        </span>
                      </div>
                      <p className="text-lg font-bold text-gray-900">
                        {formatDuration(deviceTime)}
                      </p>
                      <p className="text-xs text-gray-500">Parking Time</p>
                    </div>
                  )}
                </div>

                {!deviceMessage &&
                  !deviceBalance &&
                  !deviceCost &&
                  !deviceTime && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg
                          className="w-8 h-8 text-blue-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-500 font-medium">
                        Awaiting device message...
                      </p>
                      <p className="text-sm text-gray-400">
                        Tap your card to see real-time updates
                      </p>
                    </div>
                  )}
              </div>
            )}

            <div className="grid gap-6">
              {userBookings.map((booking) => {
                const lot = lots.find((l: any) => l.id === booking.lotId);
                const vehicle = vehicles.find(
                  (v: any) => v.id === booking.vehicleId
                );
                return (
                  <div
                    key={booking.id}
                    className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              booking.status === "active"
                                ? "bg-green-100 text-green-800"
                                : booking.status === "confirmed"
                                ? "bg-blue-100 text-blue-800"
                                : booking.status === "completed"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {booking.status.charAt(0).toUpperCase() +
                              booking.status.slice(1)}
                          </span>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {lot?.name}
                          </h3>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">
                              {lot?.address}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Car className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">
                              {vehicle?.licensePlate} - {vehicle?.make}{" "}
                              {vehicle?.model}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">
                              {new Date(booking.startTime).toLocaleDateString()}{" "}
                              - {new Date(booking.endTime).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        {booking.totalAmount && (
                          <>
                            <p className="text-2xl font-bold text-gray-900">
                              ${booking.totalAmount.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500">Total Cost</p>
                          </>
                        )}
                        {booking.status === "confirmed" && (
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

        {activeTab === "vehicles" && (
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
                <div
                  key={vehicle.id}
                  className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Car className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {vehicle.make} {vehicle.model}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {vehicle.color} • {vehicle.year}
                        </p>
                        <span
                          className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                            vehicle.vehicleType === "car"
                              ? "bg-blue-100 text-blue-800"
                              : vehicle.vehicleType === "suv"
                              ? "bg-green-100 text-green-800"
                              : vehicle.vehicleType === "truck"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {vehicle.vehicleType.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        onClick={() => {
                          /* Edit vehicle */
                        }}
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
                      <span className="font-medium">
                        {vehicle.licensePlate}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">RFID Card</span>
                      <span className="font-medium">{vehicle.rfidCard}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status</span>
                      <span
                        className={`font-medium ${
                          vehicle.isActive ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {vehicle.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {userVehicles.length === 0 && (
              <div className="text-center py-12">
                <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-500">
                  No Vehicles Added
                </h3>
                <p className="text-gray-400">
                  Add your first vehicle to start making bookings
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "profile" && (
          <div className="max-w-2xl space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Profile Settings
            </h2>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Personal Information
              </h3>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <User className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-900">{user?.name}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-900">{user?.email}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-900">
                      {user?.phone || "Not provided"}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text sm font-medium text-gray-700 mb-2">
                    Member Since
                  </label>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-900">
                      {new Date(user?.createdAt || "").toLocaleDateString()}
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
          lots={lots}
          vehicles={vehicles}
          userVehicles={userVehicles}
        />
      )}

      {/* Vehicle Form Modal */}
      {showVehicleForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm"
          onClick={() => setShowVehicleForm(false)}
        >
          <div
            className="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
              onClick={() => setShowVehicleForm(false)}
              aria-label="Close"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <VehicleForm
              onClose={() => setShowVehicleForm(false)}
              onSubmit={handleVehicleSubmit}
            />
          </div>
        </div>
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
                  Booking Errors
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
      {/* Success Display */}
      {successes.length > 0 && (
        <div className="fixed top-4 right-4 z-50 max-w-md mt-20">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414L9 13.414l4.707-4.707z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Success</h3>
                <div className="mt-2 text-sm text-green-700">
                  <ul className="list-disc pl-5 space-y-1">
                    {successes.map((msg, index) => (
                      <li key={index}>{msg}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    className="bg-green-50 px-2 py-1.5 rounded-md text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600"
                    onClick={() => setSuccesses([])}
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

// Example usage
//<button onClick={() => sendCommand("OPEN_GATE")}>Open Gate</button>
//<button onClick={() => sendCommand("CLOSE_GATE")}>Close Gate</button>

export default UserDashboard;
