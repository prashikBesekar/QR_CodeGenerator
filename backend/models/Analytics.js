import mongoose from 'mongoose';

const analyticsSchema = mongoose.Schema({
  qrCodeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QRCode',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  scannedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  ipAddress: String,
  userAgent: String,
  location: {
    country: String,
    city: String,
    region: String,
    latitude: Number,
    longitude: Number
  },
  device: {
    type: String,
    browser: String,
    os: String
  },
  referrer: String
});

// Index for efficient queries
analyticsSchema.index({ qrCodeId: 1, scannedAt: -1 });
analyticsSchema.index({ userId: 1, scannedAt: -1 });

export default mongoose.model('Analytics', analyticsSchema);
