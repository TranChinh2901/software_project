import { Repository } from "typeorm";
import { sign, verify } from "jsonwebtoken";
import { compare, hash } from "bcryptjs";

import { AppDataSource } from "@/config/database.config";
import { AppError } from "@/common/error.response";
import { HttpStatusCode } from "@/constants/status-code";
import { ErrorCode } from "@/constants/error-code";
import { RoleType } from "@/constants/role-type";
import { User } from "@/modules/users/entity/user.entity";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  fullname: string;
  email: string;
  password: string;
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
      where: { email, is_deleted: 0 }
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

    const token = this.generateToken(user);
    
    return {
      accessToken: token,
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        role: user.role
      }
    };
  }

  async register(registerData: RegisterData) {
    const { email, password, ...userData } = registerData;

    // Check if email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email, is_deleted: 0 }
    });

    if (existingUser) {
      throw new AppError(
        "Email already exists",
        HttpStatusCode.CONFLICT,
        ErrorCode.EMAIL_ALREADY_EXISTS
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create new user
    const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
      role: registerData.role || RoleType.USER,
      ...userData
    });

    const savedUser = await this.userRepository.save(newUser);

    const token = this.generateToken(savedUser);
    
    return {
      accessToken: token,
      user: {
        id: savedUser.id,
        fullname: savedUser.fullname,
        email: savedUser.email,
        role: savedUser.role
      }
    };
  }

  generateToken(user: User): string {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    return sign(payload, this.JWT_SECRET, { expiresIn: "7d" });
  }

  verifyToken(token: string) {
    try {
      return verify(token, this.JWT_SECRET) as {
        id: number;
        email: string;
        role: string;
      };
    } catch (error) {
      return null;
    }
  }

  async getUserById(id: number): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id, is_deleted: 0 }
    });
  }
}

export default new AuthService();
