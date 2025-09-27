import { ProductType } from './enum/product.enum';
import { ProductResponseDto } from "./dto/product.dto";
import { Product } from "./entity/product.entity";

export class ProductMapper {
    static toProductResponseDto(product: Product): ProductResponseDto {
        return {
            id: product.id,
            name_product: product.name_product,
            price: product.price,
            origin_price: product.origin_price,
            small_description: product.small_description ?? undefined,
            meta_description: product.meta_description ?? undefined,
            image_product: product.image_product,
            status: product.status,
            stock_quantity: product.stock_quantity ?? undefined,
            category: product.category ? {
                id: product.category.id,
                name_category: product.category.name_category,
            } : { id: 0, name_category: '' },
            brand: product.brand ? {
                id: product.brand.id,
                name_brand: product.brand.name_brand,
            } : undefined,
            created_at: product.created_at,
            updated_at: product.updated_at,
        };
    }
    static toProductResponseDtoList(products: Product[]): ProductResponseDto[] {
        return products.map((product) => ProductMapper.toProductResponseDto(product));
    }
}