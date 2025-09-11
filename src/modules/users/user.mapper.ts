
import { UserResponseDto } from "./dto/user.dto";
import { User } from "./entity/user.entity";

// Map user entity to user response dto
export const toUserResponseDto = (user: User): UserResponseDto => {
  return {
    id: user.id,
    username: user.username,
    fullname: user.fullname,
    email: user.email,
    phone_number: user.phone_number,
    avatar: user.avatar,
    role: user.role ? {
      id: user.role.id,
      name: user.role.name
    } : undefined,
    is_active: user.is_active,
    created_at: user.created_at,
    updated_at: user.updated_at
  };
};

// Map user entity to safe response (without sensitive info)
export const toUserSafeResponseDto = (user: User): Omit<UserResponseDto, 'email' | 'phone_number'> => {
  return {
    id: user.id,
    username: user.username,
    fullname: user.fullname,
    avatar: user.avatar,
    role: user.role ? {
      id: user.role.id,
      name: user.role.name
    } : undefined,
    is_active: user.is_active,
    created_at: user.created_at,
    updated_at: user.updated_at
  };
};