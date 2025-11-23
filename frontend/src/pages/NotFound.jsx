import React from 'react';
import { QrCode } from 'lucide-react';


const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="mb-8">
        <QrCode className="h-24 w-24 text-gray-400 mx-auto mb-4" />
      </div>
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Oops! Page not found</p>
      <p className="text-gray-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <button 
        onClick={() => window.location.href = '/'}
        className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Go Back Home
      </button>
    </div>
  </div>
);
export default NotFound;