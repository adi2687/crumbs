import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'USERNAME_REQUIRED'],
    unique: true,
    trim: true,
    minlength: [3, 'USERNAME_TOO_SHORT'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },
  email: {
    type: String,
    required: [true, 'EMAIL_REQUIRED'],
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'INVALID_EMAIL_FORMAT'
    ],
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'PASSWORD_REQUIRED'],
    minlength: [6, 'PASSWORD_TOO_SHORT'],
    select: false
  },
  deviceId: {
    type: String,
    required: [true, 'DEVICE_ID_REQUIRED'],
    unique: true,
    match: [/^DEV_[A-Z0-9]{9}$/, 'DEVICE_ID_INVALID_FORMAT']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and return JWT token
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id, username: this.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

export default mongoose.model('User', UserSchema);
