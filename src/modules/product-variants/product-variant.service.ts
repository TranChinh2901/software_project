import { Repository } from "typeorm";
import { ProductVariant } from "./entity/product-variant";
import { Product } from "../products/entity/product.entity";
import { Color } from "../colors/entity/color.entity";
import { AppDataSource } from "@/config/database.config";
import { CreateProductVariantDto, UpdateProductVariantDto, ProductVariantResponseDto } from "./dto/product-variant.dto";
import { AppError } from "@/common/error.response";
import { ErrorMessages } from "@/constants/message";
import { HttpStatusCode } from "@/constants/status-code";
import { ErrorCode } from "@/constants/error-code";
import { ProductVariantMapper } from "./product-variant.mapper";

export class ProductVariantService {
  private variantRepository: Repository<ProductVariant>;
  private productRepository: Repository<Product>;
  private colorRepository: Repository<Color>;

  constructor() {
    this.variantRepository = AppDataSource.getRepository(ProductVariant);
    this.productRepository = AppDataSource.getRepository(Product);
    this.colorRepository = AppDataSource.getRepository(Color);
  }

  async createVariant(dto: CreateProductVariantDto): Promise<ProductVariantResponseDto> {
    // Verify product exists
    const product = await this.productRepository.findOne({
      where: { id: dto.product_id }
    });
    if (!product) {
      throw new AppError(
        ErrorMessages.PRODUCT.PRODUCT_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
        ErrorCode.PRODUCT_NOT_FOUND
      );
    }

    // Verify color exists if provided
    let color: Color | undefined;
    if (dto.color_id) {
      const foundColor = await this.colorRepository.findOne({
        where: { id: dto.color_id }
      });
      if (!foundColor) {
        throw new AppError(
          "Color not found",
          HttpStatusCode.NOT_FOUND,
          ErrorCode.COLOR_NOT_FOUND
        );
      }
      color = foundColor;
    }

    // Create variant
    const variant = this.variantRepository.create({
      product: product,
      color: color,
      size: dto.size,
      price: dto.price,
      quantity: dto.quantity
    });

    const savedVariant = await this.variantRepository.save(variant);

    // Load relations for response
    const variantWithRelations = await this.variantRepository.findOne({
      where: { id: savedVariant.id },
      relations: ['product', 'color']
    });

    return ProductVariantMapper.toResponseDto(variantWithRelations!);
  }

  async getAllVariants(): Promise<ProductVariantResponseDto[]> {
    const variants = await this.variantRepository.find({
      relations: ['product', 'color']
    });
    return ProductVariantMapper.toResponseDtoList(variants);
  }

  async getVariantsByProduct(productId: number): Promise<ProductVariantResponseDto[]> {
    const variants = await this.variantRepository.find({
      where: { product: { id: productId } },
      relations: ['product', 'color']
    });
    return ProductVariantMapper.toResponseDtoList(variants);
  }

  async getVariantById(id: number): Promise<ProductVariantResponseDto> {
    const variant = await this.variantRepository.findOne({
      where: { id },
      relations: ['product', 'color']
    });

    if (!variant) {
      throw new AppError(
        "Product variant not found",
        HttpStatusCode.NOT_FOUND,
        ErrorCode.PRODUCT_NOT_FOUND
      );
    }

    return ProductVariantMapper.toResponseDto(variant);
  }

  async updateVariant(id: number, dto: UpdateProductVariantDto): Promise<ProductVariantResponseDto> {
    const variant = await this.variantRepository.findOne({
      where: { id },
      relations: ['product', 'color']
    });

    if (!variant) {
      throw new AppError(
        "Product variant not found",
        HttpStatusCode.NOT_FOUND,
        ErrorCode.PRODUCT_NOT_FOUND
      );
    }

    // Update color if provided
    if (dto.color_id !== undefined) {
      if (dto.color_id) {
        const color = await this.colorRepository.findOne({
          where: { id: dto.color_id }
        });
        if (!color) {
          throw new AppError(
            "Color not found",
            HttpStatusCode.NOT_FOUND,
            ErrorCode.PRODUCT_NOT_FOUND
          );
        }
        variant.color = color;
      } else {
        variant.color = undefined;
      }
    }

    // Update other fields
    if (dto.size !== undefined) variant.size = dto.size;
    if (dto.price !== undefined) variant.price = dto.price;
    if (dto.quantity !== undefined) variant.quantity = dto.quantity;

    const savedVariant = await this.variantRepository.save(variant);

    // Reload with relations
    const updatedVariant = await this.variantRepository.findOne({
      where: { id: savedVariant.id },
      relations: ['product', 'color']
    });

    return ProductVariantMapper.toResponseDto(updatedVariant!);
  }

  async deleteVariant(id: number): Promise<void> {
    const variant = await this.variantRepository.findOne({
      where: { id }
    });

    if (!variant) {
      throw new AppError(
        "Product variant not found",
        HttpStatusCode.NOT_FOUND,
        ErrorCode.PRODUCT_NOT_FOUND
      );
    }

    await this.variantRepository.remove(variant);
  }
}

export default new ProductVariantService();
