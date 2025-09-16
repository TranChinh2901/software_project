import express from "express";
import authController from "@/modules/auth/auth.controller";
import { asyncHandle } from "@/utils/handle-error";
import { validateBody } from "@/middlewares/validate.middleware";
import { LoginSchema, RegisterSchema, RefreshTokenSchema } from "@/modules/auth/schema/auth.schema";
import { authMiddleware } from "@/middlewares/auth.middleware";

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

// TODO: Implement refresh token functionality
// router.post(
//   "/refresh-token",
//   validateBody(RefreshTokenSchema),
//   asyncHandle(authController.refreshToken)
// );

// Protected routes
router.post(
  "/logout",
  authMiddleware(),
  asyncHandle(authController.logout)
);

router.get(
  "/profile",
  authMiddleware(),
  asyncHandle(authController.getProfile)
);

export default router;
