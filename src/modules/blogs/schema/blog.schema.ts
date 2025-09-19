import Joi from "joi";
export const CreateBlogSchema = Joi.object({
  title: Joi.string().min(2).required().messages({
    "string.empty": "Title is required",
    "string.min": "Title must be at least 2 characters long",
    "any.required": "Title is required",
  }),
  content: Joi.string().min(10).required().messages({
    "string.empty": "Content is required",
    "string.min": "Content must be at least 10 characters long",
    "any.required": "Content is required",
  }),
  image_blogs: Joi.string().uri().optional().messages({
    "string.uri": "Image must be a valid URI",
  }),
  status: Joi.string().valid("draft", "published").required().messages({
    "any.only": "Status must be either draft or published",
    "any.required": "Status is required",
  }),
  author_id: Joi.number().integer().required().messages({
    "number.base": "Author ID must be a number",
    "any.required": "Author ID is required",
  }),
});

export const UpdateBlogSchema = Joi.object({
  title: Joi.string().min(2).optional().messages({
    "string.min": "Title must be at least 2 characters long",
  }),
  content: Joi.string().min(10).optional().messages({
    "string.min": "Content must be at least 10 characters long",
  }),
  image_blogs: Joi.string().uri().optional().messages({
    "string.uri": "Image must be a valid URI",
  }),
  status: Joi.string().valid("draft", "published").optional().messages({
    "any.only": "Status must be either draft or published",
  }),
  author_id: Joi.number().integer().optional().messages({
    "number.base": "Author ID must be a number",
  }),
});
