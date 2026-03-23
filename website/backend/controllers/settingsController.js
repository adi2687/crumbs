import User from "../models/User.js";
import bcrypt from "bcryptjs";

// Get user settings
export const getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      data: {
        profile: {
          username: user.username,
          email: user.email,
          darkMode: user.darkMode || false
        },
        notifications: {
          emailNotifications: user.emailNotifications !== false,
          systemAlerts: user.systemAlerts !== false,
          earningAlerts: user.earningAlerts !== false
        },
        storage: {
          location: user.storageLocation || "DEFAULT_NODE_STORAGE",
          maxStorageLimit: user.maxStorageLimit || "1000 GB",
          compressionLevel: user.compressionLevel || "MEDIUM"
        },
        security: {
          twoFactorAuth: user.twoFactorAuth || false
        }
      }
    });
  } catch (error) {
    console.error("Get settings error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Update profile settings
export const updateProfile = async (req, res) => {
  try {
    const { username, email, darkMode } = req.body;
    
    // Find user
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check if username is already taken (if changed)
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Username already taken"
        });
      }
    }

    // Check if email is already taken (if changed)
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email already registered"
        });
      }
    }

    // Update fields
    if (username) user.username = username;
    if (email) user.email = email;
    if (darkMode !== undefined) user.darkMode = darkMode;

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        username: user.username,
        email: user.email,
        darkMode: user.darkMode
      }
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Update password
export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required"
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long"
      });
    }

    // Find user with password
    const user = await User.findById(req.user.id).select("+password");
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect"
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedNewPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password updated successfully"
    });
  } catch (error) {
    console.error("Update password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Update notification preferences
export const updateNotifications = async (req, res) => {
  try {
    const { emailNotifications, systemAlerts, earningAlerts } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Update notification settings
    if (emailNotifications !== undefined) user.emailNotifications = emailNotifications;
    if (systemAlerts !== undefined) user.systemAlerts = systemAlerts;
    if (earningAlerts !== undefined) user.earningAlerts = earningAlerts;

    await user.save();

    res.json({
      success: true,
      message: "Notification preferences updated successfully",
      data: {
        emailNotifications: user.emailNotifications,
        systemAlerts: user.systemAlerts,
        earningAlerts: user.earningAlerts
      }
    });
  } catch (error) {
    console.error("Update notifications error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Update storage settings
export const updateStorage = async (req, res) => {
  try {
    const { location, maxStorageLimit, compressionLevel } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Update storage settings
    if (location) user.storageLocation = location;
    if (maxStorageLimit) user.maxStorageLimit = maxStorageLimit;
    if (compressionLevel) user.compressionLevel = compressionLevel;

    await user.save();

    res.json({
      success: true,
      message: "Storage settings updated successfully",
      data: {
        location: user.storageLocation,
        maxStorageLimit: user.maxStorageLimit,
        compressionLevel: user.compressionLevel
      }
    });
  } catch (error) {
    console.error("Update storage error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
