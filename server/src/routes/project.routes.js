import { Router } from "express";

import {
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  updateProject
} from "../controllers/project.controller.js";
import { authorize, protect } from "../middleware/auth.middleware.js";
import { handleValidationErrors } from "../middleware/error.middleware.js";
import {
  createProjectValidator,
  projectIdValidator,
  updateProjectValidator
} from "../validators/project.validator.js";

const router = Router();

router.use(protect);
router.get("/", getProjects);
router.post("/", authorize("admin"), createProjectValidator, handleValidationErrors, createProject);
router.get("/:projectId", projectIdValidator, handleValidationErrors, getProjectById);
router.put("/:projectId", authorize("admin"), updateProjectValidator, handleValidationErrors, updateProject);
router.delete("/:projectId", authorize("admin"), projectIdValidator, handleValidationErrors, deleteProject);

export default router;
