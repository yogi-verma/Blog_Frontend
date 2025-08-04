const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// @desc    Register user
// @route   POST /api/v1/auth/signup
// @access  Public
exports.signup = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Create user
    const user = await User.create({ username, password });

    // ✅ Generate tokens
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || "15m",
    });

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // ✅ Get session info
    const ip = req.ip;
    const userAgent = req.headers["user-agent"];
    const location = "India"; // Static or use IP geolocation later

    // ✅ Add session to user
    user.sessions.push({
      refreshToken,
      ip,
      userAgent,
      location,
    });

    await user.save();

    res.status(201).json({
      success: true,
      data: {
        username: user.username,
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Username already exists",
      });
    }

    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide username and password",
      });
    }

    const user = await User.findOne({ username }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // ✅ Generate access + refresh token
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // ✅ Get IP & user-agent
    const ip = req.ip;
    const userAgent = req.headers["user-agent"];

    // Optional: Get location using IP
    const location = "India"; // Static or from IP geolocation service

    // ✅ Push session to user.sessions
    user.sessions.push({
      refreshToken,
      ip,
      userAgent,
      location,
    });

    await user.save();

    res.status(200).json({
      success: true,
      data: {
        username: user.username,
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Get dashboard
// @route   GET /api/v1/auth/dashboard
// @access  Private
exports.getDashboard = async (req, res, next) => {
  try {
    const user = req.user;

    res.status(200).json({
      success: true,
      data: {
        username: user.username,
        message: "Welcome to your dashboard",
      },
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Logout user
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    res.cookie("token", "none", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { username, oldPassword, newPassword } = req.body;

    if (!username || !oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required (username, oldPassword, newPassword)",
      });
    }

    // Fetch user with password explicitly selected
    const user = await User.findOne({ username }).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Compare old password
    const isMatch = await user.comparePassword(oldPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid old password",
      });
    }

    // Optional: Prevent reusing old password
    if (oldPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from the old password",
      });
    }

    // Set new password (will be hashed in pre-save middleware)
    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Server error",
    });
  }
};

// @desc    Delete user account
// @route   DELETE /api/v1/auth/delete-account
// @access  Privateconst User = require('../models/User');

exports.deleteAccount = async (req, res) => {
  try {
    // Double check if user exists (optional but safe)
    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete the user
    await User.findByIdAndDelete(req.user._id);

    // Clear the auth token cookie
    res.cookie("token", "none", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    // Respond with success
    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
      data: {},
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error: " + err.message,
    });
  }
};

// controllers/authController.js

exports.verifyAuth = async (req, res) => {
  try {
    const user = req.user;

    res.status(200).json({
      success: true,
      message: "Token is valid",
      data: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};
