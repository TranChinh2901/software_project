import express from "express";
import authController from "@/modules/auth/auth.controller";
import { asyncHandle } from "@/utils/handle-error";
import { validateBody } from "@/middlewares/validate.middleware";
import { requireAuth } from "@/middlewares/auth.middleware";
import { RefreshTokenSchema, RegisterSchema } from "@/modules/auth/schema/signup.chema";
import { LoginSchema } from "@/modules/users/schema/user.schema";

const router = express.Router();

// Public routes
router.post(
  "/register",
  validateBody(RegisterSchema),
  asyncHandle(authController.register)
);

router.post(
  "/login",
  validateBody(LoginSchema),
  asyncHandle(authController.login)
);

router.post(
  "/refresh-token",
  validateBody(RefreshTokenSchema),
  asyncHandle(authController.refreshToken)
);

// Protected routes
router.post(
  "/logout",
  requireAuth(),
  asyncHandle(authController.logout)
);

router.get(
  "/profile",
  requireAuth(),
  asyncHandle(authController.getProfile)
);

export default router;
