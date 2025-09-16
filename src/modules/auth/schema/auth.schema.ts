import Joi from "joi";
import { RoleType } from '@/constants/role-type';

export const LoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const RegisterSchema = Joi.object({
  fullname: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string()
    .valid(...Object.values(RoleType))
    .default(RoleType.USER)
    .optional(),
});

export const RefreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});