import Joi from "joi";
import { ProductType } from "../enum/product.enum";

export const CreateProductSchema = Joi.object({
  name_product: Joi.string().min(2).max(255).required().messages({}),
  price: Joi.number().positive().precision(2).required(),
  origin_price: Joi.number().positive().precision(2).optional(),
  small_description: Joi.string().min(10).required(),
  meta_description: Joi.string().min(10).required(),
  image_product: Joi.string().uri().optional(),
  status: Joi.string()
    .valid(...Object.values(ProductType))
    .default(ProductType.ACTIVE)
    .optional(),
  stock_quantity: Joi.number().integer().min(0).required(),
  category_id: Joi.number().integer().positive().required(),
  brand_id: Joi.number().integer().positive().required(),
}
);

export const UpdateProductSchema = Joi.object({

});