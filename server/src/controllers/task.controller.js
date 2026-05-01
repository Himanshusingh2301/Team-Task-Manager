import Task from "../models/Task.js";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getProjectAndAssertAccess } from "../services/access.service.js";

export const createTask = asyncHandler(async (req, res) => {
  const project = await getProjectAndAssertAccess(req.body.project, req.user);
  const assignee = await User.findById(req.body.assignedTo);

  if (!assignee) {
    throw new AppError("Assigned user not found.", 404);
  }

  const isProjectMember = project.members.some((memberId) => memberId.toString() === assignee._id.toString());

  if (!isProjectMember) {
    throw new AppError("Assigned user must be a member of the selected project.", 400);
  }

  const task = await Task.create({
    ...req.body,
    dueDate: req.body.dueDate || undefined,
    createdBy: req.user._id
  });

  const populatedTask = await Task.findById(task._id)
    .populate("project", "name")
    .populate("assignedTo", "name email role")
    .populate("createdBy", "name email role");

  res.status(201).json({ task: populatedTask });
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.taskId);

  if (!task) {
    throw new AppError("Task not found.", 404);
  }

  const project = await getProjectAndAssertAccess(task.project, req.user);

  const isAdmin = req.user.role === "admin";
  const isAssignee = task.assignedTo.toString() === req.user._id.toString();

  if (!isAdmin && !isAssignee) {
    throw new AppError("You can only update tasks assigned to you.", 403);
  }

  if (!isAdmin) {
    const allowedUpdates = ["status"];
    const attemptedUpdates = Object.keys(req.body);
    const hasForbiddenUpdate = attemptedUpdates.some((field) => !allowedUpdates.includes(field));

    if (hasForbiddenUpdate) {
      throw new AppError("Members can only update task status.", 403);
    }
  }

  if (req.body.assignedTo) {
    const assignee = await User.findById(req.body.assignedTo);

    if (!assignee) {
      throw new AppError("Assigned user not found.", 404);
    }

    const isProjectMember = project.members.some((memberId) => memberId.toString() === assignee._id.toString());

    if (!isProjectMember) {
      throw new AppError("Assigned user must be a member of the selected project.", 400);
    }
  }

  Object.assign(task, {
    ...req.body,
    ...(req.body.dueDate !== undefined ? { dueDate: req.body.dueDate || undefined } : {})
  });
  await task.save();

  const populatedTask = await Task.findById(task._id)
    .populate("project", "name")
    .populate("assignedTo", "name email role")
    .populate("createdBy", "name email role");

  res.json({ task: populatedTask });
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.taskId);

  if (!task) {
    throw new AppError("Task not found.", 404);
  }

  await getProjectAndAssertAccess(task.project, req.user);
  await task.deleteOne();

  res.json({ message: "Task deleted successfully." });
});

export const getMyTasks = asyncHandler(async (req, res) => {
  const filter = req.user.role === "admin" ? {} : { assignedTo: req.user._id };

  const tasks = await Task.find(filter)
    .populate("project", "name")
    .populate("assignedTo", "name email role")
    .sort({ dueDate: 1, createdAt: -1 });

  res.json({ tasks });
});
