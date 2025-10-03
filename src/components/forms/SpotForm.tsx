import React, { useState, useEffect } from "react";

interface SpotFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
  editingSpot?: any;
  isEditing?: boolean;
  lotId: string;
}

const SpotForm: React.FC<SpotFormProps> = ({
  onClose,
  onSubmit,
  editingSpot,
  isEditing,
  lotId,
}) => {
  const [spotNumber, setSpotNumber] = useState("");
  const [type, setType] = useState("regular");
  const [rfidReaderId, setRfidReaderId] = useState("");
  const [isMaintenance, setIsMaintenance] = useState(false);

  useEffect(() => {
    if (editingSpot) {
      setSpotNumber(editingSpot.spotNumber || "");
      setType(editingSpot.type || "regular");
      setRfidReaderId(editingSpot.rfidReaderId || "");
      setIsMaintenance(!!editingSpot.isMaintenance);
    }
  }, [editingSpot]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      spotNumber,
      type,
      rfidReaderId,
      isMaintenance,
      lotId,
      id: editingSpot?.id,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">
          {isEditing ? "Edit Spot" : "Add Spot"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Spot Number
            </label>
            <input
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              value={spotNumber}
              onChange={(e) => setSpotNumber(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Type
            </label>
            <select
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="regular">Regular</option>
              <option value="handicap">Handicap</option>
              <option value="ev">EV</option>
              <option value="vip">VIP</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              RFID Reader ID
            </label>
            <input
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              value={rfidReaderId}
              onChange={(e) => setRfidReaderId(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center">
            <input
              id="maintenance"
              type="checkbox"
              checked={isMaintenance}
              onChange={(e) => setIsMaintenance(e.target.checked)}
              className="h-4 w-4 text-green-600 border-gray-300 rounded"
            />
            <label
              htmlFor="maintenance"
              className="ml-2 block text-sm text-gray-700"
            >
              Maintenance Mode
            </label>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
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
