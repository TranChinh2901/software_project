import express from "express";

import userController from "@/modules/users/user.controller"
import { asyncHandle } from "@/utils/handle-error";
import { validateBody } from "@/middlewares/validate.middleware";
import { UpdateUserSchema } from "@/modules/users/schema/user.schema";
import { requireAdmin, requireAnyRole, requireAuth } from "@/middlewares/auth.middleware";
import { RoleType } from "@/constants/role-type";
import { AppResponse } from "@/common/success.response";
import { HttpStatusCode } from "@/constants/status-code";

const router = express.Router();

// ===== USER ROUTES =====

// User can view their own profile
router.get("/profile", 
  requireAuth(), 
  asyncHandle(userController.getProfile)
);

// User can update their own profile
router.put("/profile",
  requireAuth(),
  validateBody(UpdateUserSchema),
  asyncHandle(userController.updateProfile)
);

// ===== ADMIN ROUTES =====

// Admin only - Get all users
router.get("/", 
  requireAdmin(), 
  asyncHandle(userController.getAll)
);

// Admin only - Get user by ID
router.get("/:id", 
  requireAdmin(), 
  asyncHandle(userController.getById)
);

// Admin only - Update any user
router.put("/:id",
  requireAdmin(),
  validateBody(UpdateUserSchema),
  asyncHandle(userController.update)
);

// Admin only - Delete user
router.delete("/:id",
  requireAdmin(),
  asyncHandle(userController.delete)
);

// Admin only - System settings
router.get("/admin/settings", requireAdmin(), (req, res) => {
  return new AppResponse({
    message: "System settings retrieved successfully", 
    statusCode: HttpStatusCode.OK,
    data: {
      settings: {
        maintenance_mode: false,
        user_registration: true,
        email_verification: true
      }
    }
  }).sendResponse(res);
});

// Both USER and ADMIN - Dashboard
router.get("/dashboard", requireAnyRole([RoleType.USER, RoleType.ADMIN]), (req, res) => {
  const user = (req as any).user;
  
  return new AppResponse({
    message: "Dashboard data retrieved successfully",
    statusCode: HttpStatusCode.OK,
    data: {
      message: `Welcome ${user.role}!`,
      userRole: user.role,
      accessLevel: user.role === RoleType.ADMIN ? "Full Access" : "Limited Access"
    }
  }).sendResponse(res);
});

export default router;
