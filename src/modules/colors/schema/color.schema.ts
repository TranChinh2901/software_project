import Joi from 'joi';

export const CreateColorSchema = Joi.object({
  name_color: Joi.string().min(1).max(50).required().messages({
    'string.base': 'Color name must be a string',
    'string.empty': 'Color name is required',
    'string.max': 'Color name is too long',
    'any.required': 'Color name is required',
  }),
  hex_code: Joi.string().pattern(/^#[0-9A-F]{6}$/i).optional().messages({
    'string.pattern.base': 'Hex code must be a valid color code (e.g., #FF5733)',
  }),
});

export const UpdateColorSchema = Joi.object({
  name_color: Joi.string().min(1).max(50).optional().messages({
    'string.base': 'Color name must be a string',
    'string.max': 'Color name is too long',
  }),
  hex_code: Joi.string().pattern(/^#[0-9A-F]{6}$/i).optional().messages({
    'string.pattern.base': 'Hex code must be a valid color code (e.g., #FF5733)',
  }),
});
