import Joi from 'joi';

export const CreateColorSchema = Joi.object({
  name_color: Joi.string().min(1).max(50).required().messages({
    'string.base': 'Color name must be a string',
    'string.empty': 'Color name is required',
    'string.max': 'Color name is too long',
    'any.required': 'Color name is required',
  }),
    product_id: Joi.number().integer().required().messages({
    'number.base': 'Product ID must be a number',
    'number.integer': 'Product ID must be an integer',
    'any.required': 'Product ID is required',
  }),
});

// export const UpdateColorSchema = Joi.object({
//   name_color: Joi.string().min(1).max(50).optional().messages({
//     'string.base': 'Color name must be a string',
//     'string.max': 'Color name is too long',
//   }),
//     });
