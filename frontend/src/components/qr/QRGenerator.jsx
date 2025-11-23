import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import QRCustomizer from './QRCustomizer';
import QRPreview from './QRPreview';
import QRCodeDisplay from './QRCodeDisplay';
import qrService from '../../services/qr';


const QRGenerator = () => {
  const [qrData, setQrData] = useState('');
  const [qrColor, setQrColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [size, setSize] = useState(200);
  const [errorCorrection, setErrorCorrection] = useState('M');
  const [generatedQRs, setGeneratedQRs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadQRList();
    }
  }, [user]);

  const loadQRList = async () => {
    try {
      const response = await qrService.getQRList();
      setGeneratedQRs(response.qrs || []);
    } catch (error) {
      console.error('Failed to load QR list:', error);
    }
  };

  const generateQR = async () => {
    if (!qrData.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const qrRequest = {
        title: qrData.slice(0, 40) || 'QR Code',
        url: qrData,
        customization: {
          size,
          foregroundColor: qrColor,
          backgroundColor: bgColor,
          errorCorrectionLevel: errorCorrection
        }
      };
      if (user) {
        await qrService.generateQR(qrRequest);
        await loadQRList();
      } else {
        const newQR = {
          id: Date.now(),
          name: qrRequest.title,
          qrImage: '',
          created: new Date().toISOString()
        };
        setGeneratedQRs([newQR, ...generatedQRs]);
      }
      
      setQrData('');
    } catch (error) {
      setError(error.message || 'Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  const deleteQR = async (qrId) => {
    try {
      await qrService.deleteQR(qrId);
      await loadQRList();
    } catch (error) {
      console.error('Failed to delete QR code:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Generate QR Code</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <textarea
                placeholder="Enter text, URL, or data..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                value={qrData}
                onChange={(e) => setQrData(e.target.value)}
              />
            </div>
            
            <QRCustomizer 
              qrData={{
                errorCorrection,
                color: qrColor,
                backgroundColor: bgColor,
                size
              }}
              onUpdate={(next) => {
                if (Object.prototype.hasOwnProperty.call(next, 'errorCorrection')) {
                  setErrorCorrection(next.errorCorrection);
                }
                if (Object.prototype.hasOwnProperty.call(next, 'color')) {
                  setQrColor(next.color);
                }
                if (Object.prototype.hasOwnProperty.call(next, 'backgroundColor')) {
                  setBgColor(next.backgroundColor);
                }
                if (Object.prototype.hasOwnProperty.call(next, 'size')) {
                  setSize(next.size);
                }
              }}
            />
            
            <button
              onClick={generateQR}
              disabled={!qrData.trim() || loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating...' : 'Generate QR Code'}
            </button>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
            <QRPreview 
              qrData={{
                size,
                backgroundColor: bgColor,
                color: qrColor,
                content: qrData,
                type: 'text',
                name: ''
              }}
              generatedQR={generatedQRs[0] || null}
            />
          </div>
        </div>
      </div>
      
      {generatedQRs.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-4">
            {user ? 'Your QR Codes' : 'Recent QR Codes'}
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {generatedQRs.slice(0, 6).map((qr) => (
              <QRCodeDisplay 
                key={qr.id} 
                qr={qr} 
                onDelete={user ? deleteQR : null}
                showActions={true}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QRGenerator;