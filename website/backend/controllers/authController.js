import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { assignPeerId } from '../services/peerPool.js';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { username, email, password, deviceId } = req.body;

    // Validate required fields
    if (!username || !email || !password || !deviceId) {
      return res.status(400).json({
        success: false,
        message: 'ALL_FIELDS_REQUIRED'
      });
    }

    // Validate username format
    if (username.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'USERNAME_TOO_SHORT'
      });
    }

    // Validate email format
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'INVALID_EMAIL_FORMAT'
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'PASSWORD_TOO_SHORT'
      });
    }

    // Validate deviceId format
    if (!/^DEV_[A-Z0-9]{9}$/.test(deviceId)) {
      return res.status(400).json({
        success: false,
        message: 'DEVICE_ID_INVALID_FORMAT'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }, { deviceId }]
    });

    if (existingUser) {
      let field = 'USER_EXISTS';
      if (existingUser.username === username) field = 'USERNAME_EXISTS';
      else if (existingUser.email === email) field = 'EMAIL_EXISTS';
      else if (existingUser.deviceId === deviceId) field = 'DEVICE_ID_EXISTS';

      return res.status(400).json({
        success: false,
        message: field
      });
    }

    // Assign peerId from the trained model's pool (or fallback)
    const peerId = await assignPeerId(User);

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      deviceId,
      peerId
    });

    // Create token
    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        deviceId: user.deviceId,
        peerId: user.peerId
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle MongoDB duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        success: false,
        message: `${field.toUpperCase()}_EXISTS`
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map(val => val.message).join(', ');
      return res.status(400).json({
        success: false,
        message: message
      });
    }

    res.status(500).json({
      success: false,
      message: 'SERVER_ERROR'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'USERNAME_AND_PASSWORD_REQUIRED'
      });
    }

    // Check for user
    const user = await User.findOne({ username }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'INVALID_CREDENTIALS'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'INVALID_CREDENTIALS'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'ACCOUNT_DEACTIVATED'
      });
    }

    // Backfill peerId for users created before this field existed
    if (!user.peerId) {
      user.peerId = await assignPeerId(User);
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    // Create token
    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        deviceId: user.deviceId,
        peerId: user.peerId,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'SERVER_ERROR'
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        deviceId: user.deviceId,
        peerId: user.peerId,
        isActive: user.isActive,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'User logged out successfully'
  });
};
