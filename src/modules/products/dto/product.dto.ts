import { Product } from "@/modules/products/entity/product.entity";

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  sale_price?: number;
  stock_quantity: number;
  category_id: number;
  brand_id: number;
  images?: string[];
  sizes?: string[];
  colors?: string[];
  material?: string;
  gender?: string;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  sale_price?: number;
  stock_quantity?: number;
  category_id?: number;
  brand_id?: number;
  images?: string[];
  sizes?: string[];
  colors?: string[];
  material?: string;
  gender?: string;
  is_active?: boolean;
}

export interface ProductResponseDto {
  id: number;
  name: string;
  description: string;
  price: number;
  sale_price?: number;
  stock_quantity: number;
  images?: string[];
  sizes?: string[];
  colors?: string[];
  material?: string;
  gender?: string;
  category: {
    id: number;
    name: string;
  };
  brand: {
    id: number;
    name: string;
  };
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}
