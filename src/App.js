import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Plus, Car, Users, MapPin, Calendar, Clock } from 'lucide-react';

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  const [carpools, setCarpools] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    driver_name: '',
    destination: '',
    departure_time: '',
    available_seats: 4,
    notes: ''
  });

  // Fetch carpools from Supabase
  useEffect(() => {
    fetchCarpools();
  }, []);

  const fetchCarpools = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('carpools')
        .select('*')
        .order('departure_time', { ascending: true });
      
      if (error) throw error;
      setCarpools(data || []);
    } catch (error) {
      console.error('Error fetching carpools:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('carpools')
        .insert([formData])
        .select();
      
      if (error) throw error;
      
      // Update local state
      setCarpools([...carpools, ...data]);
      
      // Reset form
      setFormData({
        driver_name: '',
        destination: '',
        departure_time: '',
        available_seats: 4,
        notes: ''
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error creating carpool:', error);
      alert('Error creating carpool. Please try again.');
    }
  };

  const handleJoinCarpool = async (carpoolId, currentSeats) => {
    if (currentSeats <= 0) {
      alert('No seats available!');
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('carpools')
        .update({ available_seats: currentSeats - 1 })
        .eq('id', carpoolId)
        .select();
      
      if (error) throw error;
      
      // Update local state
      setCarpools(carpools.map(carpool => 
        carpool.id === carpoolId 
          ? { ...carpool, available_seats: currentSeats - 1 }
          : carpool
      ));
      
      alert('Successfully joined carpool!');
    } catch (error) {
      console.error('Error joining carpool:', error);
      alert('Error joining carpool. Please try again.');
    }
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Car className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Zoo School Carpool</h1>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Offer Ride</span>
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg mb-6">
              <h2 className="text-xl font-semibold mb-4">Create New Carpool</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Driver Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.driver_name}
                    onChange={(e) => setFormData({...formData, driver_name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Destination
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.destination}
                    onChange={(e) => setFormData({...formData, destination: e.target.value})}
                    placeholder="e.g., Zoo Atlanta"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Departure Time
                  </label>
                  <input
                    type="datetime-local"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.departure_time}
                    onChange={(e) => setFormData({...formData, departure_time: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Available Seats
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.available_seats}
                    onChange={(e) => setFormData({...formData, available_seats: parseInt(e.target.value)})}
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
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
                  onClick={() => setShowForm(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

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
                  <div key={carpool.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
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
                          onClick={() => handleJoinCarpool(carpool.id, carpool.available_seats)}
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
        </div>
      </div>
    </div>
  );
}

export default App;
