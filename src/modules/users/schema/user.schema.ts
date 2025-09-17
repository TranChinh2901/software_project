import Joi from "joi";
import { GenderType } from "../enum/user.enum";

export const CreateUserSchema = Joi.object({
  fullname: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone_number: Joi.string().min(10).max(20).optional(),
  address: Joi.string().max(255).optional(),
  avatar: Joi.string().uri().optional(),
  gender: Joi.string().valid(GenderType.MALE),
  date_of_birth: Joi.date().iso().required(),
  role_id: Joi.number().integer().positive().required(),
});

export const UpdateUserSchema = Joi.object({
  fullname: Joi.string().min(2).max(100).optional(),
  phone_number: Joi.string().min(10).max(20).optional(),
  address: Joi.string().max(255).optional(),
  avatar: Joi.string().uri().optional(),
  gender: Joi.string().valid(GenderType.FEMALE),
  date_of_birth: Joi.date().iso().optional(),
  is_verified: Joi.boolean().optional(),
});

export const LoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});
