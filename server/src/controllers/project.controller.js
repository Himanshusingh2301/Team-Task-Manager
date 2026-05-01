import mongoose from "mongoose";

import Project from "../models/Project.js";
import Task from "../models/Task.js";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getProjects = asyncHandler(async (req, res) => {
  const filter = req.user.role === "admin" ? {} : { members: req.user._id };

  const projects = await Project.aggregate([
    { $match: filter },
    {
      $lookup: {
        from: "users",
        localField: "members",
        foreignField: "_id",
        as: "members"
      }
    },
    {
      $lookup: {
        from: "tasks",
        localField: "_id",
        foreignField: "project",
        as: "tasks"
      }
    },
    {
      $addFields: {
        taskCount: { $size: "$tasks" },
        completedTaskCount: {
          $size: {
            $filter: {
              input: "$tasks",
              as: "task",
              cond: { $eq: ["$$task.status", "done"] }
            }
          }
        }
      }
    },
    {
      $project: {
        tasks: 0,
        "members.password": 0
      }
    },
    { $sort: { createdAt: -1 } }
  ]);

  res.json({ projects });
});

export const createProject = asyncHandler(async (req, res) => {
  const memberIds = [...new Set([...(req.body.members || []), req.user._id.toString()])];
  const users = await User.find({ _id: { $in: memberIds } }).select("_id");

  if (users.length !== memberIds.length) {
    throw new AppError("One or more selected members do not exist.", 400);
  }

  const project = await Project.create({
    name: req.body.name,
    description: req.body.description,
    createdBy: req.user._id,
    members: memberIds
  });

  const populatedProject = await Project.findById(project._id).populate("members", "name email role");

  res.status(201).json({ project: populatedProject });
});

export const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.projectId)
    .populate("createdBy", "name email role")
    .populate("members", "name email role");

  if (!project) {
    throw new AppError("Project not found.", 404);
  }

  const hasAccess =
    req.user.role === "admin" ||
    project.members.some((member) => member._id.toString() === req.user._id.toString());

  if (!hasAccess) {
    throw new AppError("You do not have access to this project.", 403);
  }

  const tasks = await Task.find({ project: project._id })
    .populate("assignedTo", "name email role")
    .populate("createdBy", "name email role")
    .sort({ dueDate: 1, createdAt: -1 });

  res.json({ project, tasks });
});

export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.projectId);

  if (!project) {
    throw new AppError("Project not found.", 404);
  }

  if (req.body.members) {
    const memberIds = [...new Set([...req.body.members, project.createdBy.toString()])];

    if (!memberIds.includes(req.user._id.toString())) {
      memberIds.push(req.user._id.toString());
    }

    const users = await User.find({ _id: { $in: memberIds } }).select("_id");

    if (users.length !== memberIds.length) {
      throw new AppError("One or more selected members do not exist.", 400);
    }

    project.members = memberIds;
  }

  if (req.body.name !== undefined) {
    project.name = req.body.name;
  }

  if (req.body.description !== undefined) {
    project.description = req.body.description;
  }

  await project.save();

  const updatedProject = await Project.findById(project._id).populate("members", "name email role");

  res.json({ project: updatedProject });
});

export const deleteProject = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();

  await session.withTransaction(async () => {
    const project = await Project.findById(req.params.projectId).session(session);

    if (!project) {
      throw new AppError("Project not found.", 404);
    }

    await Task.deleteMany({ project: project._id }).session(session);
    await project.deleteOne({ session });
  });

  session.endSession();

  res.json({ message: "Project deleted successfully." });
});
