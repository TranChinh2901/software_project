import { RoleType } from "@/constants/role-type";

// Input DTO (from req.body)
export interface CreateUserDto {
  fullname: string;
  email: string;
  password: string;
  phone_number?: string;
  address?: string;
  avatar?: string;
  gender: 'male' | 'female';
  date_of_birth: Date;
  role_id: number;
}

export interface UpdateUserDto {
  fullname?: string;
  phone_number?: string;
  address?: string;
  avatar?: string;
  gender?: 'male' | 'female';
  date_of_birth?: Date;
  is_active?: boolean;
}

// Output DTO (for response)
export interface UserResponseDto {
  id: number;
  fullname: string;
  email: string;
  phone_number?: string;
  address?: string;
  avatar?: string;
  gender: string;
  date_of_birth: Date;
  is_verified: boolean;
  role: RoleType; // chỉ là enum
  created_at: Date;
  updated_at: Date;
}