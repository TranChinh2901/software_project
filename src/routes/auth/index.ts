import express from "express";
import authController from "@/modules/auth/auth.controller";
import { asyncHandle } from "@/utils/handle-error";
import { validateBody } from "@/middlewares/validate.middleware";
import { LoginSchema, RegisterSchema, RefreshTokenSchema } from "@/modules/auth/schema/auth.schema";
import { authenticateToken } from "@/modules/auth/auth.middleware";

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
  authenticateToken,
  asyncHandle(authController.logout)
);

router.get(
  "/profile",
  authenticateToken,
  asyncHandle(authController.getProfile)
);

export default router;
