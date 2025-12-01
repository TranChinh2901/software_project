import { Repository } from "typeorm";
import { ProductGallery } from "./entity/product-gallery.entity";
import { Product } from "../products/entity/product.entity";
import { AppDataSource } from "@/config/database.config";
import { CreateProductGalleryDto, ProductGalleryResponseDto, ProductGalleryGroupedResponseDto } from "./dto/product-gallery.dto";
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

async getAllProductGalleries(): Promise<ProductGalleryResponseDto[]> {
    try {
    const galleries = await this.productGalleryRespository.find({
      relations: ["product"]
    });

    // Return individual gallery objects instead of grouped format
    // This preserves the unique ID for each image
    return ProductGalleryMapper.toProductGalleryResponseDtoList(galleries);
    } catch (error) {
        throw new AppError(
            ErrorMessages.PRODUCT_GALLERY.FAILED_TO_FETCH_GALLERY,
            HttpStatusCode.INTERNAL_SERVER_ERROR,
            ErrorCode.SERVER_ERROR,
        )
    }
}
async deleteProductGallery(id: number): Promise<void> {
    try {
        const gallery = await this.productGalleryRespository.findOne({
            where: { id }
        })
        if(!gallery) {
            throw new AppError(
                ErrorMessages.PRODUCT_GALLERY.PRODUCT_GALLERY_NOT_FOUND,
                HttpStatusCode.NOT_FOUND,
                ErrorCode.PRODUCT_GALLERY_NOT_FOUND
            )
        }
  await this.productGalleryRespository.remove(gallery);
  return;
    } catch (error) {
        throw new AppError(
            ErrorMessages.PRODUCT_GALLERY.FAILED_DELETE_GALLERY,
            HttpStatusCode.INTERNAL_SERVER_ERROR,
            ErrorCode.SERVER_ERROR
        )
    }
}
}

export default new ProductGalleryService();