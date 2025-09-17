// import { userController } from '@/modules/users/user.controller';
// import express from "express";


// import { asyncHandle } from "@/utils/handle-error";
// import { validateBody } from "@/middlewares/validate.middleware";
// import { UpdateUserSchema } from "@/modules/users/schema/user.schema";
// import { requireAdmin, requireAnyRole, requireAuth } from "@/middlewares/auth.middleware";

// import { AppResponse } from "@/common/success.response";
// import { HttpStatusCode } from "@/constants/status-code";
// import { RoleType } from '@/modules/auth/enum/auth.enum';

// const router = express.Router();

// router.get("/profile", 
//   requireAuth(), 
//   asyncHandle(userController.getProfile)
// );

// router.put("/profile",
//   requireAuth(),
//   validateBody(UpdateUserSchema),
//   asyncHandle(userController.updateProfile)
// );

// router.get("/", 
//   requireAdmin(), 
//   asyncHandle(userController.getAll)
// );

// router.get("/:id", 
//   requireAdmin(), 
//   asyncHandle(userController.getById)
// );

// router.put("/:id",
//   requireAdmin(),
//   validateBody(UpdateUserSchema),
//   asyncHandle(userController.update)
// );

// router.delete("/:id",
//   requireAdmin(),
//   asyncHandle(userController.delete)
// );

// router.get("/admin/settings", requireAdmin(), (req, res) => {
//   return new AppResponse({
//     message: "System settings retrieved successfully", 
//     statusCode: HttpStatusCode.OK,
//     data: {
//       settings: {
//         maintenance_mode: false,
//         user_registration: true,
//         email_verification: true
//       }
//     }
//   }).sendResponse(res);
// });

// router.get("/dashboard", requireAnyRole([RoleType.USER, RoleType.ADMIN]), (req, res) => {
//   const user = (req as any).user;
  
//   return new AppResponse({
//     message: "Dashboard data retrieved successfully",
//     statusCode: HttpStatusCode.OK,
//     data: {
//       message: `Welcome ${user.role}!`,
//       userRole: user.role,
//       accessLevel: user.role === RoleType.ADMIN ? "Full Access" : "Limited Access"
//     }
//   }).sendResponse(res);
// });

// export default router;
