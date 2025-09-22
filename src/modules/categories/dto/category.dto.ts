export interface CreateCategoryDto {
    name_category: string;
    image_category?: string;
    description_category?: string;
}

export interface UpdateCategoryDto {
    name_category?: string;
    image_category?: string;
    description_category?: string;
}

export interface CategoryResponseDto {
    id: number;
    name_category: string;
    image_category?: string;
    description_category?: string;
    updated_at: Date;
}