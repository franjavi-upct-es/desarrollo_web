const Task = require("../models/Task");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// @desc      Get all users (Admin only)
// @route     GET /api/users/
// @access    Private (admin)
const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "member" }).select("-password");

    // Add task counts to each user
    const usersWithTaskCounts = await Promise.all(
      users.map(async (user) => {

        const pendingTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "Pendiente"
        });
        const inProgressTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "En Progreso"
        });
        const completedTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "Completada"
        });

        return {
          ...user._doc, // Include all existing user data
          pendingTasks,
          inProgressTasks,
          completedTasks,
        };
      })
    );

    res.json(usersWithTaskCounts);
  } catch (error) {
    res.status(500).json({ message: "Error del servidor", error: error.message });
  }
}

// @desc      Get user by ID
// @route     GET /api/users/:id
// @access    Private
const getUserById = async (req, res) => {
  try {

  } catch (error) {
    res.status(500).json({ message: "Error del servidor", error: error.message });
  }
};

// @desc      Delete a user (Admin only)
// @route     DELETE /api/users/:id
// @access    Private (Admin)
const deleteUser = async (req, res) => {
  try {

  } catch (error) {
    res.status(500).json({ message: "Error del servidor", error: error.message });
  }
};

module.exports = { getUsers, getUserById, deleteUser };

