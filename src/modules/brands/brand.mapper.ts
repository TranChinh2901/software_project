import { BrandResponseDto } from "./dto/brand.dto";
import { Brand } from "./entity/brand.entity";

export class BrandMapper {
  static toBrandResponseDto(brand: Brand): BrandResponseDto {
    return {
    id: brand.id,
    name_brand: brand.name_brand,
    logo_url: brand.logo_url,
    is_deleted: brand.is_deleted,
    created_at: brand.created_at,
    updated_at: brand.updated_at
};
  }

  static toBrandResponseDtoList(brands: Brand[]): BrandResponseDto[] {
    return brands.map((brand) => BrandMapper.toBrandResponseDto(brand));
  }
}
