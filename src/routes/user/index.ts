import express from "express";

import userController from "@/modules/users/user.controller"
import { asyncHandle } from "@/utils/handle-error";
import { validateBody } from "@/middlewares/validate.middleware";
import { UpdateUserSchema } from "@/modules/users/schema/user.schema";
import { authMiddleware } from "@/middlewares/auth.middleware";

const router = express.Router();

// Admin only routes
router.get("/", 
  authMiddleware(['ADMIN']), 
  asyncHandle(userController.getAll)
);

router.get("/:id", 
  authMiddleware(['ADMIN']), 
  asyncHandle(userController.getById)
);

// User can update their own profile (implement in controller)
router.put("/:id",
  authMiddleware(['USER', 'ADMIN']),
  validateBody(UpdateUserSchema),
  asyncHandle(userController.update)
);

router.delete("/:id",
  authMiddleware(['ADMIN']),
  asyncHandle(userController.delete)
);

export default router;
