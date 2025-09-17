import { GenderType } from "@/modules/users/enum/user.enum";
import Joi from "joi";
import { RoleType } from "../enum/auth.enum";

export const LoginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
});

