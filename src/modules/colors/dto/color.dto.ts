export interface CreateColorDto {
  name_color: string;
  product_id?: number;
}

export interface UpdateColorDto {
  name_color?: string;
  product_id?: number;
}

export interface ColorResponseDto {
  id: number;
  name_color: string;
  product_id?: number | null;
  product?: {
    id?: number ;
    name?: string;
  } ;
}
