// import { Product } from "./entity/product.entity";
// import { ProductResponseDto } from "./dto/product.dto";
// import { formatDateTime } from "@/helpers/format-datetime";

// export class ProductMapper {
//   static toDto(product: Product): ProductResponseDto {
//     return {
//       id: product.id,
//       name: product.name_product,
//       description: product.meta_description || '',
//       price: product.price,
//       sale_price: product.origin_price,
//       stock_quantity: product.stock_quantity || 0,
//       category: {
//         id: product.category.id,
//         name: product.category.name_category
//       },
//       brand: {
//         id: product.brand?.id || 0,
//         name: product.brand?.name_brand || ''
//       },
//       is_active: product.status === 'active',
//       createdAt: formatDateTime(product.created_at),
//       updatedAt: formatDateTime(product.updated_at),
//       material: product.small_description,
//       gender: undefined,
//       images: [],
//       sizes: [],
//       colors: []
//     };
//   }

//   static toEntity(dto: Partial<ProductResponseDto>): Partial<Product> {
//     return {
//       name_product: dto.name,
//       meta_description: dto.description,
//       price: dto.price || 0,
//       origin_price: dto.sale_price,
//       stock_quantity: dto.stock_quantity,
//       small_description: dto.material,
//       is_deleted: false
//     };
//   }

//   static toDtoArray(products: Product[]): ProductResponseDto[] {
//     return products.map(product => this.toDto(product));
//   }
// }