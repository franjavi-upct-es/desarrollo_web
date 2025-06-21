const Task = require("../models/Task.js");
const User = require("../models/User.js");
const excelJS = require("exceljs");

// @desc    Export all tasks as an Excel file
// @route   GET /api/reports/export/tasks
// @access  Private (Admin)
const exportTaskReport = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo", "name email");

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Resumen de tareas");

    worksheet.colums = [
      { header: "ID", key: "_id", width: 25 },
      { header: "Título", key: "title", width: 30 },
      { header: "Descripción", key: "description", width: 50 },
      { header: "Prioridad", key: "priority", width: 15 },
      { header: "Estado", key: "status", width: 20 },
      { header: "Fecha límite", key: "dueDate", width: 20 },
      { header: "Asignada a:", key: "assignedTo", width: 30 },
    ];

    tasks.forEach((task) => {
      const assignedTo = task.assignedTo
        .map((user) => `${user.name} (${user.email})`)
        .join(", ");
      worksheet.addRow({
        _id: task._id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate.toISOString().split("T")[0],
        assignedTo: assignedTo || "No asignada"
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="resumen_de_tareas.xlsx"'
    );

    return workbook.xlsx.write(res).then(() => {
      res.end();
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error exportando las tareas", error: error.message });
  }
}

// @desc    Export user-task report as an Excel file
// @route   GET /api/reports/export/users
// @access  Private (Admin)
const exportUsersReport = async (req, res) => {
  try {
    const users = await User.find().select("name email _id").lean();
    const userTasks = await Task.find().populate(
      "assignedTo",
      "name email _id"
    );

    const userTaskMap = {};
    user.forEach((user) => {
      userTaskMap(user._id) = {
        name: user.name,
        email: user.email,
        taskCount: 0,
        pendingTasks: 0,
        inProgressTasks: 0,
        completedTasks: 0,
      };
    });

    userTasks.forEach((task) => {
      if (task.assignedTo) {
        task.assignedTo.forEach((assignedUser) => {
          if (userTaskMap[assignedUser._id]) {
            userTaskMap[assignedUser].taskCount += 1;
            if (task.status === "Pendiente") {
              userTaskMap[assignedUser._id].pendingTasks += 1;
            } else if (task.status === "En progreso") {
              userTaskMap[assignedUser._id].inProgressTasks += 1;
            } else if (task.status === "Completada") {
              userTaskMap[assignedUser._id].completedTasks += 1;
            }
          }
        })
      }
    })

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Informe de usuarios");
    worksheet.columns = [
      {header: "Nombre de usuario", key: "name", width: 30},
      {header: "Email", key: "email", width: 30},
      {header: "Total de tareas", key: "taskCount", width: 20},
      {header: "Tareas pendientes", key: "pendingTasks", width: 20},
      {
        header: "Tareas en progreso",
        key: "inProgressTasks",
        width: 20
      },
      {header: "Tareas completadas", key: "completedTasks", width: 20},
    ];

    Object.values(userTaskMap).forEach((user) => {
      worksheet.addRow(user);
    })

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="informe_de_usuarios.xlsx"'
    );
    return workbook.xlsx.write(res).then(() => {
      res.end();
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error exportando las tareas", error: error.message });
  }
}

module.exports = { exportTaskReport, exportUsersReport };
