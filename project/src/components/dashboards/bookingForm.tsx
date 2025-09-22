import React, { useState, useEffect } from "react";

interface BookingFormProps {
  onClose: () => void;
  onBook: (booking: BookingFormData) => Promise<void> | void;
}

interface BookingFormData {
  cardid: string;
  vehicleNumber: string;
  vehicleType: string;
  startTime: string;
  endTime: string;
  spotType: string;
  parkingLotId?: string;
}

const BookingForm: React.FC<BookingFormProps> = ({ onClose, onBook }) => {
  const [formData, setFormData] = useState<BookingFormData>({
    cardid: "",
    vehicleNumber: "",
    vehicleType: "car",
    startTime: "",
    endTime: "",
    spotType: "regular",
    parkingLotId: "",
  });

  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);

  // Fetch available slots when component mounts
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/api/lots/available"
        );
        const data = await response.json();
        setAvailableSlots(data);
      } catch (error) {
        console.error("Error fetching available slots:", error);
      }
    };

    fetchAvailableSlots();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Clear previous errors
    setFormErrors([]);

    // Validate form data
    const errors: string[] = [];

    if (!formData.cardid.trim()) {
      errors.push("card id is required");
    }

    if (!formData.vehicleNumber.trim()) {
      errors.push("Vehicle number is required");
    }

    if (!formData.parkingLotId) {
      errors.push("Please select a parking lot");
    }

    if (!formData.startTime) {
      errors.push("Start time is required");
    }

    if (!formData.endTime) {
      errors.push("End time is required");
    }

    if (formData.startTime && formData.endTime) {
      const startTime = new Date(`2025-09-18T${formData.startTime}:00`);
      const endTime = new Date(`2025-09-29T${formData.endTime}:00`);

      if (endTime <= startTime) {
        errors.push("End time must be after start time");
      }
    }

    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    // Submit the booking
    onBook(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Clear errors when user starts typing
    if (formErrors.length > 0) {
      setFormErrors([]);
    }
  };

  // Generate time slots
  const generateTimeSlots = (): string[] => {
    const slots: string[] = [];
    for (let hour = 6; hour <= 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Book Parking Spot</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            title="Close booking form"
            aria-label="Close booking form"
          >
            <svg
              className="w-6 h-6"
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
        </div>

        {/* Form Errors */}
        {formErrors.length > 0 && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3">
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
                  Please fix the following errors:
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <ul className="list-disc pl-5 space-y-1">
                    {formErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Parking Lot Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Parking Lot *
            </label>
            <select
              name="parkingLotId"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.parkingLotId}
              onChange={handleChange}
              aria-label="Select parking lot"
            >
              <option value=""></option>
              <option value="Downtown">Downtown plaza</option>
              <option value="chic">Chic mall</option>
              <option value="city">City town</option>
              
              {availableSlots.map((lot) => (
                <option key={lot.id} value={lot.id}>
                  {lot.name} - {lot.availableSpots} spots available (FRW
                  {lot.hourlyRate}/hr)
                </option>
              ))}
            </select>
            {availableSlots.length === 0 && (
              <p className="text-sm text-red-600 mt-1">
              
                
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Card id *
            </label>
            <input
              type="text"
              name="cardid"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., A1234"
              value={formData.cardid}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle Number *
            </label>
            <input
              type="text"
              name="vehicleNumber"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., ABC-1234"
              value={formData.vehicleNumber}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle Type
            </label>
            <select
              name="vehicleType"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.vehicleType}
              onChange={handleChange}
              aria-label="Select vehicle type"
            >
              <option value="car">Car</option>
              <option value="motorcycle">Motorcycle</option>
              <option value="truck">Truck</option>
              <option value="van">Van</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Spot Type
            </label>
            <select
              name="spotType"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.spotType}
              onChange={handleChange}
              aria-label="Select spot type"
            >
              <option value="regular">Regular (FRW 200/hour)</option>
              <option value="premium">Premium (FRW 300/hour)</option>
              <option value="covered">Covered (FRW 400/hour)</option>
              <option value="electric">Electric Vehicle (FRW 100/hour)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time *
              </label>
              <select
                name="startTime"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.startTime}
                onChange={handleChange}
                aria-label="Select start time"
              >
                <option value="">Select time</option>
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time *
              </label>
              <select
                name="endTime"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.endTime}
                onChange={handleChange}
                aria-label="Select end time"
              >
                <option value="">Select time</option>
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-blue-800 mb-2">
              Booking Summary
            </h3>
            <div className="text-sm text-blue-700">
              {formData.parkingLotId && (
                <p>
                  Parking Lot:{" "}
                  {availableSlots.find(
                    (lot) => lot.id === formData.parkingLotId
                  )?.name || "Selected lot"}
                </p>
              )}
              <p>Vehicle: {formData.vehicleNumber || "Not specified"}</p>
              <p>Type: {formData.vehicleType}</p>
              <p>Spot: {formData.spotType}</p>
              {formData.startTime && formData.endTime && (
                <p>
                  Duration: {formData.startTime} - {formData.endTime}
                </p>
              )}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Book Spot
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
