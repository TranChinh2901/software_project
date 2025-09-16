import { Repository } from "typeorm";
import { sign, verify } from "jsonwebtoken";
import { compare, hash } from "bcryptjs";

import { AppDataSource } from "@/config/database.config";
import { AppError } from "@/common/error.response";
import { HttpStatusCode } from "@/constants/status-code";
import { ErrorCode } from "@/constants/error-code";
import { RoleType } from "@/constants/role-type";
import { GenderType } from "@/constants/gender-type";
import { User } from "@/modules/users/entity/user.entity";

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
      where: { id, is_deleted: false }
    });
  }
}

export default new AuthService();
