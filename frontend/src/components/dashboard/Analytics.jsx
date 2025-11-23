import React from 'react';
import { QrCode, TrendingUp, BarChart3, Users, Settings, Calendar, MousePointer } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';



const Analytics = ({ qrCodes = [] }) => {
  const safeList = Array.isArray(qrCodes) ? qrCodes : [];
  const totalScans = safeList.reduce((sum, qr) => sum + (qr.scans || 0), 0);
  const totalQRs = safeList.length;
  const avgScans = totalQRs > 0 ? Math.round(totalScans / totalQRs) : 0;
  const activeQRs = safeList.filter(qr => qr.status === 'active' || !qr.status).length;

  const topPerformers = [...safeList]
    .sort((a, b) => b.scans - a.scans)
    .slice(0, 5);

  const typeDistribution = safeList.reduce((acc, qr) => {
    acc[qr.type] = (acc[qr.type] || 0) + 1;
    return acc;
  }, {});

  const recentActivity = [...safeList]
    .filter(qr => qr.lastScan)
    .sort((a, b) => new Date(b.lastScan) - new Date(a.lastScan))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total QR Codes</p>
              <p className="text-3xl font-bold text-gray-900">{totalQRs}</p>
              <p className="text-xs text-green-600 mt-1">
                +{Math.floor(Math.random() * 5)} this month
              </p>
            </div>
            <QrCode className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Scans</p>
              <p className="text-3xl font-bold text-gray-900">{totalScans.toLocaleString()}</p>
              <p className="text-xs text-green-600 mt-1">
                +{Math.floor(Math.random() * 50)} today
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Scans/QR</p>
              <p className="text-3xl font-bold text-gray-900">{avgScans}</p>
              <p className="text-xs text-blue-600 mt-1">
                {avgScans > 50 ? 'Excellent' : avgScans > 20 ? 'Good' : 'Growing'}
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active QRs</p>
              <p className="text-3xl font-bold text-gray-900">{activeQRs}</p>
              <p className="text-xs text-orange-600 mt-1">
                {Math.round((activeQRs / totalQRs) * 100)}% of total
              </p>
            </div>
            <Users className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers Chart */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Top Performing QR Codes</span>
          </h3>
          {topPerformers.length > 0 ? (
            <div className="space-y-3">
              {topPerformers.map((qr, index) => (
                <div key={qr.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className={`flex items-center justify-center w-6 h-6 text-white text-xs rounded-full ${
                      index === 0 ? 'bg-yellow-500' : 
                      index === 1 ? 'bg-gray-400' : 
                      index === 2 ? 'bg-orange-500' : 'bg-blue-600'
                    }`}>
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium">{qr.name}</p>
                      <p className="text-sm text-gray-600">{qr.type.toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{qr.scans} scans</p>
                    <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${(qr.scans / Math.max(...topPerformers.map(q => q.scans))) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No scan data available yet</p>
            </div>
          )}
        </div>

        {/* QR Type Distribution */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>QR Code Types</span>
          </h3>
          <div className="space-y-3">
            {Object.entries(typeDistribution).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    type === 'url' ? 'bg-blue-500' :
                    type === 'text' ? 'bg-green-500' :
                    type === 'email' ? 'bg-purple-500' :
                    type === 'phone' ? 'bg-orange-500' :
                    'bg-gray-500'
                  }`}></div>
                  <span className="capitalize font-medium">{type}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold">{count}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    ({Math.round((count / totalQRs) * 100)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>Recent Activity</span>
        </h3>
        {recentActivity.length > 0 ? (
          <div className="space-y-3">
            {recentActivity.map((qr) => (
              <div key={qr.id} className="flex items-center justify-between p-3 border-l-4 border-blue-600 bg-blue-50 rounded-r-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <MousePointer className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{qr.name}</p>
                    <p className="text-sm text-gray-600">
                      Last scanned: {qr.lastScan}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-blue-600">{qr.scans} total scans</p>
                  <p className="text-xs text-gray-500">{qr.type.toUpperCase()}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No recent scan activity</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default Analytics;