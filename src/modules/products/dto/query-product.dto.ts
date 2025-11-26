export interface QueryProductDto {
  search?: string;
  category_id?: number;
  brand_id?: number;
  min_price?: number;
  max_price?: number;
  sort?: 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc';
  page?: number;
  limit?: number;
  featured?: boolean;
  status?: string;
  is_on_sale?: boolean;
}

export interface ProductListResponseDto {
  products: any[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
