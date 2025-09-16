import { AppDataSource } from "@/config/database.config";
import { Repository } from "typeorm";
import { User } from "./entity/user.entity";
import { CreateUserDto, UpdateUserDto } from "./dto/user.dto";
import { AppError } from "@/common/error.response";
import { ErrorMessages } from "@/constants/message";
import { HttpStatusCode } from "@/constants/status-code";
import { ErrorCode } from "@/constants/error-code";
import * as bcrypt from "bcryptjs";

class UserService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  async getAll(): Promise<User[]> {
    return await this.userRepository.find({
      // relations: ['role'],
      where: { is_deleted: false }
    });
  }

  async getById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id, is_deleted: false },
      // relations: ['role']
    });

    if (!user) {
      throw new AppError(
        ErrorMessages.USER_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
        ErrorCode.USER_NOT_FOUND
      );
    }

    return user;
  }

  async getByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email, is_deleted: false },
      // relations: ['role']
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if email already exists
    const existingUserByEmail = await this.getByEmail(createUserDto.email);
    if (existingUserByEmail) {
      throw new AppError(
        ErrorMessages.EMAIL_ALREADY_EXISTS,
        HttpStatusCode.CONFLICT,
        ErrorCode.EMAIL_ALREADY_EXISTS
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create new user
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword
    });

    const savedUser = await this.userRepository.save(newUser);
    
    // Return user with role
    return await this.getById(savedUser.id);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.getById(id);

    // Update user fields
    Object.assign(user, updateUserDto);

    await this.userRepository.save(user);
    
    // Return updated user with role
    return await this.getById(id);
  }

  async delete(id: number): Promise<void> {
    const user = await this.getById(id);
    
    // Soft delete
    user.is_deleted = true;
    await this.userRepository.save(user);
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return await bcrypt.compare(password, user.password);
  }
}

export const userService = new UserService();
