import { Repository } from "typeorm";
import { ProductGallery } from "./entity/product-gallery.entity";
import { Product } from "../products/entity/product.entity";
import { AppDataSource } from "@/config/database.config";
import { CreateProductGalleryDto, ProductGalleryResponseDto } from "./dto/product-gallery.dto";
import { AppError } from "@/common/error.response";
import { ErrorMessages } from "@/constants/message";
import { HttpStatusCode } from "@/constants/status-code";
import { ErrorCode } from "@/constants/error-code";
import { ProductGalleryMapper } from "./product-gallery.mapper";

export class ProductGalleryService {
    private productGalleryRespository: Repository<ProductGallery>;
    private productResponsitory: Repository<Product>;

    constructor() {
        this.productGalleryRespository = AppDataSource.getRepository(ProductGallery);
        this.productResponsitory = AppDataSource.getRepository(Product);
    }

   async addNewImagesToProduct(dto: CreateProductGalleryDto): Promise<ProductGalleryResponseDto[]> {
  const product = await this.productResponsitory.findOne({
    where: { id: dto.product_id }
  });
  if (!product) {
    throw new AppError(
      ErrorMessages.PRODUCT.PRODUCT_NOT_FOUND,
      HttpStatusCode.NOT_FOUND,
      ErrorCode.PRODUCT_NOT_FOUND
    );
  }

  const newGalleries = dto.image_url.map(url => {
    const gallery = this.productGalleryRespository.create({
      image_url: url,
      product: product
    });
    return gallery;
  });

  const savedGalleries = await this.productGalleryRespository.save(newGalleries);

  return ProductGalleryMapper.toProductGalleryResponseDtoList(savedGalleries);
}

}

export default new ProductGalleryService();