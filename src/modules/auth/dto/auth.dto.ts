export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  fullname: string;
  phone_number?: string;
}

export interface AuthResponseDto {
  user: {
    id: number;
    username: string;
    email: string;
    fullname: string;
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