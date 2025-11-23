import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import isEmail from 'validator/lib/isEmail.js';

validator.isLowercase('abc'); // true

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true, // Store email in lowercase
        validate: [isEmail, 'Invalid email'], // Validate email format
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        select: false, // Do not return password in queries
    },
    plan :{
        type: String,
        enum: ['free', 'premium'],
        default: 'free',
    },
    planExpiry : Date,
    stripCustomerId: String,
    subscriptionId: String,
    qrLimit :{
      type:Number,
      default:5
    },
    qrUsed :{
      type:Number,
      default:0
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    resetPasswordToken: String,
}, {
    timestamps: true,
});

//hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if user can create more QR codes
userSchema.methods.canCreateQR = function() {
  if (this.plan === 'free') {
    return this.qrUsed < this.qrLimit;
  }
  return true; // Pro and Enterprise have unlimited
};

export default mongoose.model('User', userSchema);

