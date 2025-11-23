import React from 'react';
import { Trash2, Download } from 'lucide-react';

const getImageSourceFromQr = (qr) => {
  return qr?.qrImage || qr?.qrImageUrl || qr?.image || qr?.imageUrl || '';
};

const formatDate = (isoString) => {
  try {
    return isoString ? new Date(isoString).toLocaleString() : '';
  } catch {
    return '';
  }
};

const QRCodeDisplay = ({ qr, onDelete = null, showActions = false }) => {
  const imageSrc = getImageSourceFromQr(qr);

  const handleDownload = () => {
    if (!imageSrc) return;
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = `${qr?.name || qr?.title || 'qr-code'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="border rounded-lg shadow-sm bg-white p-4 flex flex-col">
      <div className="aspect-square w-full bg-gray-50 border rounded flex items-center justify-center overflow-hidden">
        {imageSrc ? (
          <img src={imageSrc} alt={qr?.name || qr?.title || 'QR Code'} className="object-contain w-full h-full" />
        ) : (
          <div className="text-gray-400 text-sm">No preview</div>
        )}
      </div>
      <div className="mt-3">
        <p className="font-semibold truncate" title={qr?.name || qr?.title}>{qr?.name || qr?.title || 'QR Code'}</p>
        {(qr?.created || qr?.createdAt) && (
          <p className="text-xs text-gray-500">{formatDate(qr.created || qr.createdAt)}</p>
        )}
      </div>
      {(showActions || onDelete) && (
        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownload}
            disabled={!imageSrc}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded bg-blue-600 text-white disabled:opacity-50"
          >
            <Download size={16} />
            Download
          </button>
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(qr.id)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded bg-red-600 text-white"
            >
              <Trash2 size={16} />
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default QRCodeDisplay;


