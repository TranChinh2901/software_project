import { ProductGalleryResponseDto } from "./dto/product-gallery.dto";
import { ProductGallery } from "./entity/product-gallery.entity";

export class ProductGalleryMapper {
    static toProductGalleryResponseDto(productGallery: ProductGallery): ProductGalleryResponseDto {
        return {
           id: productGallery.id,
            image_url: productGallery.image_url,
            product_id: productGallery.product.id,
           product: {
               id: productGallery.product.id,
               name_product: productGallery.product.name_product,
           }
        }; 
    }
    static toProductGalleryResponseDtoList(productGalleries: ProductGallery[]): ProductGalleryResponseDto[] {
        return productGalleries.map((productGallery) => ProductGalleryMapper.toProductGalleryResponseDto(productGallery));
    }
}
