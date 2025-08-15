import React from 'react';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';

/**
 * ErrorDisplay Component
 * 
 * Displays error and success messages in a clean, dismissible UI.
 * Supports different message types with appropriate styling and icons.
 * 
 * @param {Object} error - Error object with type, message, and details
 * @param {Function} onDismiss - Function to call when dismissing the error
 */
const ErrorDisplay = ({ error, onDismiss }) => {
  // Don't render anything if there's no error
  if (!error) return null;

  // Determine styling based on error type
  const getErrorStyles = () => {
    switch (error.type) {
      case 'success':
        return {
          container: 'bg-green-50 border-green-200 text-green-800',
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          button: 'text-green-500 hover:text-green-700'
        };
      case 'fetch':
      case 'create':
      case 'join':
      default:
        return {
          container: 'bg-red-50 border-red-200 text-red-800',
          icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
          button: 'text-red-500 hover:text-red-700'
        };
    }
  };

  const styles = getErrorStyles();

  return (
    <div className={`border rounded-lg p-4 mb-4 ${styles.container}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          {styles.icon}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium mb-1">
            {error.type === 'success' ? 'Success!' : 'Error'}
          </h3>
          <p className="text-sm">
            {error.message}
          </p>
          {error.details && (
            <details className="mt-2">
              <summary className="text-xs cursor-pointer hover:underline">
                Technical details
              </summary>
              <p className="text-xs mt-1 font-mono bg-white bg-opacity-50 p-2 rounded border">
                {error.details}
              </p>
            </details>
          )}
        </div>
        <div className="flex-shrink-0 ml-3">
          <button
            onClick={onDismiss}
            className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${styles.button}`}
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;
