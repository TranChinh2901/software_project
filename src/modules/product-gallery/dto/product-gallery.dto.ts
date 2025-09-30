export interface CreateProductGalleryDto {
  image_url: string[];
  product_id: number;
}

export interface UpdateProductGalleryDto {
  image_url?: string[];
  product_id?: number;
}

export interface ProductGalleryResponseDto {
  id: number;
  image_url: string;
  product_id: number;
  product: {
    id: number;
    name_product: string;
  }
}