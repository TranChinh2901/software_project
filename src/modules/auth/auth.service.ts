import { Repository } from "typeorm";
import { compare, hash } from "bcryptjs";

import { AppDataSource } from "@/config/database.config";
import { AppError } from "@/common/error.response";
import { HttpStatusCode } from "@/constants/status-code";
import { ErrorCode } from "@/constants/error-code";
import { RoleType } from "@/constants/role-type";
import { GenderType } from "@/constants/gender-type";
import { User } from "@/modules/users/entity/user.entity";
import { JwtUtils } from "@/utils/jwt.util";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  fullname: string;
  email: string;
  password: string;
  phone_number: string;
  address?: string;
  gender?: GenderType;
  date_of_birth?: Date;
  role?: RoleType;
}

export class AuthService {
  private userRepository: Repository<User>;
  private readonly JWT_SECRET: string;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
    this.JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  }

  async login(loginData: LoginData) {
    const { email, password } = loginData;

    // Find user by email
    const user = await this.userRepository.findOne({
      where: { email, is_deleted: false }
    });

    if (!user) {
      throw new AppError(
        "Invalid email or password",
        HttpStatusCode.UNAUTHORIZED,
        ErrorCode.UNAUTHORIZED
      );
    }

    // Verify password
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError(
        "Invalid email or password",
        HttpStatusCode.UNAUTHORIZED,
        ErrorCode.UNAUTHORIZED
      );
    }

    const tokens = this.generateToken(user);
    
    return {
      ...tokens,
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        role: user.role
      }
    };
  }

  async register(registerData: RegisterData) {
    const { fullname, email, password, phone_number, address, gender, date_of_birth, role } = registerData;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: [
        { email },
        { phone_number }
      ]
    });

    if (existingUser) {
      throw new AppError(
        'User with this email or phone number already exists',
        HttpStatusCode.CONFLICT,
        ErrorCode.EMAIL_ALREADY_EXISTS,
        { email, phone_number }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create new user
    const newUser = this.userRepository.create({
      fullname,
      email,
      phone_number,
      address,
      password: hashedPassword,
      gender: gender as GenderType,
      date_of_birth,
      role: role || RoleType.USER,
      is_verified: false,
      is_deleted: false
    });

    const savedUser = await this.userRepository.save(newUser);

    const tokens = this.generateToken(savedUser);
    
    return {
      ...tokens,
      user: {
        id: savedUser.id,
        fullname: savedUser.fullname,
        email: savedUser.email,
        role: savedUser.role
      }
    };
  }

  generateToken(user: User) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: JwtUtils.generateAccessToken(payload),
      refreshToken: JwtUtils.generateRefreshToken(payload)
    };
  }

  verifyToken(token: string) {
    try {
      return JwtUtils.verifyAccessToken(token) as {
        id: number;
        email: string;
        role: string;
      };
    } catch (error) {
      return null;
    }
  }

  verifyRefreshToken(token: string) {
    try {
      return JwtUtils.verifyRefreshToken(token) as {
        id: number;
        email: string;
        role: string;
      };
    } catch (error) {
      return null;
    }
  }

  async refreshToken(refreshToken: string) {
    const decoded = this.verifyRefreshToken(refreshToken);
    if (!decoded) {
      throw new AppError(
        'Invalid or expired refresh token',
        HttpStatusCode.UNAUTHORIZED,
        ErrorCode.INVALID_TOKEN
      );
    }

    // Get current user data
    const user = await this.userRepository.findOne({
      where: { id: decoded.id }
    });

    if (!user) {
      throw new AppError(
        'User not found',
        HttpStatusCode.UNAUTHORIZED,
        ErrorCode.USER_NOT_FOUND
      );
    }

    // Generate new tokens
    const tokens = this.generateToken(user);
    
    return {
      ...tokens,
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        role: user.role
      }
    };
  }

  async getUserById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id }
    });

    if (!user) {
      throw new AppError(
        'User not found',
        HttpStatusCode.NOT_FOUND,
        ErrorCode.USER_NOT_FOUND
      );
    }

    return user;
  }
}

export default new AuthService();
