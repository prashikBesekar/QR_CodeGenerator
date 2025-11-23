import React from 'react';
import { Settings } from 'lucide-react';



const QRCustomizer = ({ qrData = { errorCorrection: 'M', color: '#000000', backgroundColor: '#ffffff', size: 200 }, onUpdate = () => {} }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
        <Settings className="h-5 w-5" />
        <span>Customization</span>
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Error Correction Level</label>
          <select
            value={qrData.errorCorrection}
            onChange={(e) => onUpdate({ ...qrData, errorCorrection: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="L">Low (7%)</option>
            <option value="M">Medium (15%)</option>
            <option value="Q">Quartile (25%)</option>
            <option value="H">High (30%)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Style Presets</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onUpdate({ ...qrData, color: '#000000', backgroundColor: '#ffffff' })}
              className="p-3 border rounded-lg hover:bg-gray-50 text-center"
            >
              <div className="w-6 h-6 bg-black mx-auto mb-1 rounded"></div>
              <span className="text-xs">Classic</span>
            </button>
            <button
              onClick={() => onUpdate({ ...qrData, color: '#3b82f6', backgroundColor: '#eff6ff' })}
              className="p-3 border rounded-lg hover:bg-gray-50 text-center"
            >
              <div className="w-6 h-6 bg-blue-500 mx-auto mb-1 rounded"></div>
              <span className="text-xs">Blue</span>
            </button>
            <button
              onClick={() => onUpdate({ ...qrData, color: '#10b981', backgroundColor: '#ecfdf5' })}
              className="p-3 border rounded-lg hover:bg-gray-50 text-center"
            >
              <div className="w-6 h-6 bg-green-500 mx-auto mb-1 rounded"></div>
              <span className="text-xs">Green</span>
            </button>
            <button
              onClick={() => onUpdate({ ...qrData, color: '#f59e0b', backgroundColor: '#fffbeb' })}
              className="p-3 border rounded-lg hover:bg-gray-50 text-center"
            >
              <div className="w-6 h-6 bg-yellow-500 mx-auto mb-1 rounded"></div>
              <span className="text-xs">Yellow</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCustomizer;