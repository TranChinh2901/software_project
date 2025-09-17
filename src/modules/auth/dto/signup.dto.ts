import { GenderType } from "@/modules/users/enum/user.enum";
import { RoleType } from "../enum/auth.enum";



export interface SignupDto {
  fullname: string;
  email: string;
  password: string;
  phone_number?: string;
  address?: string;
  gender: GenderType;
  date_of_birth: Date;
  role_id: number;

}

export interface SignupResponseDto {
  fullname: string;
  email: string;
  role: RoleType;
}