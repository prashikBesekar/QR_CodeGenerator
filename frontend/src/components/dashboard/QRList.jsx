import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';
import QRCodeDisplay from '../qr/QRCodeDisplay';
import qrService from '../../services/qr';
const QRList = () => {
  const [qrs, setQrs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQRs();
  }, []);

  const loadQRs = async () => {
    try {
      const response = await qrService.getQRList();
      // Backend returns { success, count, qrCodes: [...] }
      const list = response.qrCodes || response.qrs || [];
      setQrs(list);
    } catch (error) {
      console.error('Failed to load QR codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteQR = async (qrId) => {
    try {
      await qrService.deleteQR(qrId);
      await loadQRs();
    } catch (error) {
      console.error('Failed to delete QR code:', error);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">All QR Codes</h2>
      {qrs.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No QR codes found. Create your first one!
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {qrs.map((qr) => (
            <QRCodeDisplay key={qr.id || qr._id} qr={{
              id: qr.id || qr._id,
              name: qr.title,
              qrImage: qr.qrImageUrl,
              created: qr.createdAt
            }} onDelete={deleteQR} />
          ))}
        </div>
      )}
    </div>
  );
};

export default QRList;
