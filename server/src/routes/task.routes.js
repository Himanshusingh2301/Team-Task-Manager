import { Router } from "express";

import { createTask, deleteTask, getMyTasks, updateTask } from "../controllers/task.controller.js";
import { authorize, protect } from "../middleware/auth.middleware.js";
import { handleValidationErrors } from "../middleware/error.middleware.js";
import { createTaskValidator, taskIdValidator, updateTaskValidator } from "../validators/task.validator.js";

const router = Router();

router.use(protect);
router.get("/", getMyTasks);
router.post("/", authorize("admin"), createTaskValidator, handleValidationErrors, createTask);
router.put("/:taskId", updateTaskValidator, handleValidationErrors, updateTask);
router.delete("/:taskId", authorize("admin"), taskIdValidator, handleValidationErrors, deleteTask);

export default router;
