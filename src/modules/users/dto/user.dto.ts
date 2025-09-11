// Input DTO (from req.body)
export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  fullname: string;
  phone_number?: string;
  role_id: number;
  avatar?: string;
}

export interface UpdateUserDto {
  username?: string;
  fullname?: string;
  phone_number?: string;
  avatar?: string;
  is_active?: boolean;
}

// Output DTO (for response)
export interface UserResponseDto {
  id: number;
  username: string;
  fullname: string;
  email: string;
  phone_number?: string;
  avatar?: string;
  role?: {
    id: number;
    name: string;
  };
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}