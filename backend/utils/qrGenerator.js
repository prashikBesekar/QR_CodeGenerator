const QR = require('qrcode');
const { uploadQRImage } = require('../config/cloudinary');

// Generate QR code with custom options
const generateQRCode = async (data, options = {}) => {
  const defaultOptions = {
    width: options.size || 200,
    margin: 2,
    color: {
      dark: options.foregroundColor || '#000000',
      light: options.backgroundColor || '#FFFFFF'
    },
    errorCorrectionLevel: options.errorCorrectionLevel || 'M'
  };

  try {
    // Generate QR code as buffer
    const qrBuffer = await QR.toBuffer(data, defaultOptions);
    return qrBuffer;
  } catch (error) {
    throw new Error(`QR code generation failed: ${error.message}`);
  }
};

// Generate and upload QR code to Cloudinary
const generateAndUploadQR = async (data, options = {}, uploadOptions = {}) => {
  try {
    // Generate QR code buffer
    const qrBuffer = await generateQRCode(data, options);
    
    // Upload to Cloudinary
    const uploadResult = await uploadQRImage(qrBuffer, {
      public_id: uploadOptions.filename || `qr_${Date.now()}`,
      ...uploadOptions
    });
    
    return uploadResult;
  } catch (error) {
    throw new Error(`QR code generation and upload failed: ${error.message}`);
  }
};

// Generate QR code as base64 string
const generateQRBase64 = async (data, options = {}) => {
  try {
    const qrBuffer = await generateQRCode(data, options);
    const base64 = qrBuffer.toString('base64');
    return `data:image/png;base64,${base64}`;
  } catch (error) {
    throw new Error(`QR code base64 generation failed: ${error.message}`);
  }
};

module.exports = {
  generateQRCode,
  generateAndUploadQR,
  generateQRBase64
};
