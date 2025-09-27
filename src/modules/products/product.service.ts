import { Repository } from "typeorm";
import { Product } from "./entity/product.entity";
import { Brand } from "../brands/entity/brand.entity";
import { Category } from "../categories/entity/category.entity";
import { AppDataSource } from "@/config/database.config";
import { CreateProductDto, ProductResponseDto } from "./dto/product.dto";
import { AppError } from "@/common/error.response";
import { ErrorMessages } from "@/constants/message";
import { HttpStatusCode } from "@/constants/status-code";
import { ErrorCode } from "@/constants/error-code";
import { ProductMapper } from "./product.mapper";

export class ProductService {
    private brandResponsitory: Repository<Brand>;
    private categoryRespository: Repository<Category>;
    private productResponsitory: Repository<Product>;

    constructor() {
        this.brandResponsitory = AppDataSource.getRepository(Brand);
        this.categoryRespository = AppDataSource.getRepository(Category);
        this.productResponsitory = AppDataSource.getRepository(Product);
    }
    async createProduct(productData: CreateProductDto): Promise<ProductResponseDto> {
        try {
            const checkBrand = await this.brandResponsitory.findOne({
                where: {
                    id: productData.brand_id
                }
            })
            if(!checkBrand) {
                throw new AppError(
                    ErrorMessages.BRAND.BRAND_NOT_FOUND,
                    HttpStatusCode.NOT_FOUND,
                    ErrorCode.BRAND_NOT_FOUND
                )
            }
            const checkCategory = await this.categoryRespository.findOne({
                where: {
                    id: productData.category_id
                }
            })  
            if(!checkCategory) {
                throw new AppError(
                    ErrorMessages.CATEGORY.CATEGORY_NOT_FOUND,
                    HttpStatusCode.NOT_FOUND,
                    ErrorCode.CATEGORY_NOT_FOUND
                )
            }
            const newProduct = this.productResponsitory.create({
                ...productData,
                brand: checkBrand,
                category: checkCategory
            });
            const savedProduct = await this.productResponsitory.save(newProduct);
            const productWithRelations = await this.productResponsitory.findOne({
                where: {    
                    id: savedProduct.id
                },
                relations: ["brand", "category"]
            })
            return ProductMapper.toProductResponseDto(productWithRelations!);
        } catch (error) {
            throw new AppError(
                ErrorMessages.PRODUCT.CREATE_PRODUCT_FAILED,
                HttpStatusCode.INTERNAL_SERVER_ERROR,
                ErrorCode.SERVER_ERROR,
                error
            )
        }
    }
    async getAllProducts(): Promise<ProductResponseDto[]> {
        try {
            const products = await this.productResponsitory.find({
                relations: ["brand", "category"],
                order: { updated_at: 'DESC' }
            })
            return ProductMapper.toProductResponseDtoList(products);
        } catch (error) {
            throw new AppError (
                ErrorMessages.PRODUCT.FAILED_TO_FETCH_PRODUCT,
                HttpStatusCode.INTERNAL_SERVER_ERROR,
                ErrorCode.INTERNAL_SERVER_ERROR
            )
        }
    }
}

export default new ProductService();