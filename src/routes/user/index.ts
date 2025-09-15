import express from "express";

import userController from "@/modules/users/user.controller"
import { asyncHandle } from "@/utils/handle-error";
import { validateBody } from "@/middlewares/validate.middleware";
import { UpdateUserSchema } from "@/modules/users/schema/user.schema";
import { authenticateToken, requireAdmin } from "@/modules/auth/auth.middleware";

const router = express.Router();

// Admin only routes
router.get("/", 
  authenticateToken, 
  requireAdmin, 
  asyncHandle(userController.getAll)
);

router.get("/:id", 
  authenticateToken, 
  requireAdmin, 
  asyncHandle(userController.getById)
);

// User can update their own profile (implement in controller)
router.put("/:id",
  authenticateToken,
  validateBody(UpdateUserSchema),
  asyncHandle(userController.update)
);

router.delete("/:id",
  authenticateToken,
  requireAdmin,
  asyncHandle(userController.delete)
);

export default router;
