const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile." });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    // Prevent email/password update through this route
    const { password, email, ...updates } = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password");
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile." });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both current and new password are required." });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters." });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect." });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    res.json({ message: "Password updated successfully." });
  } catch (err) {
    console.error("CHANGE PASSWORD ERROR:", err.message);
    res.status(500).json({ message: "Failed to change password." });
  }
};

exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    user.avatar = req.file.path;
    await user.save();

    res.json({ message: "Avatar uploaded.", avatar: user.avatar });
  } catch (err) {
    res.status(500).json({ message: "Failed to upload avatar." });
  }
};
