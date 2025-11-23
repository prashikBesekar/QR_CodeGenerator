import React from 'react';
import { useAuth } from '../context/AuthContext';
import QRGenerator from '../components/qr/QRGenerator';
import Dashboard from './Dashboard';
import { Square, Settings, User } from 'lucide-react';



const Home = ({ onGetStarted }) => {
  const { user } = useAuth();
  
  if (user) {
    return <Dashboard />;
  }
  
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center py-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Generate QR Codes in Seconds
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Create custom QR codes for your business, events, or personal use. 
          Track analytics, customize designs, and manage all your codes in one place.
        </p>
        <button
          onClick={onGetStarted}
          className="bg-blue-600 text-white px-8 py-4 text-lg rounded-lg hover:bg-blue-700 transition-colors"
        >
          Get Started Free
        </button>
      </div>
      
      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="text-center p-6">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Square className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Easy Generation</h3>
          <p className="text-gray-600">Create QR codes instantly with our intuitive interface</p>
        </div>
        
        <div className="text-center p-6">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Full Customization</h3>
          <p className="text-gray-600">Customize colors, sizes, and designs to match your brand</p>
        </div>
        
        <div className="text-center p-6">
          <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Analytics</h3>
          <p className="text-gray-600">Track scans and analyze performance with detailed insights</p>
        </div>
      </div>
      
      {/* Demo QR Generator */}
      <div className="bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-8">Try it now - no signup required!</h2>
        <QRGenerator />
      </div>
    </div>
  );
};
export default Home;
