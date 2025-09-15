export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  fullname: string;
  email: string;
  password: string;
  phone_number?: string;
  address?: string;
  gender: 'male' | 'female';
  date_of_birth: Date;
  role_id: number;
}

export interface AuthResponseDto {
  user: {
    id: number;
    fullname: string;
    email: string;
    phone_number?: string;
    is_verified: boolean;
    role: {
      id: number;
      name: string;
    };
  };
  access_token: string;
  refresh_token?: string;
}

export interface RefreshTokenDto {
  refresh_token: string;
}
