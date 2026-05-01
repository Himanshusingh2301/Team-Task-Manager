import { body, param } from "express-validator";

export const projectIdValidator = [param("projectId").isMongoId().withMessage("Invalid project id.")];

export const createProjectValidator = [
  body("name").trim().notEmpty().withMessage("Project name is required."),
  body("description").optional().trim(),
  body("members").optional().isArray().withMessage("Members must be an array."),
  body("members.*").optional().isMongoId().withMessage("Invalid member id.")
];

export const updateProjectValidator = [
  ...projectIdValidator,
  body("name").optional().trim().notEmpty().withMessage("Project name cannot be empty."),
  body("description").optional().trim(),
  body("members").optional().isArray().withMessage("Members must be an array."),
  body("members.*").optional().isMongoId().withMessage("Invalid member id.")
];
