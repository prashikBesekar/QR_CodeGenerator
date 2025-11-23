import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import crypto from 'crypto';


//Generate a jwt token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
}

//Register a new user
export const register = async (req, res) => {
      try {
    const { name, email, password } = req.body;
    const normalizedEmail = (email || '').toLowerCase().trim();

    // Check if user exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email: normalizedEmail,
      password
    });

    // Generate token
    const token = signToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        qrLimit: user.qrLimit,
        qrUsed: user.qrUsed
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Login User
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check if user exists and password is correct
    const normalizedEmail = (email || '').toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    // Dev logging (remove in production)
    console.log('[Auth] Login attempt:', normalizedEmail, 'found:', !!user);

    let isPasswordMatch = false;
    if (user) {
      try {
        isPasswordMatch = await user.comparePassword(password);
      } catch (e) {
        isPasswordMatch = false;
      }
    }
    console.log('[Auth] Password match:', isPasswordMatch);

    if (!user || !isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = signToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        qrLimit: user.qrLimit,
        qrUsed: user.qrUsed
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Current User
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        qrLimit: user.qrLimit,
        qrUsed: user.qrUsed,
        planExpiry: user.planExpiry
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
