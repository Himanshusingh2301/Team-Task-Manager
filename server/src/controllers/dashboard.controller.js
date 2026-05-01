import Task from "../models/Task.js";
import Project from "../models/Project.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getDashboard = asyncHandler(async (req, res) => {
  const projectFilter = req.user.role === "admin" ? {} : { members: req.user._id };
  const taskFilter = req.user.role === "admin" ? {} : { assignedTo: req.user._id };
  const now = new Date();

  const [projectsCount, tasks, overdueTasks, upcomingTasks, recentTasks] = await Promise.all([
    Project.countDocuments(projectFilter),
    Task.find(taskFilter).populate("project", "name").populate("assignedTo", "name email role"),
    Task.find({
      ...taskFilter,
      dueDate: { $lt: now },
      status: { $ne: "done" }
    })
      .populate("project", "name")
      .populate("assignedTo", "name email role")
      .sort({ dueDate: 1 }),
    Task.find({
      ...taskFilter,
      dueDate: { $gte: now }
    })
      .populate("project", "name")
      .populate("assignedTo", "name email role")
      .sort({ dueDate: 1 })
      .limit(5),
    Task.find(taskFilter)
      .populate("project", "name")
      .populate("assignedTo", "name email role")
      .sort({ createdAt: -1 })
      .limit(6)
  ]);

  const statusCounts = tasks.reduce(
    (accumulator, task) => {
      accumulator[task.status] += 1;
      return accumulator;
    },
    { todo: 0, in_progress: 0, done: 0 }
  );

  res.json({
    summary: {
      projectsCount,
      tasksCount: tasks.length,
      overdueCount: overdueTasks.length,
      completedCount: statusCounts.done
    },
    statusCounts,
    overdueTasks,
    upcomingTasks,
    recentTasks
  });
});
