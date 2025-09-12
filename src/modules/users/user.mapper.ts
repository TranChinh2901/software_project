
import { UserResponseDto } from "./dto/user.dto";
import { User } from "./entity/user.entity";

// Map user entity to user response dto
export const toUserResponseDto = (user: User): UserResponseDto => {
  return {
    id: user.id,
    fullname: user.fullname,
    email: user.email,
    phone_number: user.phone_number,
    address: user.address,
    avatar: user.avatar,
    gender: user.gender,
    date_of_birth: user.date_of_birth,
    is_email_verified: user.is_email_verified,
    is_phone_verified: user.is_phone_verified,
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
export const toUserSafeResponseDto = (user: User): Omit<UserResponseDto, 'email' | 'phone_number' | 'address'> => {
  return {
    id: user.id,
    fullname: user.fullname,
    avatar: user.avatar,
    gender: user.gender,
    date_of_birth: user.date_of_birth,
    is_email_verified: user.is_email_verified,
    is_phone_verified: user.is_phone_verified,
    role: user.role ? {
      id: user.role.id,
      name: user.role.name
    } : undefined,
    is_active: user.is_active,
    created_at: user.created_at,
    updated_at: user.updated_at
  };
};