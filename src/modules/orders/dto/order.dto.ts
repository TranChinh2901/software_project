export interface CreateOrderDto {
  user_id: number;
  items: OrderItemDto[];
  shipping_address_id: number;
  voucher_id?: number;
  note?: string;
  payment_method: string;
}

export interface OrderItemDto {
  product_id: number;
  quantity: number;
  price: number;
}

export interface UpdateOrderDto {
  status?: string;
  note?: string;
}

export interface OrderResponseDto {
  id: number;
  user_id: number;
  total_amount: number;
  note?: string;
  status: string;
  cancel_reason?: string;
  payment_method: string;
  payment_status: string;
  created_at: Date;
  updated_at: Date;
}

export interface OrderDetailResponseDto extends OrderResponseDto {
  order_items: OrderItemResponseDto[];
  user: {
    id: number;
    full_name: string;
    email: string;
  } | null;
  shipping_address: {
    id: number;
    address: string;
    phone: string;
  } | null;
}

export interface OrderItemResponseDto {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  product?: {
    id: number;
    name_product: string;
    image_product?: string;
  };
}
