import React, { useState } from 'react';

interface BookingFormProps {
  onClose: () => void;
  onBook: (booking: Booking) => void;
}

interface FormData {
  vehicleNumber: string;
  vehicleType: string;
  startTime: string;
  endTime: string;
  spotType: string;
}

interface Booking extends FormData {
  id: string;
  status: string;
  createdAt: string;
  spotNumber: number;
}

const BookingForm: React.FC<BookingFormProps> = ({ onClose, onBook }) => {
  const [formData, setFormData] = useState<FormData>({
    vehicleNumber: '',
    vehicleType: 'car',
    startTime: '',
    endTime: '',
    spotType: 'regular'
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const booking: Booking = {
      id: Date.now().toString(),
      ...formData,
      status: 'booked',
      createdAt: new Date().toISOString(),
      spotNumber: Math.floor(Math.random() * 100) + 1
    };
    onBook(booking);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Generate time slots
  const generateTimeSlots = (): string[] => {
    const slots: string[] = [];
    for (let hour = 6; hour <= 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Book Parking Spot</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle Number
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
            >
              <option value="regular">Regular ($2/hour)</option>
              <option value="premium">Premium ($3/hour)</option>
              <option value="covered">Covered ($4/hour)</option>
              <option value="electric">Electric Vehicle ($5/hour)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <select
                name="startTime"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.startTime}
                onChange={handleChange}
              >
                <option value="">Select time</option>
                {timeSlots.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <select
                name="endTime"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.endTime}
                onChange={handleChange}
              >
                <option value="">Select time</option>
                {timeSlots.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Booking Summary</h3>
            <div className="text-sm text-blue-700">
              <p>Vehicle: {formData.vehicleNumber || 'Not specified'}</p>
              <p>Type: {formData.vehicleType}</p>
              <p>Spot: {formData.spotType}</p>
              {formData.startTime && formData.endTime && (
                <p>Duration: {formData.startTime} - {formData.endTime}</p>
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