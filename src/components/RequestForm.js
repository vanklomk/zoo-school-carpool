import React from 'react';

/**
 * RequestForm Component
 * 
 * Form component for creating new carpool requests with enhanced validation.
 * Shows validation errors inline and provides a clean user experience.
 */
const RequestForm = ({ formData, setFormData, formErrors, onSubmit, onCancel }) => {
  return (
    <form className="bg-gray-50 p-6 rounded-lg mb-6" onSubmit={onSubmit}>
      <h2 className="text-xl font-semibold mb-4">Create New Carpool</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Driver Name
          </label>
          <input
            type="text"
            required
            className={`w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              formErrors.driver_name ? 'border-red-300' : 'border-gray-300'
            }`}
            value={formData.driver_name}
            onChange={(e) => setFormData({...formData, driver_name: e.target.value})}
          />
          {formErrors.driver_name && (
            <p className="text-red-600 text-xs mt-1">{formErrors.driver_name}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Destination
          </label>
          <input
            type="text"
            required
            className={`w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              formErrors.destination ? 'border-red-300' : 'border-gray-300'
            }`}
            value={formData.destination}
            onChange={(e) => setFormData({...formData, destination: e.target.value})}
            placeholder="e.g., Zoo Atlanta"
          />
          {formErrors.destination && (
            <p className="text-red-600 text-xs mt-1">{formErrors.destination}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Departure Time
          </label>
          <input
            type="datetime-local"
            required
            className={`w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              formErrors.departure_time ? 'border-red-300' : 'border-gray-300'
            }`}
            value={formData.departure_time}
            onChange={(e) => setFormData({...formData, departure_time: e.target.value})}
          />
          {formErrors.departure_time && (
            <p className="text-red-600 text-xs mt-1">{formErrors.departure_time}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Available Seats
          </label>
          <select
            className={`w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              formErrors.available_seats ? 'border-red-300' : 'border-gray-300'
            }`}
            value={formData.available_seats}
            onChange={(e) => setFormData({...formData, available_seats: parseInt(e.target.value)})}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
          {formErrors.available_seats && (
            <p className="text-red-600 text-xs mt-1">{formErrors.available_seats}</p>
          )}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes (optional)
          </label>
          <textarea
            rows={3}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            placeholder="Any additional information..."
          />
        </div>
      </div>
      <div className="flex space-x-3 mt-6">
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Create Carpool
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default RequestForm;
