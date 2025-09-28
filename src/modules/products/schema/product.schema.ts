// import Joi from "joi";
// import { ProductType } from "../enum/product.enum";

// export const CreateProductSchema = Joi.object({
//   name_product: Joi.string().min(2).max(255).required().messages({
//     "string.base": "Product name must be a string",
//     "string.empty": "Product name is required",
//     "string.min": "Product name must be at least 2 characters long",
//     "any.required": "Product name is required",
//   }),

//   price: Joi.number().positive().precision(2).required().messages({
//     "number.base": "Price must be a number",
//     "number.positive": "Price must be greater than 0",
//     "any.required": "Price is required",
//   }),

//   origin_price: Joi.number().positive().precision(2).optional().messages({
//     "number.base": "Original price must be a number",
//     "number.positive": "Original price must be greater than 0",
//   }),

//   small_description: Joi.string().min(10).required().messages({
//     "string.empty": "Short description is required",
//     "string.min": "Short description must be at least 10 characters long",
//   }),

//   meta_description: Joi.string().min(10).required().messages({
//     "string.empty": "Meta description is required",
//     "string.min": "Meta description must be at least 10 characters long",
//   }),

//   image_product: Joi.string().uri().optional().messages({
//     "string.uri": "Product image must be a valid URL",
//   }),

//   status: Joi.string()
//     .valid(...Object.values(ProductType))
//     .default(ProductType.ACTIVE)
//     .optional()
//     .messages({
//       "any.only": `Status must be one of: ${Object.values(ProductType).join(", ")}`,
//     }),

//   stock_quantity: Joi.number().integer().min(0).required().messages({
//     "number.base": "Stock quantity must be a number",
//     "number.integer": "Stock quantity must be an integer",
//     "number.min": "Stock quantity cannot be negative",
//     "any.required": "Stock quantity is required",
//   }),
// });


// export const UpdateProductSchema = Joi.object({

// });