import Joi from "joi";

export const CreateUserSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
  fullname: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phone_number: Joi.string().min(10).max(20).optional(),
  role_id: Joi.number().integer().positive().required(),
  avatar: Joi.string().uri().optional(),
});

export const UpdateUserSchema = Joi.object({
  username: Joi.string().min(3).max(30).optional(),
  fullname: Joi.string().min(2).max(100).optional(),
  phone_number: Joi.string().min(10).max(20).optional(),
  avatar: Joi.string().uri().optional(),
  is_active: Joi.boolean().optional(),
});

export const LoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});
