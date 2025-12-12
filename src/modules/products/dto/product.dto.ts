
import { ProductType } from "../enum/product.enum";

export interface CreateProductDto {
  name_product: string;
  price: number;
  origin_price?: number;
  small_description: string;
  meta_description: string;
  image_product?: string;
  status: ProductType,
  stock_quantity: number;
  discount: number;
  category_id: number;
}

export interface UpdateProductDto {
  name_product?: string;
  price?: number;
  origin_price?: number;
  small_description?: string;
  meta_description?: string;
  image_product?: string;
  status?: ProductType,
  stock_quantity?: number;
  discount?: number;
  category_id?: number;
}

export interface ProductResponseDto {
  id: number;
  name_product: string;
  price: number;
  origin_price?: number;
  small_description?: string;
  meta_description?: string;
  image_product?: string;
  status: ProductType,
  stock_quantity?: number;
  discount?: number;
  category: {
    id: number;
    name_category: string;
    brand?: {
      id: number;
      name_brand: string;
    };
  };
  created_at: Date;
  updated_at: Date;
}
