import React from 'react';
import { Download, QrCode } from 'lucide-react';



const QRPreview = ({ qrData, generatedQR }) => {
  const downloadQR = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = qrData.size;
    canvas.height = qrData.size;
    
    // Simple QR code simulation (in real app, use QR library)
    ctx.fillStyle = qrData.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = qrData.color;
    
    // Draw a simple pattern
    const cellSize = canvas.width / 25;
    for (let i = 0; i < 25; i++) {
      for (let j = 0; j < 25; j++) {
        if ((i + j) % 2 === 0) {
          ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
        }
      }
    }
    
    const link = document.createElement('a');
    link.download = `${qrData.name || 'qr-code'}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  if (!generatedQR) {
    return (
      <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
        <QrCode className="h-12 w-12 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500">Generate a QR code to see preview</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold mb-4">Preview</h3>
      <div className="text-center">
        <div 
          className="inline-block border rounded-lg p-4 mb-4"
          style={{ backgroundColor: qrData.backgroundColor }}
        >
          <div 
            className="mx-auto"
            style={{ 
              width: qrData.size, 
              height: qrData.size,
              backgroundColor: qrData.color,
              backgroundImage: `repeating-linear-gradient(
                45deg,
                ${qrData.color},
                ${qrData.color} 10px,
                ${qrData.backgroundColor} 10px,
                ${qrData.backgroundColor} 20px
              )`
            }}
          />
        </div>
        <div className="space-y-2">
          <p className="font-medium">{qrData.name || 'Untitled QR Code'}</p>
          <p className="text-sm text-gray-600">{qrData.type.toUpperCase()}</p>
          <p className="text-xs text-gray-500 break-all">{qrData.content}</p>
        </div>
        <button
          onClick={downloadQR}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2 mx-auto"
        >
          <Download className="h-4 w-4" />
          <span>Download</span>
        </button>
      </div>
    </div>
  );
};

export default QRPreview;