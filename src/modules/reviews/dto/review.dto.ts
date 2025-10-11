
export interface CreateReviewDto {
    rating: number; 
    comment?: string;
    user_id: number;
    product_id: number;
}

export interface UpdateReviewDto {
    rating?: number; 
    comment?: string;
}

export interface ReviewResponseDto {
  id: number;
  rating: number;
  comment?: string;
  created_at: Date;
  
  user: {
    id: number;
    fullname: string;
    avatar?: string;
  };
  
  product: {
    id: number;
    name_product: string;
    image_product?: string;
  };
}
