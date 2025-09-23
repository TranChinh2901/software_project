export interface CreateCategoryDto {
    name_category: string;
    image_category?: string;
    description_category?: string;
    brand_id: number;
}

export interface UpdateCategoryDto {
    name_category?: string;
    image_category?: string;
    description_category?: string;
    brand_id?: number;
}

export interface CategoryResponseDto {
    id: number;
    name_category: string;
    image_category?: string;
    description_category?: string;
    updated_at: Date;
    brand_id: number;
    brand: {
        id: number;
        name_brand: string;
        logo_url?: string;
        description_brand?: string;
    };
}