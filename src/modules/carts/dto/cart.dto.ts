export interface AddItemToCartDto {
  product_variant_id: number;
  quantity: number;
}

export interface UpdateCartItemDto {
  quantity: number;
}

export interface CartItemResponseDto {
  id: number;
  quantity: number;
  product_variant: {
    id: number;
    size: string;
    price: number;
    quantity: number;
    product: {
      id: number;
      name_product: string;
      image_product?: string;
    };
    color?: {
      id: number;
      name_color: string;
    };
  };
}

export interface CartResponseDto {
  id: number;
  user_id: number;
  items: CartItemResponseDto[];
  created_at: Date;
}
