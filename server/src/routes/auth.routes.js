import { Router } from "express";

import { getMe, login, signup } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { handleValidationErrors } from "../middleware/error.middleware.js";
import { loginValidator, signupValidator } from "../validators/auth.validator.js";

const router = Router();

router.post("/signup", signupValidator, handleValidationErrors, signup);
router.post("/login", loginValidator, handleValidationErrors, login);
router.get("/me", protect, getMe);

export default router;
