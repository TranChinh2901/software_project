import { Request, Response, NextFunction } from 'express';
import authService from '@/modules/auth/auth.service';
import { AppError } from '@/common/error.response';
import { HttpStatusCode } from '@/constants/status-code';
import { ErrorCode } from '@/constants/error-code';
import { hasPermission, RoleType } from '@/modules/auth/enum/auth.enum';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: RoleType;
  };
}

export const authMiddleware = (requiredRole?: RoleType) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Get token from header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      throw new AppError(
        'No authentication token provided',
        HttpStatusCode.UNAUTHORIZED,
        ErrorCode.UNAUTHORIZED,
        { reason: 'missing_token' }
      );
    }

    try {
      // Verify token
      const decoded = authService.verifyToken(token);
      console.log(decoded);
      if (!decoded) {
        throw new AppError(
          'Invalid or malformed authentication token',
          HttpStatusCode.UNAUTHORIZED,
          ErrorCode.INVALID_TOKEN,
          { reason: 'token_verification_failed' }
        );
      }

      // Check if user has required role
      if (requiredRole && !hasPermission(decoded.role as RoleType, requiredRole)) {
        throw new AppError(
          'Insufficient permissions to access this resource',
          HttpStatusCode.FORBIDDEN,
          ErrorCode.FORBIDDEN,
          { 
            requiredRole,
            userRole: decoded.role,
            reason: 'insufficient_permissions'
          }
        );
      }

      // Add user to request
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role as RoleType,
      };

      next();
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      
      // For unexpected errors, wrap them in AppError
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      throw new AppError(
        errorMessage,
        HttpStatusCode.UNAUTHORIZED,
        ErrorCode.INVALID_TOKEN, 
        {
          reason: 'authentication_error',
          originalError: error instanceof Error ? error.message : String(error)
        }
      );
    }
  };
};

// Helper middleware cho các role cụ thể
export const requireAuth = () => authMiddleware();
export const requireUser = () => authMiddleware(RoleType.USER);
export const requireAdmin = () => authMiddleware(RoleType.ADMIN);

// Middleware kiểm tra nhiều role (OR logic)
export const requireAnyRole = (roles: RoleType[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authCheck = authMiddleware();
    authCheck(req, res, (error) => {
      if (error) return next(error);
      
      const userRole = req.user?.role;
      if (!userRole || !roles.some(role => hasPermission(userRole, role))) {
        throw new AppError(
          'Insufficient permissions to access this resource',
          HttpStatusCode.FORBIDDEN,
          ErrorCode.FORBIDDEN,
          { 
            requiredRoles: roles,
            userRole,
            reason: 'insufficient_permissions'
          }
        );
      }
      
      next();
    });
  };
};
