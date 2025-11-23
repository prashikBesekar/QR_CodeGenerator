import Analytics from '../models/Analytics.js';
import QRCode from '../models/QRCode.js';
import User from '../models/User.js';
import geoip from 'geoip-lite';
import useragent from 'useragent';

// Track QR code scan
export const trackScan = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const clientIP = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const referrer = req.headers.referer;

    // Find the QR code
    const qrCode = await QRCode.findOne({ shortCode, isActive: true });
    
    if (!qrCode) {
      return res.status(404).json({
        success: false,
        message: 'QR Code not found'
      });
    }

    // Parse user agent for device info
    const agent = useragent.parse(userAgent);
    const deviceInfo = {
      type: agent.device.toString(),
      browser: agent.toAgent(),
      os: agent.os.toString()
    };

    // Get location from IP
    const location = geoip.lookup(clientIP) || {};

    // Create analytics record
    const analyticsData = {
      qrCodeId: qrCode._id,
      userId: qrCode.userId,
      ipAddress: clientIP,
      userAgent,
      referrer,
      device: deviceInfo,
      location: {
        country: location.country,
        city: location.city,
        region: location.region,
        latitude: location.ll ? location.ll[0] : null,
        longitude: location.ll ? location.ll[1] : null
      }
    };

    await Analytics.create(analyticsData);

    // Increment scan count
    await QRCode.findByIdAndUpdate(qrCode._id, {
      $inc: { scanCount: 1 }
    });

    // Redirect to the original URL
    res.redirect(qrCode.url);
  } catch (error) {
    console.error('Analytics tracking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track scan'
    });
  }
};

// Get dashboard analytics
export const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const { period = '30' } = req.query; // days

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Get total QR codes
    const totalQRs = await QRCode.countDocuments({ 
      userId, 
      isActive: true 
    });

    // Get total scans
    const totalScans = await Analytics.countDocuments({
      userId,
      scannedAt: { $gte: startDate }
    });

    // Get scans by day
    const scansByDay = await Analytics.aggregate([
      {
        $match: {
          userId: req.user._id,
          scannedAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$scannedAt'
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    // Get top performing QR codes
    const topQRs = await QRCode.find({ 
      userId, 
      isActive: true 
    })
    .sort({ scanCount: -1 })
    .limit(5)
    .select('title url scanCount createdAt');

    // Get scans by country
    const scansByCountry = await Analytics.aggregate([
      {
        $match: {
          userId: req.user._id,
          scannedAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$location.country',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    // Get scans by device type
    const scansByDevice = await Analytics.aggregate([
      {
        $match: {
          userId: req.user._id,
          scannedAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$device.type',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      analytics: {
        totalQRs,
        totalScans,
        scansByDay,
        topQRs,
        scansByCountry,
        scansByDevice,
        period: parseInt(period)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get specific QR code analytics
export const getQRAnalytics = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { period = '30' } = req.query;

    // Verify QR code ownership
    const qrCode = await QRCode.findOne({ 
      _id: id, 
      userId,
      isActive: true 
    });

    if (!qrCode) {
      return res.status(404).json({
        success: false,
        message: 'QR Code not found'
      });
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Get total scans for this QR
    const totalScans = await Analytics.countDocuments({
      qrCodeId: id,
      scannedAt: { $gte: startDate }
    });

    // Get scans by day
    const scansByDay = await Analytics.aggregate([
      {
        $match: {
          qrCodeId: qrCode._id,
          scannedAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$scannedAt'
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    // Get recent scans with details
    const recentScans = await Analytics.find({
      qrCodeId: id,
      scannedAt: { $gte: startDate }
    })
    .sort({ scannedAt: -1 })
    .limit(100)
    .select('scannedAt location device referrer');

    res.status(200).json({
      success: true,
      qrCode: {
        id: qrCode._id,
        title: qrCode.title,
        url: qrCode.url,
        totalScans: qrCode.scanCount,
        createdAt: qrCode.createdAt
      },
      analytics: {
        totalScans,
        scansByDay,
        recentScans,
        period: parseInt(period)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
