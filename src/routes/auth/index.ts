import { Router } from 'express';
import authController from '@/modules/auth/auth.controller';
import { LoginSchema, UpdateProfileSchema } from '@/modules/auth/schema/login.schema';
import { RegisterSchema } from '@/modules/auth/schema/signup.chema';
import { authMiddleware, requireAdmin } from '@/middlewares/auth.middleware';
import { validateBody } from '@/middlewares/validate.middleware';
import { uploadAvatar } from '@/middlewares/upload.middleware';
import { asyncHandle } from '@/utils/handle-error';

const router = Router();

// Public routes
router.post('/register', 
  // validateBody(RegisterSchema), 
  asyncHandle(authController.register)
);

router.post('/login', 
  validateBody(LoginSchema), 
  asyncHandle(authController.login)
);

router.post('/refresh-token', 
  asyncHandle(authController.refreshToken)
);

// Protected routes
router.post('/logout', 
  authMiddleware, 
  asyncHandle(authController.logout)
);

router.get('/profile', 
  authMiddleware(), 
  asyncHandle(authController.getProfile)
);

router.put('/profile', 
  authMiddleware(),
  validateBody(UpdateProfileSchema),
  asyncHandle(authController.updateProfile)
);

router.delete('/delete-account',
  authMiddleware(),
  asyncHandle(authController.deleteAccount)
);

router.put('/upload-avatar',
  authMiddleware(),
  uploadAvatar.single('avatar'),
  asyncHandle(authController.uploadAvatar)
);

export default router;