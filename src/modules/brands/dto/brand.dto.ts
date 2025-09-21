
export interface CreateBrandDto {
  name_brand?: string;
  logo_url?: string;
  description_brand?: string;

}

export interface UpdateBrandDto {
  name_brand?: string;
  logo_url?: string;
  description_brand?: string;
  is_deleted?: boolean;
}


export interface BrandResponseDto {
  id: number;
  name_brand: string;
  logo_url?: string;
  description_brand?: string;
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date;
}