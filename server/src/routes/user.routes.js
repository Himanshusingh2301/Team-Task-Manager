import { Router } from "express";

import { getUsers } from "../controllers/user.controller.js";
import { authorize, protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", protect, authorize("admin"), getUsers);

export default router;
