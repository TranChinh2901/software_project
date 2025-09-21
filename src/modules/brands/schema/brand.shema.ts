
import Joi from "joi";

export const CreateBrandSchema = Joi.object({
  name_brand: Joi.string().min(2).required().messages({
    "string.empty": "Brand name is required",
    "string.min": "Brand name must be at least 2 characters long",
    "any.required": "Brand name is required",
  }),
  description_brand: Joi.string().min(10).optional().messages({
    "string.empty": "Description cannot be empty",
    "string.min": "Description  must be at least 10 characters long",
  }),
});