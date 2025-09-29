import React, { useState } from "react";
import { X, User, Briefcase } from "lucide-react";
import { CreateUserRequest } from "../../../types";
//import { CreateManagerRequest } from "../../../services/adminService";
import {
  adminService,
  CreateManagerRequest,
} from "../../../services/adminService";
interface ManagerFormProps {
  onClose: () => void;
  onSubmit: (managerData: { userData: CreateUserRequest }) => void;
  editingManager?: any;
  isEditing?: boolean;
}

const ManagerForm: React.FC<ManagerFormProps> = ({
  onClose,
  editingManager,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState<CreateManagerRequest>({
    email: editingManager?.user?.email || "",
    username: editingManager?.user?.username || "",
    password: "",
    // or UserRole.Manager if you have an enum
    phone: editingManager?.user?.phone || "",
  });

  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors: string[] = [];

    if (!formData.email.trim()) {
      validationErrors.push("Email is required");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      validationErrors.push("Please enter a valid email address");
    }

    if (!formData.username.trim()) {
      validationErrors.push("Name is required");
    }

    if (!isEditing && !formData.password.trim()) {
      validationErrors.push("Password is required");
    } else if (formData.password && formData.password.length < 6) {
      validationErrors.push("Password must be at least 6 characters long");
    }

    if (!formData.phone?.trim()) {
      validationErrors.push("Phone number is required");
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      await adminService.createManager({
        email: formData.email,
        username: formData.username,
        phone: formData.phone,
        password: formData.password,
      });
    } catch (error) {
      console.error("Error creating manager:", error);
      setErrors(["Failed to create manager. Please try again."]);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    if (errors.length > 0) {
      setErrors([]);
    }
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
              {isEditing ? "Edit Manager" : "Add New Manager"}
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
            <h3 className="text-lg font-medium text-gray-900">
              Personal Information
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="user name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="username@gmail.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+25070000000"
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
                  onChange={(e) => handleChange("password", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter password"
                  minLength={6}
                />
              </div>
            )}
          </div>
          {/* Job Details */}

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
              {isEditing ? "Update Manager" : "Create Manager"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManagerForm;
