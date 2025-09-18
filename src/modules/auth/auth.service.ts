import { Repository } from "typeorm";
import { compare, hash } from "bcryptjs";

import { AppDataSource } from "@/config/database.config";
import { AppError } from "@/common/error.response";
import { HttpStatusCode } from "@/constants/status-code";
import { ErrorCode } from "@/constants/error-code";
import { User } from "@/modules/users/entity/user.entity";
import { JwtUtils } from "@/utils/jwt.util";
import { GenderType } from "../users/enum/user.enum";
import { RoleType } from "./enum/auth.enum";
import { LoginDto } from "./dto/login.dto";
import { SignupDto } from "./dto/signup.dto";
import { ErrorMessages, SuccessMessages } from "@/constants/message";
import { UpdateProfileDto } from "./dto/auth.dto";

export class AuthService {
  private userRepository: Repository<User>;
  private readonly SALT_ROUNDS: number;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
    this.SALT_ROUNDS = 10;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({
      where: { email, is_deleted: false }
    });

    if (!user) {
      throw new AppError(
        ErrorMessages.AUTH.INVALID_CREDENTIALS,
        HttpStatusCode.UNAUTHORIZED,
        ErrorCode.UNAUTHORIZED
      );
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError(
        ErrorMessages.AUTH.INVALID_CREDENTIALS,
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

  async register(registerData: SignupDto) {
    const { fullname, email, password, phone_number, address, gender, date_of_birth, role } = registerData;
    
    const existingUser = await this.userRepository.findOne({
      where: [
        { email },
        { phone_number }
      ]
    });

    if (existingUser) {
      throw new AppError(
        ErrorMessages.USER.ALL_ALREADY_EXISTS,
        HttpStatusCode.CONFLICT,
        ErrorCode.EMAIL_ALREADY_EXISTS,
        { email, phone_number }
      );
    }

    const hashedPassword = await hash(password, this.SALT_ROUNDS);
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
        ErrorMessages.AUTH.INVALID_TOKEN,
        HttpStatusCode.UNAUTHORIZED,
        ErrorCode.INVALID_TOKEN
      );
    }

    const user = await this.userRepository.findOne({
      where: { id: decoded.id }
    });

    if (!user) {
      throw new AppError(
        ErrorMessages.USER.USER_NOT_FOUND,
        HttpStatusCode.UNAUTHORIZED,
        ErrorCode.USER_NOT_FOUND
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

  async getUserById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id, is_deleted: false }
    });

    if (!user) {
      throw new AppError(
        ErrorMessages.USER.USER_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
        ErrorCode.USER_NOT_FOUND
      );
    }

    return {
       id: user.id,
    fullname: user.fullname,
    email: user.email,
    phone_number: user.phone_number,
    address: user.address,
    avatar: user.avatar,
    gender: user.gender,
    date_of_birth: user.date_of_birth,
    is_verified: user.is_verified,
    role: user.role,
    created_at: user.created_at,
    updated_at: user.updated_at
    };
  }




  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto) {
    const user = await this.userRepository.findOne({
      where: { id: userId, is_deleted: false }
    });

    if (!user) {
      throw new AppError(
        ErrorMessages.USER.USER_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
        ErrorCode.USER_NOT_FOUND
      );
    }

    // Check if phone number is being updated and already exists
    if (updateProfileDto.phone_number && updateProfileDto.phone_number !== user.phone_number) {
      const existingUser = await this.userRepository.findOne({
        where: { phone_number: updateProfileDto.phone_number, is_deleted: false }
      });

      if (existingUser) {
        throw new AppError(
          "Phone number already exists",
          HttpStatusCode.CONFLICT,
          ErrorCode.EMAIL_ALREADY_EXISTS
        );
      }
    }

    await this.userRepository.update(userId, updateProfileDto);

    const updatedUser = await this.userRepository.findOne({
      where: { id: userId }
    });

    return {
      id: updatedUser!.id,
      fullname: updatedUser!.fullname,
      email: updatedUser!.email,
      phone_number: updatedUser!.phone_number,
      address: updatedUser!.address,
      gender: updatedUser!.gender,
      date_of_birth: updatedUser!.date_of_birth,
      avatar: updatedUser!.avatar,
      role: updatedUser!.role
    };
  }


  async deleteAccount(userId: number) {
  const user = await this.userRepository.findOne({
    where: { id: userId, is_deleted: false }
  });
  
  if (!user) {
    throw new AppError(
      ErrorMessages.USER.USER_NOT_FOUND,
      HttpStatusCode.NOT_FOUND,
      ErrorCode.USER_NOT_FOUND
    );
  }

  // Hard delete - xóa hoàn toàn khỏi database
  await this.userRepository.remove(user);
  
  return { 
    message: SuccessMessages.USER.USER_DELETED
  };
}
}

export default new AuthService();