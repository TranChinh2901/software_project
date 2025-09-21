import Joi from "joi";

export const CreateBlogSchema = Joi.object({
  title: Joi.string().min(2).required().messages({
    "string.empty": "Title is required",
    "string.min": "Title must be at least 2 characters long",
    "any.required": "Title is required",
  }),
  content: Joi.string().min(10).optional().messages({
    "string.empty": "Content cannot be empty  ",
    "string.min": "Content must be at least 10 characters long",
  }),
  status: Joi.string().valid("active", "inactive").optional().default("active").messages({
    "any.only": "Status must be either active or inactive",
  }),
});

export const UpdateBlogSchema = Joi.object({
  title: Joi.string().min(2).optional().messages({
    "string.min": "Title must be at least 2 characters long",
  }),
  content: Joi.string().min(10).optional().messages({
    "string.min": "Content must be at least 10 characters long",
  }),

  status: Joi.string().valid("active", "inactive").optional().messages({
    "any.only": "Status must be either active or inactive",
  }),
});