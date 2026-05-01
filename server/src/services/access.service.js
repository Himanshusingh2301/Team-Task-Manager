import Project from "../models/Project.js";
import AppError from "../utils/AppError.js";

export async function getProjectAndAssertAccess(projectId, user) {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new AppError("Project not found.", 404);
  }

  const isAdmin = user.role === "admin";
  const isMember = project.members.some((memberId) => memberId.toString() === user._id.toString());

  if (!isAdmin && !isMember) {
    throw new AppError("You do not have access to this project.", 403);
  }

  return project;
}
