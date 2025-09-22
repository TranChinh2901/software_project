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
    })
})