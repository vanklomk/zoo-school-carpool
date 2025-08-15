import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Plus, Car, Users, MapPin, Calendar as CalendarIcon, Clock, AlertTriangle, CheckCircle, CalendarDays } from 'lucide-react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import ErrorDisplay from './components/ErrorDisplay';
import CalendarView from './components/CalendarView';
import RequestForm from './components/RequestForm';
import CarpoolList from './components/CarpoolList';

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Main App component for the Zoo School Carpool application.
 * Features:
 * 1. Calendar view for visualizing carpools by date
 * 2. Enhanced error handling with proper UI display
 * 3. Improved form validation
 * 4. Carpool request system for offering and requesting rides
 * 5. Comprehensive commenting for maintainability
 */
function App() {
  // State management for carpool data and UI
  const [carpools, setCarpools] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('list'); // 'list' or 'calendar'
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Form data for creating new carpools
  const [formData, setFormData] = useState({
    driver_name: '',
    destination: '',
    departure_time: '',
    available_seats: 4,
    notes: ''
  });

  // Form validation errors
  const [formErrors, setFormErrors] = useState({});

  /**
   * Fetch all carpools from Supabase on component mount
   */
  useEffect(() => {
    fetchCarpools();
  }, []);

  /**
   * Fetch carpools from Supabase with comprehensive error handling
   */
  const fetchCarpools = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('carpools')
        .select('*')
        .order('departure_time', { ascending: true });
      
      if (error) throw error;
      setCarpools(data || []);
    } catch (error) {
      console.error('Error fetching carpools:', error);
      setError({
        type: 'fetch',
        message: 'Failed to load carpools. Please refresh the page.',
        details: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Validate form data before submission
   * @param {Object} data - Form data to validate
   * @returns {Object} - Validation errors object
   */
  const validateForm = (data) => {
    const errors = {};
    
    // Driver name validation
    if (!data.driver_name.trim()) {
      errors.driver_name = 'Driver name is required';
    } else if (data.driver_name.trim().length < 2) {
      errors.driver_name = 'Driver name must be at least 2 characters';
    }
    
    // Destination validation
    if (!data.destination.trim()) {
      errors.destination = 'Destination is required';
    } else if (data.destination.trim().length < 3) {
      errors.destination = 'Destination must be at least 3 characters';
    }
    
    // Departure time validation
    if (!data.departure_time) {
      errors.departure_time = 'Departure time is required';
    } else {
      const departureDate = new Date(data.departure_time);
      const now = new Date();
      if (departureDate <= now) {
        errors.departure_time = 'Departure time must be in the future';
      }
    }
    
    // Available seats validation
    if (data.available_seats < 1 || data.available_seats > 8) {
      errors.available_seats = 'Available seats must be between 1 and 8';
    }
    
    return errors;
  };

  /**
   * Handle form submission with enhanced validation and error handling
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Clear previous errors
      setFormErrors({});
      setError(null);
      
      // Validate form data
      const errors = validateForm(formData);
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }
      
      // Prepare data for submission
      const submissionData = {
        ...formData,
        driver_name: formData.driver_name.trim(),
        destination: formData.destination.trim(),
        notes: formData.notes.trim()
      };
      
      const { data, error } = await supabase
        .from('carpools')
        .insert([submissionData])
        .select();
      
      if (error) throw error;
      
      // Update local state with new carpool
      setCarpools([...carpools, ...data]);
      
      // Reset form and close
      setFormData({
        driver_name: '',
        destination: '',
        departure_time: '',
        available_seats: 4,
        notes: ''
      });
      setShowForm(false);
      
      // Show success message
      setError({
        type: 'success',
        message: 'Carpool created successfully!',
        details: null
      });
      
    } catch (error) {
      console.error('Error creating carpool:', error);
      setError({
        type: 'create',
        message: 'Failed to create carpool. Please try again.',
        details: error.message
      });
    }
  };

  /**
   * Handle joining a carpool with enhanced error handling
   * @param {number} carpoolId - ID of the carpool to join
   * @param {number} currentSeats - Current available seats
   */
  const handleJoinCarpool = async (carpoolId, currentSeats) => {
    if (currentSeats <= 0) {
      setError({
        type: 'join',
        message: 'No seats available for this carpool.',
        details: null
      });
      return;
    }
    
    try {
      setError(null);
      
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
      
      setError({
        type: 'success',
        message: 'Successfully joined carpool!',
        details: null
      });
      
    } catch (error) {
      console.error('Error joining carpool:', error);
      setError({
        type: 'join',
        message: 'Failed to join carpool. Please try again.',
        details: error.message
      });
    }
  };

  /**
   * Format date and time for display
   * @param {string} dateTimeString - ISO datetime string
   * @returns {string} - Formatted date and time
   */
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  /**
   * Get carpools for a specific date for calendar view
   * @param {Date} date - Date to filter by
   * @returns {Array} - Carpools for the specified date
   */
  const getCarpoolsForDate = (date) => {
    return carpools.filter(carpool => {
      const carpoolDate = new Date(carpool.departure_time);
      return carpoolDate.toDateString() === date.toDateString();
    });
  };

  /**
   * Check if a date has any carpools (for calendar tile styling)
   * @param {Date} date - Date to check
   * @returns {boolean} - True if date has carpools
   */
  const hasCarpool = (date) => {
    return getCarpoolsForDate(date).length > 0;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          {/* Header with navigation */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Car className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Zoo School Carpool</h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* View toggle buttons */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setView('list')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    view === 'list' 
                      ? 'bg-white shadow-sm text-blue-600' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Users className="h-4 w-4 mr-2 inline" />
                  List View
                </button>
                <button
                  onClick={() => setView('calendar')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    view === 'calendar' 
                      ? 'bg-white shadow-sm text-blue-600' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <CalendarDays className="h-4 w-4 mr-2 inline" />
                  Calendar
                </button>
              </div>
              
              {/* Offer ride button */}
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Offer Ride</span>
              </button>
            </div>
          </div>

          {/* Error Display Component */}
          <ErrorDisplay error={error} onDismiss={() => setError(null)} />

          {/* Form for creating new carpool */}
          {showForm && (
            <RequestForm
              formData={formData}
              setFormData={setFormData}
              formErrors={formErrors}
              onSubmit={handleSubmit}
              onCancel={() => setShowForm(false)}
            />
          )}

          {/* Main content area - either list view or calendar view */}
          {view === 'calendar' ? (
            <CalendarView
              carpools={carpools}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              hasCarpool={hasCarpool}
              getCarpoolsForDate={getCarpoolsForDate}
              onJoinCarpool={handleJoinCarpool}
              formatDateTime={formatDateTime}
            />
          ) : (
            <CarpoolList
              carpools={carpools}
              loading={loading}
              onJoinCarpool={handleJoinCarpool}
              formatDateTime={formatDateTime}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
