import Joi from "joi";

export const LoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const RegisterSchema = Joi.object({
  fullname: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone_number: Joi.string().min(10).max(20).optional(),
  address: Joi.string().max(255).optional(),
  gender: Joi.string().valid('male', 'female').required(),
  date_of_birth: Joi.date().iso().required(),
  role_id: Joi.number().integer().positive().required(),
});

export const RefreshTokenSchema = Joi.object({
  refresh_token: Joi.string().required(),
});