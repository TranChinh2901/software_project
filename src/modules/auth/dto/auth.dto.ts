import { GenderType } from "@/modules/users/enum/user.enum";
import { RoleType } from "../enum/auth.enum";

export interface CreateUserDto {
  fullname: string;
  email: string;
  password: string;
  phone_number?: string;
  address?: string;
  gender: GenderType;
  date_of_birth: Date;
  role_id: RoleType;
}

// Output DTO (for response)
export interface UserResponseDto {
  id: number;
  fullname: string;
  gender: GenderType;
  createdAt?: Date; 
}

export interface UpdateProfileDto {
  fullname?: string;
  phone_number?: string;
  address?: string;
  gender?: GenderType;
  date_of_birth?: Date;
  avatar?: string;
}