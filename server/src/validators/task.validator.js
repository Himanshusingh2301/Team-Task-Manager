import { body, param } from "express-validator";

export const taskIdValidator = [param("taskId").isMongoId().withMessage("Invalid task id.")];

export const createTaskValidator = [
  body("title").trim().notEmpty().withMessage("Task title is required."),
  body("description").optional().trim(),
  body("status").optional().isIn(["todo", "in_progress", "done"]).withMessage("Invalid status."),
  body("priority").optional().isIn(["low", "medium", "high"]).withMessage("Invalid priority."),
  body("dueDate").optional({ checkFalsy: true }).isISO8601().withMessage("Invalid due date."),
  body("project").isMongoId().withMessage("A valid project is required."),
  body("assignedTo").isMongoId().withMessage("A valid assigned user is required.")
];

export const updateTaskValidator = [
  ...taskIdValidator,
  body("title").optional().trim().notEmpty().withMessage("Task title cannot be empty."),
  body("description").optional().trim(),
  body("status").optional().isIn(["todo", "in_progress", "done"]).withMessage("Invalid status."),
  body("priority").optional().isIn(["low", "medium", "high"]).withMessage("Invalid priority."),
  body("dueDate").optional({ nullable: true, checkFalsy: true }).isISO8601().withMessage("Invalid due date."),
  body("assignedTo").optional().isMongoId().withMessage("A valid assigned user is required.")
];
