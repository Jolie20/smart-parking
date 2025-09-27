import React, { useState } from "react";
import { X, Car } from "lucide-react";
import {
  CreateVehicleRequest,
  VehicleType,
  UpdateVehicleRequest,
} from "../../types";
import { vehicleService } from "../../services/vehicleService";

interface VehicleFormProps {
  onClose: () => void;
  onSubmit: (vehicleData: CreateVehicleRequest) => void;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState<CreateVehicleRequest>({
    licensePlate: "",
    make: "",
    model: "",
    color: "",
    year: undefined,
    vehicleType: "car",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleChange = (
    field: keyof CreateVehicleRequest,
    value: string | VehicleType | number | undefined
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const validationErrors: string[] = [];
    if (!formData.licensePlate.trim())
      validationErrors.push("License plate is required");
    if (!formData.make.trim()) validationErrors.push("Make is required");
    if (!formData.model.trim()) validationErrors.push("Model is required");
    if (!formData.color.trim()) validationErrors.push("Color is required");
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsLoading(true);
    try {
      const createdVehicle = await vehicleService.create(formData);
      onSubmit(createdVehicle);
      setIsLoading(false);
      onClose();
    } catch (error: any) {
      setErrors([error?.response?.data?.error || "Failed to create vehicle."]);
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow-md">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          License Plate *
        </label>
        <input
          type="text"
          value={formData.licensePlate}
          onChange={(e) => handleChange("licensePlate", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="License Plate"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Make *
        </label>
        <input
          type="text"
          value={formData.make}
          onChange={(e) => handleChange("make", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Toyota"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Model *
        </label>
        <input
          type="text"
          value={formData.model}
          onChange={(e) => handleChange("model", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Camry"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Color *
        </label>
        <input
          type="text"
          value={formData.color}
          onChange={(e) => handleChange("color", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Blue"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Year
        </label>
        <input
          type="number"
          value={formData.year || ""}
          onChange={(e) =>
            handleChange(
              "year",
              e.target.value ? parseInt(e.target.value) : undefined
            )
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="2020"
          min="1900"
          max="2025"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Vehicle Type
        </label>
        <select
          value={formData.vehicleType || "car"}
          onChange={(e) =>
            handleChange("vehicleType", e.target.value as VehicleType)
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="car">Car</option>
          <option value="suv">SUV</option>
          <option value="truck">Truck</option>
          <option value="van">Van</option>
          <option value="motorcycle">Motorcycle</option>
        </select>
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
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          disabled={isLoading}
        >
          Add Vehicle
        </button>
      </div>
      {errors.length > 0 && (
        <div className="mt-2">
          {errors.map((err, idx) => (
            <div key={idx} style={{ color: "red" }}>
              {err}
            </div>
          ))}
        </div>
      )}
    </form>
  );
};

export default VehicleForm;
