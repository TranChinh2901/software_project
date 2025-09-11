import Joi from "joi";

export const CreateProductSchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  description: Joi.string().min(10).required(),
  price: Joi.number().positive().precision(2).required(),
  sale_price: Joi.number().positive().precision(2).optional(),
  stock_quantity: Joi.number().integer().min(0).required(),
  category_id: Joi.number().integer().positive().required(),
  brand_id: Joi.number().integer().positive().required(),
  images: Joi.array().items(Joi.string().uri()).optional(),
  sizes: Joi.array().items(Joi.string().valid('XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL')).optional(),
  colors: Joi.array().items(Joi.string().min(2).max(50)).optional(),
  material: Joi.string().max(100).optional(),
  gender: Joi.string().valid('Nam', 'Nữ', 'Unisex').optional(),
});

export const UpdateProductSchema = Joi.object({
  name: Joi.string().min(2).max(255).optional(),
  description: Joi.string().min(10).optional(),
  price: Joi.number().positive().precision(2).optional(),
  sale_price: Joi.number().positive().precision(2).optional(),
  stock_quantity: Joi.number().integer().min(0).optional(),
  category_id: Joi.number().integer().positive().optional(),
  brand_id: Joi.number().integer().positive().optional(),
  images: Joi.array().items(Joi.string().uri()).optional(),
  sizes: Joi.array().items(Joi.string().valid('XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL')).optional(),
  colors: Joi.array().items(Joi.string().min(2).max(50)).optional(),
  material: Joi.string().max(100).optional(),
  gender: Joi.string().valid('Nam', 'Nữ', 'Unisex').optional(),
  is_active: Joi.boolean().optional(),
});