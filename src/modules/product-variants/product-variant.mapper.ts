import { ProductVariant } from "./entity/product-variant";
import { ProductVariantResponseDto } from "./dto/product-variant.dto";

export class ProductVariantMapper {
  static toResponseDto(variant: ProductVariant): ProductVariantResponseDto {
    return {
      id: variant.id,
      size: variant.size,
      price: variant.price,
      quantity: variant.quantity,
      product_id: variant.product?.id,
      color: variant.color ? {
        id: variant.color.id,
        name_color: variant.color.name_color
      } : undefined
    };
  }

  static toResponseDtoList(variants: ProductVariant[]): ProductVariantResponseDto[] {
    return variants.map(variant => this.toResponseDto(variant));
  }
}
