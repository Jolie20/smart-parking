import React, { useState } from 'react';
import { X, MapPin, DollarSign, Clock, Settings } from 'lucide-react';
import { CreateLotRequest, UpdateLotRequest, ParkingFeature, User } from '../../../types';

interface LotFormProps {
  onClose: () => void;
  onSubmit: (lotData: CreateLotRequest | UpdateLotRequest) => void;
  editingLot?: any;
  isEditing?: boolean;
  managers: User[];
}

const LotForm: React.FC<LotFormProps> = ({ onClose, onSubmit, editingLot, isEditing = false, managers }) => {
  const [formData, setFormData] = useState<CreateLotRequest>({
    name: editingLot?.name || '',
    description: editingLot?.description || '',
    address: editingLot?.address || '',
    city: editingLot?.city || '',
    state: editingLot?.state || '',
    zipCode: editingLot?.zipCode || '',
    coordinates: editingLot?.coordinates || undefined,
    totalSpots: editingLot?.totalSpots || 0,
    hourlyRate: editingLot?.hourlyRate || 0,
    dailyRate: editingLot?.dailyRate || 0,
    monthlyRate: editingLot?.monthlyRate || 0,
    managerId: editingLot?.managerId || '',
    features: editingLot?.features || [],
    operatingHours: editingLot?.operatingHours || {
      monday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      tuesday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      wednesday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      thursday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      friday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      saturday: { isOpen: true, openTime: '07:00', closeTime: '23:00' },
      sunday: { isOpen: true, openTime: '08:00', closeTime: '21:00' }
    }
  });
  const [errors, setErrors] = useState<string[]>([]);

  const features: { value: ParkingFeature; label: string }[] = [
    { value: 'covered', label: 'Covered Parking' },
    { value: 'electric_charging', label: 'Electric Vehicle Charging' },
    { value: 'security_cameras', label: 'Security Cameras' },
    { value: 'valet_service', label: 'Valet Service' },
    { value: 'disabled_access', label: 'Disabled Access' },
    { value: 'oversized_vehicles', label: 'Oversized Vehicles' }
  ];

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors: string[] = [];

    if (!formData.name.trim()) {
      validationErrors.push('Parking lot name is required');
    }
    if (!formData.address.trim()) {
      validationErrors.push('Address is required');
    }
    if (!formData.city.trim()) {
      validationErrors.push('City is required');
    }
    if (!formData.state.trim()) {
      validationErrors.push('State is required');
    }
    if (!formData.zipCode.trim()) {
      validationErrors.push('ZIP code is required');
    }
    if (formData.totalSpots <= 0) {
      validationErrors.push('Total spots must be greater than 0');
    }
    if (formData.hourlyRate <= 0) {
      validationErrors.push('Hourly rate must be greater than 0');
    }
    if (!formData.managerId) {
      validationErrors.push('Manager is required');
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit(formData);
  };

  const handleChange = (field: keyof CreateLotRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleFeatureToggle = (feature: ParkingFeature) => {
    const newFeatures = formData.features.includes(feature)
      ? formData.features.filter(f => f !== feature)
      : [...formData.features, feature];
    handleChange('features', newFeatures);
  };

  const handleOperatingHoursChange = (day: typeof days[number], field: 'isOpen' | 'openTime' | 'closeTime', value: any) => {
    const newOperatingHours = {
      ...formData.operatingHours,
      [day]: {
        ...formData.operatingHours[day],
        [field]: value
      }
    };
    handleChange('operatingHours', newOperatingHours);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <MapPin className="h-5 w-5 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {isEditing ? 'Edit Parking Lot' : 'Add New Parking Lot'}
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

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
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

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parking Lot Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Downtown Plaza"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manager *
                </label>
                <select
                  value={formData.managerId}
                  onChange={(e) => handleChange('managerId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  title="Select manager"
                >
                  <option value="">Select a manager</option>
                  {managers.map((manager) => (
                    <option key={manager.id} value={manager.id}>
                      {manager.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows={3}
                placeholder="Brief description of the parking lot"
              />
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Location Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="123 Main Street"
                title="Enter parking lot address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="New York"
                  title="Enter city name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="NY"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => handleChange('zipCode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="10001"
                  title="Enter ZIP code"
                />
              </div>
            </div>
          </div>

          {/* Pricing Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Pricing Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Spots *
                </label>
                <input
                  type="number"
                  title="Enter total spots"
                  value={formData.totalSpots}
                  onChange={(e) => handleChange('totalSpots', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min="1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hourly Rate ($) *
                </label>
                <input
                  type="number"
                  title="Enter hourly rate"
                  step="0.01"
                  value={formData.hourlyRate}
                  onChange={(e) => handleChange('hourlyRate', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Daily Rate ($)
                </label>
                <input
                  type="number"
                  title="Enter daily rate"
                  step="0.01"
                  value={formData.dailyRate}
                  onChange={(e) => handleChange('dailyRate', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Features</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {features.map((feature) => (
                <label key={feature.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.features.includes(feature.value)}
                    onChange={() => handleFeatureToggle(feature.value)}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">{feature.label}</span>
                </label>
              ))}
            </div>
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
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {isEditing ? 'Update Lot' : 'Create Lot'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LotForm;
