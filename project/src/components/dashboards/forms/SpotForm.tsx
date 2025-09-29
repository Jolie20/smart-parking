import React, { useState } from "react";
import { X, MapPin, Car } from "lucide-react";

interface SpotFormProps {
  onClose: () => void;
  onSubmit: (spotData: any) => void;
  editingSpot?: any;
  isEditing?: boolean;
  lotId: string;
}

const SpotForm: React.FC<SpotFormProps> = ({
  onClose,
  onSubmit,
  editingSpot,
  isEditing = false,
  lotId,
}) => {
  const [formData, setFormData] = useState({
    spotNumber: editingSpot?.spotNumber || "",
    isAvailable: true,
    isReserved: false,
    vehicleId: "",
    lotname: "",
    isMaintenance: editingSpot?.isMaintenance || false,
  });
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors: string[] = [];

    if (!formData.spotNumber.trim()) {
      validationErrors.push("Spot number is required");
    }

    // RFID reader not required by backend final routes

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit({
      spotNumber: formData.spotNumber,
      isAvailable: true,
      isReserved: false,
      vehicleId: formData.vehicleId || undefined,
      lotname: formData.lotname,
    });
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Car className="h-5 w-5 text-orange-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {isEditing ? "Edit Parking Spot" : "Add New Parking Spot"}
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
              Spot Number *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={formData.spotNumber}
                onChange={(e) => handleChange("spotNumber", e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="A1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lot Name *
            </label>
            <input
              type="text"
              value={formData.lotname}
              onChange={(e) => handleChange("lotname", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Downtown Plaza"
            />
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="maintenance"
              checked={formData.isMaintenance}
              onChange={(e) => handleChange("isMaintenance", e.target.checked)}
              className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
            <label htmlFor="maintenance" className="text-sm text-gray-700">
              Under Maintenance
            </label>
          </div>

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
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              {isEditing ? "Update Spot" : "Add Spot"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SpotForm;
