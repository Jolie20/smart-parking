import React, { useState } from 'react';
import { X, User, Briefcase, Shield } from 'lucide-react';
import { CreateUserRequest, UserRole, ManagerPermission } from '../../../types';

interface ManagerFormProps {
  onClose: () => void;
  onSubmit: (managerData: { userData: CreateUserRequest; permissions: ManagerPermission[] }) => void;
  editingManager?: any;
  isEditing?: boolean;
}

const ManagerForm: React.FC<ManagerFormProps> = ({ onClose, onSubmit, editingManager, isEditing = false }) => {
  const [formData, setFormData] = useState<CreateUserRequest>({
    email: editingManager?.user?.email || '',
    name: editingManager?.user?.name || '',
    password: '',
    role: 'manager' as UserRole,
    phone: editingManager?.user?.phone || ''
  });
  
  const [permissions, setPermissions] = useState<ManagerPermission[]>(
    editingManager?.permissions || ['view_sessions', 'manage_lots']
  );
  
  const [employeeId, setEmployeeId] = useState(editingManager?.employeeId || '');
  const [department, setDepartment] = useState(editingManager?.department || '');
  const [errors, setErrors] = useState<string[]>([]);

  const availablePermissions: { value: ManagerPermission; label: string }[] = [
    { value: 'view_sessions', label: 'View Sessions' },
    { value: 'manage_lots', label: 'Manage Lots' },
    { value: 'view_analytics', label: 'View Analytics' },
    { value: 'manage_spots', label: 'Manage Spots' },
    { value: 'view_reports', label: 'View Reports' },
    { value: 'manage_users', label: 'Manage Users' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors: string[] = [];

    if (!formData.email.trim()) {
      validationErrors.push('Email is required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      validationErrors.push('Please enter a valid email address');
    }
    
    if (!formData.name.trim()) {
      validationErrors.push('Name is required');
    }
    
    if (!isEditing && !formData.password.trim()) {
      validationErrors.push('Password is required');
    } else if (formData.password && formData.password.length < 6) {
      validationErrors.push('Password must be at least 6 characters long');
    }
    
    if (!formData.phone.trim()) {
      validationErrors.push('Phone number is required');
    }
    
    if (!employeeId.trim()) {
      validationErrors.push('Employee ID is required');
    }
    
    if (permissions.length === 0) {
      validationErrors.push('At least one permission must be selected');
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit({ userData: formData, permissions });
  };

  const handleChange = (field: keyof CreateUserRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handlePermissionToggle = (permission: ManagerPermission) => {
    setPermissions(prev => 
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {isEditing ? 'Edit Manager' : 'Add New Manager'}
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

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+1234567890"
              />
            </div>

            {!isEditing && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter password"
                  minLength={6}
                />
              </div>
            )}
          </div>

          {/* Employee Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Employee Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employee ID *
              </label>
              <input
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="EMP001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Operations"
              />
            </div>
          </div>

          {/* Permissions */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Permissions *</h3>
            <div className="grid grid-cols-1 gap-3">
              {availablePermissions.map((permission) => (
                <label key={permission.value} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={permissions.includes(permission.value)}
                    onChange={() => handlePermissionToggle(permission.value)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Shield className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{permission.label}</span>
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
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isEditing ? 'Update Manager' : 'Create Manager'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManagerForm;
