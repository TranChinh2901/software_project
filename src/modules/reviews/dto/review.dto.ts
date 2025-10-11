
export interface CreateReviewDto {
    rating: number;
    comment?: string;
    user_id: number;
    product_id: number;
}

export interface UpdateReviewDto {
    rating?: number;
    comment?: string;
    user_id?: number;
    product_id?: number;
}

export interface ReviewResponseDto {
  id: number;
  rating: number;
  comment?: string;
  user_id: number;
  product_id: number;

  product?: {
    id: number;
    name_product: string;
  };
}
