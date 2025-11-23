import QRCode from '../models/QRCode.js';
import User from '../models/User.js';
import QR from 'qrcode';


export const createQR = async (req, res) => {
  try {
    const { title, url, customization } = req.body;
    const userId = req.user.id;

    // Check if user can create more QR codes (skip in development for easier testing)
    const user = await User.findById(userId);
    if (process.env.NODE_ENV !== 'development' && !user.canCreateQR()) {
      return res.status(403).json({
        success: false,
        message: 'QR code limit reached. Please upgrade your plan.'
      });
    }

    // Create QR code record
    const qrCode = await QRCode.create({
      user: userId,
      title,
      url,
      customization: customization || {}
    });

    // Generate QR code image
    const qrOptions = {
      width: qrCode.customization.size,
      color: {
        dark: qrCode.customization.foregroundColor,
        light: qrCode.customization.backgroundColor
      },
      errorCorrectionLevel: qrCode.customization.errorCorrectionLevel
    };

    // Generate redirect URL (your domain + short code)
    const redirectUrl = `${process.env.FRONTEND_URL}/qr/${qrCode.shortCode}`;
    const qrImageBuffer = await QR.toBuffer(redirectUrl, qrOptions);
    
    // Convert to base64 for now (later upload to Cloudinary)
    const qrImageBase64 = `data:image/png;base64,${qrImageBuffer.toString('base64')}`;
    
    qrCode.qrImageUrl = qrImageBase64;
    await qrCode.save();

    // Update user's QR usage
    user.qrUsed += 1;
    await user.save();

    res.status(201).json({
      success: true,
      qrCode: {
        id: qrCode._id,
        title: qrCode.title,
        url: qrCode.url,
        shortCode: qrCode.shortCode,
        qrImageUrl: qrCode.qrImageUrl,
        scanCount: qrCode.scanCount,
        createdAt: qrCode.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get User's QR Codes
export const getQRCodes = async (req, res) => {
  try {
    const qrCodes = await QRCode.find({ 
      user: req.user.id,
      isActive: true 
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: qrCodes.length,
      qrCodes: qrCodes.map(qr => ({
        id: qr._id,
        title: qr.title,
        url: qr.url,
        shortCode: qr.shortCode,
        qrImageUrl: qr.qrImageUrl,
        scanCount: qr.scanCount,
        createdAt: qr.createdAt
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete QR Code
export const deleteQR = async (req, res) => {
  try {
    const qrCode = await QRCode.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!qrCode) {
      return res.status(404).json({
        success: false,
        message: 'QR Code not found'
      });
    }

    qrCode.isActive = false;
    await qrCode.save();

    // Decrease user's QR usage
    const user = await User.findById(req.user.id);
    user.qrUsed = Math.max(0, user.qrUsed - 1);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'QR Code deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateQR = async (req, res) => {
  try {
    const { title, url, customization } = req.body;
    const qrCode = await QRCode.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!qrCode) {
      return res.status(404).json({
        success: false,
        message: 'QR Code not found'
      });
    }

    // Update fields
    qrCode.title = title || qrCode.title;
    qrCode.url = url || qrCode.url;
    qrCode.customization = {
      ...qrCode.customization,
      ...customization
    };

    // Regenerate QR code image
    const qrOptions = {
      width: qrCode.customization.size,
      color: {
        dark: qrCode.customization.foregroundColor,
        light: qrCode.customization.backgroundColor
      },
      errorCorrectionLevel: qrCode.customization.errorCorrectionLevel
    };

    const redirectUrl = `${process.env.FRONTEND_URL}/qr/${qrCode.shortCode}`;
    const qrImageBuffer = await QR.toBuffer(redirectUrl, qrOptions);
    
    qrCode.qrImageUrl = `data:image/png;base64,${qrImageBuffer.toString('base64')}`;
    
    await qrCode.save();

    res.status(200).json({
      success: true,
      message: 'QR Code updated successfully',
      qrCode: {
        id: qrCode._id,
        title: qrCode.title,
        url: qrCode.url,
        shortCode: qrCode.shortCode,
        qrImageUrl: qrCode.qrImageUrl,
        scanCount: qrCode.scanCount,
        createdAt: qrCode.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
