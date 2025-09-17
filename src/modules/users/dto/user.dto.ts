import { RoleType } from "@/modules/auth/enum/auth.enum";
import { GenderType } from "../enum/user.enum";


// Input DTO (from req.body)
export interface CreateUserDto {
  fullname: string;
  email: string;
  password: string;
  phone_number?: string;
  address?: string;
  avatar?: string;
  gender: GenderType;
  date_of_birth: Date;
  role: RoleType;
}

export interface UpdateUserDto {
  fullname?: string;
  phone_number?: string;
  address?: string;
  avatar?: string;
  gender?: GenderType;
  date_of_birth?: Date;
}

export interface UserResponseDto {
  id: number;
  fullname: string;
  email: string;
  phone_number?: string;
  address?: string;
  avatar?: string;
  gender: GenderType;
  date_of_birth: Date;
  is_verified: boolean;
  role: RoleType; 
  created_at: Date;
  updated_at: Date;
}