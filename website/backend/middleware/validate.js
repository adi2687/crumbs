// Validation middleware for authentication routes
 const validateRegistration = (req, res, next) => {
  const { username, email, password, deviceId } = req.body;
  
  const errors = [];
  
  // Username validation
  if (!username) {
    errors.push('USERNAME_REQUIRED');
  } else if (username.length < 3) {
    errors.push('USERNAME_TOO_SHORT');
  } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.push('USERNAME_INVALID_FORMAT');
  }
  
  // Email validation
  if (!email) {
    errors.push('EMAIL_REQUIRED');
  } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    errors.push('INVALID_EMAIL_FORMAT');
  }
  
  // Password validation
  if (!password) {
    errors.push('PASSWORD_REQUIRED');
  } else if (password.length < 6) {
    errors.push('PASSWORD_TOO_SHORT');
  }
  
  // Device ID validation
  if (!deviceId) {
    errors.push('DEVICE_ID_REQUIRED');
  } else if (!/^DEV_[A-Z0-9]{9}$/.test(deviceId)) {
    errors.push('DEVICE_ID_INVALID_FORMAT');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors[0] // Return first error for consistency with frontend
    });
  }
  
  next();
};

 const validateLogin = (req, res, next) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'USERNAME_AND_PASSWORD_REQUIRED'
    });
  }
  
  next();
};

export {
  validateRegistration,
  validateLogin
};
