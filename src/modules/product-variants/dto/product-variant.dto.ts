import { SizeType } from "../enum/product-variant.enum";

export interface CreateProductVariantDto {
  product_id: number;
  color_id?: number;
  size?: SizeType;
  price: number;
  quantity: number;
}

export interface UpdateProductVariantDto {
  color_id?: number;
  size?: SizeType;
  price?: number;
  quantity?: number;
}

export interface ProductVariantResponseDto {
  id: number;
  size?: SizeType;
  price: number;
  quantity: number;
  product_id: number;
  color?: {
    id: number;
    name_color: string;
  };
}
