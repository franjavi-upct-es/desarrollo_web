const Task = require("../models/Task.js");
const User = require("../models/User.js");
const bcrypt = require("bcryptjs");

// @desc    Get all users (Admin only)
// @route   POST /api/users
// @access  Private (Admin)
const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'member' }).select("-password");
    // Add task counts to each user
    const userWithTaskCounts = await Promise.all(
      users.map(async (user) => {
        const pendingTasks = await Task.countDocuments({ assignedTo: user._id, status: "Pendiente" });
        const inProgressTasks = await Task.countDocuments({ assignedTo: user._id, status: "En progreso" });
        const completedTasks = await Task.countDocuments({ assignedTo: user._id, status: "Completada" });

        return {
          ...user._doc, // Include all existing user data
          pendingTasks,
          inProgressTasks,
          completedTasks,
        };
      }));
    res.json(userWithTaskCounts)
  } catch (error) {
    res.status(500).json({ message: "Error del servidor", error: error.message });
  }
};

// @desc    Get user by ID
// @route   POST /api/users/:id
// @access  Private
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
  } catch (error) {
    res.status(500).json({ message: "Error del servidor", error: error.message });
  }

};

module.exports = { getUsers, getUserById };
