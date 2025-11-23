import mongoose from 'mongoose';

const QRCodeSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  url: {
    type: String,
    required: true,
    trim: true,
  },
  shortCode: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  qrImageUrl: String,
  customization: {
    foregroundColor: {
      type: String,
      default: '#000000',
    },
    backgroundColor: {
      type: String,
      default: '#ffffff',
    },
    logo: String,
    size: {
      type: Number,
      default: 200,
    },
    errorCorrectionLevel: {
      type: String,
      enum: ['L', 'M', 'Q', 'H'],
      default: 'M',
    },
  },
  scanCount: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Ensure shortCode exists before validation
QRCodeSchema.pre('validate', async function(next) {
  if (!this.shortCode) {
    let shortCode;
    let exists = true;
    
    while (exists) {
      shortCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      exists = await this.constructor.findOne({ shortCode });
    }
    
    this.shortCode = shortCode;
  }
  next();
});

export default mongoose.model('QRCode', QRCodeSchema);