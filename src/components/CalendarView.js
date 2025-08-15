import React from 'react';
import Calendar from 'react-calendar';
import { Car, Users, MapPin, Clock } from 'lucide-react';

/**
 * CalendarView Component
 * 
 * Displays carpools in a calendar format with interactive date selection.
 * Shows carpool details for selected dates and allows joining rides.
 * 
 * @param {Array} carpools - Array of carpool objects
 * @param {Date} selectedDate - Currently selected date
 * @param {Function} setSelectedDate - Function to update selected date
 * @param {Function} hasCarpool - Function to check if a date has carpools
 * @param {Function} getCarpoolsForDate - Function to get carpools for a specific date
 * @param {Function} onJoinCarpool - Function to handle joining a carpool
 * @param {Function} formatDateTime - Function to format date and time
 */
const CalendarView = ({
  carpools,
  selectedDate,
  setSelectedDate,
  hasCarpool,
  getCarpoolsForDate,
  onJoinCarpool,
  formatDateTime
}) => {
  /**
   * Get the CSS class for a calendar tile based on whether it has carpools
   * @param {Object} param - Object containing date and view info
   * @returns {string} - CSS class name
   */
  const getTileClassName = ({ date, view }) => {
    if (view === 'month') {
      if (hasCarpool(date)) {
        return 'bg-blue-100 text-blue-800 font-semibold hover:bg-blue-200';
      }
    }
    return null;
  };

  /**
   * Handle calendar date change
   * @param {Date} date - Selected date
   */
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Get carpools for the currently selected date
  const selectedDateCarpools = getCarpoolsForDate(selectedDate);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Calendar View</h2>
        <p className="text-gray-600 text-sm mb-4">
          Dates with available carpools are highlighted in blue. Click on a date to see details.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Component */}
        <div className="lg:col-span-2">
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              tileClassName={getTileClassName}
              className="react-calendar"
              minDate={new Date()}
              showNeighboringMonth={false}
            />
          </div>
        </div>

        {/* Selected Date Details */}
        <div className="lg:col-span-1">
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-medium mb-3">
              {selectedDate.toDateString()}
            </h3>
            
            {selectedDateCarpools.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Car className="h-8 w-8 mx-auto mb-3 text-gray-400" />
                <p>No carpools available for this date.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  {selectedDateCarpools.length} carpool{selectedDateCarpools.length > 1 ? 's' : ''} available
                </p>
                
                {selectedDateCarpools.map((carpool) => (
                  <div 
                    key={carpool.id} 
                    className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
                  >
                    <div className="space-y-2">
                      {/* Driver Info */}
                      <div className="flex items-center text-sm">
                        <Users className="h-4 w-4 text-gray-600 mr-2" />
                        <span className="font-medium">{carpool.driver_name}</span>
                      </div>
                      
                      {/* Destination */}
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 text-gray-600 mr-2" />
                        <span className="text-gray-800">{carpool.destination}</span>
                      </div>
                      
                      {/* Time */}
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 text-gray-600 mr-2" />
                        <span className="text-gray-800">{formatDateTime(carpool.departure_time)}</span>
                      </div>
                      
                      {/* Available Seats */}
                      <div className="flex items-center text-sm">
                        <Car className="h-4 w-4 text-gray-600 mr-2" />
                        <span className="text-gray-800">
                          {carpool.available_seats} {carpool.available_seats === 1 ? 'seat' : 'seats'} available
                        </span>
                      </div>
                      
                      {/* Notes */}
                      {carpool.notes && (
                        <p className="text-xs text-gray-600 mt-2 italic">
                          {carpool.notes}
                        </p>
                      )}
                      
                      {/* Join Button */}
                      <div className="pt-2">
                        <button
                          onClick={() => onJoinCarpool(carpool.id, carpool.available_seats)}
                          disabled={carpool.available_seats === 0}
                          className={`w-full px-3 py-2 text-sm rounded-lg transition-colors ${
                            carpool.available_seats > 0
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {carpool.available_seats > 0 ? 'Join Ride' : 'Full'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Calendar Legend */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Legend</h4>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-100 border border-blue-200 rounded mr-2"></div>
            <span className="text-gray-600">Days with available carpools</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-white border border-gray-200 rounded mr-2"></div>
            <span className="text-gray-600">Days without carpools</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
