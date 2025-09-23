import Joi from "joi";

export const CategorySchema = Joi.object({
    name_category: Joi.string().min(2).required().messages({
        "string.empty": "Category name is required",
        "string.min": "Category name must be at least 2 characters long",
        "any.required": "Category name is required",
    }),
    description_category: Joi.string().min(3).optional().messages({
        "string.empty": "Description cannot be empty",
        "string.min": "Description must be at least 3 characters long",
    }),
    brand_id: Joi.number().integer().positive().required().messages({
        "number.base": "Brand ID must be a number",
        "number.integer": "Brand ID must be an integer",
        "number.positive": "Brand ID must be a positive number",
        "any.required": "Brand ID is required",
    })
})