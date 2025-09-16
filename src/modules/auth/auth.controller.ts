import { Request, Response } from 'express';
import authService from './auth.service';
import { AppResponse } from '@/common/success.response';
import { HttpStatusCode } from '@/constants/status-code';
import { AuthenticatedRequest } from '@/middlewares/auth.middleware';

class AuthController {
  async register(req: Request, res: Response) {
    const { 
      fullname, 
      email, 
      password, 
      phone_number,
      address,
      gender,
      date_of_birth,
      role 
    } = req.body;
    
    const result = await authService.register({ 
      fullname, 
      email, 
      password, 
      phone_number,
      address,
      gender,
      date_of_birth,
      role 
    });
    
    return new AppResponse({
      message: 'User registered successfully',
      statusCode: HttpStatusCode.CREATED,
      data: result
    }).sendResponse(res);
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    
    const result = await authService.login({ email, password });
    
    return new AppResponse({
      message: 'Login successful',
      statusCode: HttpStatusCode.OK,
      data: result
    }).sendResponse(res);
  }

  async logout(req: Request, res: Response) {
    return new AppResponse({
      message: 'Logged out successfully',
      statusCode: HttpStatusCode.OK,
      data: { message: 'Please remove the token from client storage' }
    }).sendResponse(res);
  }

  async refreshToken(req: Request, res: Response) {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      throw new Error('Refresh token is required');
    }
    
    const result = await authService.refreshToken(refreshToken);
    
    return new AppResponse({
      message: 'Token refreshed successfully',
      statusCode: HttpStatusCode.OK,
      data: result
    }).sendResponse(res);
  }

  async getProfile(req: AuthenticatedRequest, res: Response) {
    // Get user info from token (added by auth middleware)
    const user = req.user;
    
    if (!user) {
      throw new Error('User not found in request');
    }
    
    // Get full user details from database
    const userDetails = await authService.getUserById(user.id);
    
    return new AppResponse({
      message: 'Profile retrieved successfully',
      statusCode: HttpStatusCode.OK,
      data: userDetails
    }).sendResponse(res);
  }
}

export default new AuthController();
