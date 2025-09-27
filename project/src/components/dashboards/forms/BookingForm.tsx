import React, { useState, useEffect } from "react";
import { X, Calendar, Clock, Car, MapPin, CreditCard } from "lucide-react";
import { spotsService } from "../../../services/spotsService";
import {
  CreateBookingRequest,
  ParkingLot,
  spotRequest,
  Vehicle,
} from "../../../types";

interface BookingFormProps {
  onClose: () => void;
  onBook: (bookingData: CreateBookingRequest) => void;
  lots: ParkingLot[];
  vehicles: Vehicle[];
  userVehicles: Vehicle[];
  spots: spotRequest[];
}

const BookingForm: React.FC<BookingFormProps> = ({
  onClose,
  onBook,
  lots,
  vehicles,
  userVehicles,
}) => {
  const [formData, setFormData] = useState<any>({
    lotId: "",
    lotName: "",
    spotNumber: "",
    vehicleId: "",
    vehiclePlate: "",
    startTime: "",
    endTime: "",
    specialRequests: "",
  });
  const [availableSpots, setAvailableSpots] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const availableLots = lots.filter((lot) => lot.availableSpots > 0);
  //const availableSpots = spots.filter((spot) => spot.isAvailable);

  useEffect(() => {
    // Set default start time to current time + 1 hour
    const now = new Date();
    now.setHours(now.getHours() + 1);
    const startTime = now.toTimeString().slice(0, 5);

    // Set default end time to start time + 2 hours
    const endTime = new Date(now.getTime() + 2 * 60 * 60 * 1000)
      .toTimeString()
      .slice(0, 5);

    setFormData((prev: any) => ({
      ...prev,
      startTime,
      endTime,
    }));
  }, []);

  // Fetch available spots when lotId changes
  useEffect(() => {
    async function fetchSpots() {
      if (formData.lotId) {
        try {
          const spots = await spotsService.getSpotsByLot(formData.lotId);
          setAvailableSpots(spots.filter((s: any) => s.isAvailable));
        } catch (err) {
          setAvailableSpots([]);
        }
      } else {
        setAvailableSpots([]);
      }
    }
    fetchSpots();
  }, [formData.lotId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors: string[] = [];

    if (!formData.lotId) {
      validationErrors.push("Please select a parking lot");
    }

    if (!formData.vehicleId) {
      validationErrors.push("Please select a vehicle");
    }

    if (!formData.startTime) {
      validationErrors.push("Start time is required");
    }

    if (!formData.endTime) {
      validationErrors.push("End time is required");
    }

    if (formData.startTime && formData.endTime) {
      const start = new Date(`2024-01-01T${formData.startTime}:00`);
      const end = new Date(`2024-01-01T${formData.endTime}:00`);

      if (end <= start) {
        validationErrors.push("End time must be after start time");
      }
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Convert to full datetime strings
    const startDateTime = `${selectedDate}T${formData.startTime}:00Z`;
    const endDateTime = `${selectedDate}T${formData.endTime}:00Z`;

    const lot = lots.find((l) => l.id === formData.lotId);
    const veh = userVehicles.find((v) => v.id === formData.vehicleId);

    onBook({
      lotName: lot?.name,
      spotNumber: formData.spotNumber || "A1",
      vehiclePlate: veh?.licensePlate,
      startTime: startDateTime,
      endTime: endDateTime,
    } as any);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const calculateEstimatedCost = () => {
    if (!formData.lotId || !formData.startTime || !formData.endTime) return 0;

    const lot = lots.find((l) => l.id === formData.lotId);
    if (!lot) return 0;

    const start = new Date(`2024-01-01T${formData.startTime}:00`);
    const end = new Date(`2024-01-01T${formData.endTime}:00`);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

    return hours * lot.hourlyRate;
  };

  const selectedLot = lots.find((l) => l.id === formData.lotId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Book Parking Spot
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Close form"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-sm text-red-700">
                <ul className="list-disc pl-5 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date *
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              title="Select booking date"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Parking Lot *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={formData.lotId}
                onChange={(e) => handleChange("lotId", e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                title="Select parking lot"
              >
                <option value="">Select a parking lot</option>
                {availableLots.map((lot) => (
                  <option key={lot.id} value={lot.id}>
                    {lot.name} - {lot.availableSpots} spots available (FRW
                    {lot.hourlyRate}/hr)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Spot Number *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={formData.spotNumber}
                onChange={(e) => handleChange("spotNumber", e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                title="Select spot number"
                required
                disabled={!formData.lotId}
              >
                <option value="">Select a spot</option>
                {availableSpots.map((spot: any) => (
                  <option key={spot.spotId} value={spot.spotNumber}>
                    {spot.spotNumber}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle *
            </label>
            <div className="relative">
              <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={formData.vehicleId}
                onChange={(e) => handleChange("vehicleId", e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                title="Select vehicle"
              >
                <option value="">Select a vehicle</option>
                {userVehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.licensePlate} - {vehicle.make} {vehicle.model}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleChange("startTime", e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  title="Select start time"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleChange("endTime", e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  title="Select end time"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Requests
            </label>
            <textarea
              value={formData.specialRequests}
              onChange={(e) => handleChange("specialRequests", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Any special requirements or notes..."
            />
          </div>

          {/* Cost Estimation */}
          {selectedLot && formData.startTime && formData.endTime && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CreditCard className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Cost Estimation
                </span>
              </div>
              <div className="text-sm text-blue-700">
                <p>Parking Lot: {selectedLot.name}</p>
                <p>Rate: ${selectedLot.hourlyRate}/hour</p>
                <p className="font-semibold">
                  Estimated Total: ${calculateEstimatedCost().toFixed(2)}
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Book Parking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
