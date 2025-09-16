import Joi from "joi";
import { RoleType } from '@/constants/role-type';
import { GenderType } from '@/constants/gender-type';

export const LoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const RegisterSchema = Joi.object({
  fullname: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone_number: Joi.string().min(10).max(20).required(),
  address: Joi.string().max(255).optional(),
  gender: Joi.string()
    .valid(...Object.values(GenderType))
    .required()
    .messages({
      'any.only': `Gender must be one of: ${Object.values(GenderType).join(', ')}`
    }),
  date_of_birth: Joi.date().iso().optional(),
  role: Joi.string()
    .valid(...Object.values(RoleType))
    .default(RoleType.USER)
    .optional(),
});

export const RefreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});