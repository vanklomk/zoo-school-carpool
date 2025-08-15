import React from 'react';
import { Car, Users, MapPin, Clock } from 'lucide-react';

/**
 * CarpoolList Component
 * 
 * Displays carpools in a traditional list format with loading states.
 * Shows all available carpools with their details and join functionality.
 */
const CarpoolList = ({ carpools, loading, onJoinCarpool, formatDateTime }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Available Carpools</h2>
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading carpools...</p>
        </div>
      ) : carpools.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Car className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>No carpools available yet.</p>
          <p className="text-sm">Be the first to offer a ride!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {carpools.map((carpool) => (
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow" key={carpool.id}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="h-4 w-4 text-gray-600" />
                    <span className="font-semibold">{carpool.driver_name}</span>
                  </div>
                  <div className="flex items-center space-x-2 mb-1">
                    <MapPin className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-800">{carpool.destination}</span>
                  </div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Clock className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-800">{formatDateTime(carpool.departure_time)}</span>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Car className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-800">
                      {carpool.available_seats} {carpool.available_seats === 1 ? 'seat' : 'seats'} available
                    </span>
                  </div>
                  {carpool.notes && (
                    <p className="text-gray-600 text-sm mt-2">{carpool.notes}</p>
                  )}
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <button
                    onClick={() => onJoinCarpool(carpool.id, carpool.available_seats)}
                    disabled={carpool.available_seats === 0}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      carpool.available_seats > 0
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {carpool.available_seats > 0 ? 'Join Ride' : 'Full'}
                  </button>
                  <span className={`text-sm font-medium ${
                    carpool.available_seats > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {carpool.available_seats > 0 ? 'Available' : 'No seats left'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CarpoolList;
