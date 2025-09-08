const Task = require("../models/Task");

// @desc      Get all tasks (Admin: all, User: only assigned tasks)
// @route     GET /api/tasks
// @access    Private
const getTasks = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};

    if (status) {
      filter.status = status;
    }

    let tasks;

    if (req.user.role === "admin") {
      tasks = await Task.find(filter).populate(
        "assignedTo",
        "name email profileImageUrl"
      );
    } else {
      tasks = await Task.find({ ...filter, assignedTo: req.user._id }).populate(
        "assignedTo",
        "name email profileImageUrl"
      );
    }

    // Add completed todoChecklist count to each task
    tasks = await Promise.all(
      tasks.map(async (task) => {
        const completedCount = task.todoChecklist.filter(
          (item) => item.completed
        ).length;
        return { ...task._doc, completedTodoCount: completedCount };
      })
    );

    // Status summary counts
    const allTasks = await Task.countDocuments(
      req.user.role === "admin" ? {} : { assignedTo: req.user._id }
    );

    const pendingTasks = await Task.countDocuments({
      ...filter,
      status: "Pendiente",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });

    const inProgressTasks = await Task.countDocuments({
      ...filter,
      status: "En progreso",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });

    const completedTasks = await Task.countDocuments({
      ...filter,
      status: "Terminada",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });

    res.json({
      tasks,
      statusSummary: {
        all: allTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error del servidor", error: error.message })
  }
}

// @desc      Get task by ID
// @route     GET /api/tasks/:id 
// @access    Private
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      "assignedTo",
      "name email profileImageUrl"
    );

    if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Error del servidor", error: error.message })
  }
}

// @desc      Create a new task (Admin only)
// @route     POST /api/tasks/
// @access    Private (Admin)
const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      attachements,
      todoChecklist,
    } = req.body;

    if (!Array.isArray(assignedTo)) {
      return res
        .status(400)
        .json({ message: "assignedTo debe ser una lista de IDs de usuarios" })
    }

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      createdBy: req.user._id,
      todoChecklist,
      attachements,
    });

    res.status(201).json({ message: "Tarea creada con éxito", task });
  } catch (error) {
    res.status(500).json({ message: "Error del servidor", error: error.message })
  }
}

// @desc      Update task details
// @route     PUT /api/tasks/:id
// @access    Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.priority = req.body.priority || task.priority;
    task.dueDate = req.body.dueDate || task.dueDate;
    task.todoChecklist = req.body.todoChecklist || task.todoChecklist;
    task.attachements = req.body.attachements || task.attachements

    if (req.body.assignedTo) {
      if (!Array.isArray(req.body.assignedTo)) {
        return res
          .status(400)
          .json({ message: "assignedTo debe ser una lista de IDs de usuarios" })
      }
      task.assignedTo = req.body.assignedTo;
    }

    const updatedTask = await task.save();
    res.json({ message: "Tarea actualizada correctamente", updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Error del servidor", error: error.message })
  }
}

// @desc      Delete a task (Admin only)
// @route     DELETE /api/tasks/:id 
// @access    Private (Admin)
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

    await task.deleteOne();
    res.json({ message: "Tarea eliminada con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error del servidor", error: error.message })
  }
}

// @desc      Update task status
// @route     PUT /api/tasks/:id/status
// @access    Private
const updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

    const isAssigned = task.assignedTo.some(
      (userId) => userId.toString() === req.user._id.toString()
    );

    if (!isAssigned && req.user.role !== "admin") {
      return res.status(403).json({ message: "Sin autorización" });
    }

    task.status = req.body.status || task.status;

    if (task.status === "Terminada") {
      task.todoChecklist.forEach((item) => (item.completed = true));
      task.progress = 100;
    }

    await task.save();
    res.json({ message: "Tarea actualizada correctamente", task });
  } catch (error) {
    res.status(500).json({ message: "Error del servidor", error: error.message })
  }
}

// @desc      Update task checklist
// @route     PUT /api/tasks/:id/todo 
// @access    Private
const updateTaskChecklist = async (req, res) => {
  try {
    const { todoChecklist } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

    if (!task.assignedTo.includes(req.user._id) && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Sin autorización para actualizar la lista de tareas" });
    }
    task.todoChecklist = todoChecklist; // Replace with updated checklist

    // Auto-update progress based on checklist completion
    const completedCount = task.todoChecklist.filter(
      (item) => item.completed
    ).length;
    const totalItems = task.todoChecklist.length;
    task.progress =
      totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

    // Auto-mark task as completed if all items are checked
    if (task.progress === 100) {
      task.status = "Terminada";
    } else if (task.progress > 0) {
      task.status = "En progreso";
    } else {
      task.status = "Pendiente";
    }

    await task.save();
    const updatedTask = await Task.findById(req.params.id).populate(
      "assignedTo",
      "name image profileImageUrl"
    );

    res.json({ message: "Lista de tareas actualizada", task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Error del servidor", error: error.message })
  }
}

// @desc      Dashboard Data (Admin only)
// @route     GET /api/tasks/dashboard-data
// @access    Private
const getDashboardData = async (req, res) => {
  try {

  } catch (error) {
    res.status(500).json({ message: "Error del servidor", error: error.message })
  }
}

// @desc      Dashboard Data (User-specific)
// @route     GET /api/tasks/user-dashboard-data
// @access    Private
const getUserDashboardData = async (req, res) => {
  try {

  } catch (error) {
    res.status(500).json({ message: "Error del servidor", error: error.message })
  }
}

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskChecklist,
  getDashboardData,
  getUserDashboardData,
};
