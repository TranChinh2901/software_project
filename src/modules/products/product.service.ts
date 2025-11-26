import { Repository } from "typeorm";
import { Product } from "./entity/product.entity";
import { Brand } from "../brands/entity/brand.entity";
import { Category } from "../categories/entity/category.entity";
import { AppDataSource } from "@/config/database.config";
import { CreateProductDto, ProductResponseDto, UpdateProductDto } from "./dto/product.dto";
import { QueryProductDto, ProductListResponseDto } from "./dto/query-product.dto";
import { AppError } from "@/common/error.response";
import { ErrorMessages } from "@/constants/message";
import { HttpStatusCode } from "@/constants/status-code";
import { ErrorCode } from "@/constants/error-code";
import { ProductMapper } from "./product.mapper";
import { Like, MoreThan, Not } from "typeorm";

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

    async getAllProducts(query?: QueryProductDto): Promise<ProductListResponseDto> {
        try {
            const {
                search,
                category_id,
                brand_id,
                min_price,
                max_price,
                sort = 'newest',
                page = 1,
                limit = 12,
                featured = false,
                status,
                is_on_sale
            } = query || {};

            const queryBuilder = this.productResponsitory.createQueryBuilder('product')
                .leftJoinAndSelect('product.category', 'category')
                .leftJoinAndSelect('product.brand', 'brand')
                .where('product.is_deleted = :is_deleted', { is_deleted: false });

            if (search && search.trim()) {
                queryBuilder.andWhere(
                    '(product.name_product LIKE :search OR product.small_description LIKE :search)', 
                    { search: `%${search}%` }
                );
            }

            if (category_id) {
                queryBuilder.andWhere('product.category_id = :category_id', { category_id });
            }

            if (brand_id) {
                queryBuilder.andWhere('product.brand_id = :brand_id', { brand_id });
            }

            if (min_price !== undefined && min_price > 0) {
                queryBuilder.andWhere('product.price >= :min_price', { min_price });
            }

            if (max_price !== undefined && max_price > 0) {
                queryBuilder.andWhere('product.price <= :max_price', { max_price });
            }

            if (featured) {
                queryBuilder.andWhere('product.discount > :discount', { discount: 0 });
            }

            if (status) {
                queryBuilder.andWhere('product.status = :status', { status });
            }

            if (is_on_sale !== undefined) {
                queryBuilder.andWhere('product.is_on_sale = :is_on_sale', { is_on_sale });
            }

            switch (sort) {
                case 'price_asc':
                    queryBuilder.orderBy('product.price', 'ASC');
                    break;
                case 'price_desc':
                    queryBuilder.orderBy('product.price', 'DESC');
                    break;
                case 'name_asc':
                    queryBuilder.orderBy('product.name_product', 'ASC');
                    break;
                case 'name_desc':
                    queryBuilder.orderBy('product.name_product', 'DESC');
                    break;
                case 'oldest':
                    queryBuilder.orderBy('product.created_at', 'ASC');
                    break;
                case 'newest':
                default:
                    queryBuilder.orderBy('product.created_at', 'DESC');
            }

            // Đếm tổng số sản phẩm
            const total = await queryBuilder.getCount();

            // Tính tổng số trang
            const totalPages = Math.ceil(total / limit);

            // Phân trang
            const products = await queryBuilder
                .skip((page - 1) * limit)
                .take(limit)
                .getMany();

            return {
                products: ProductMapper.toProductResponseDtoList(products),
                total,
                page,
                limit,
                totalPages
            };
        } catch (error) {
            throw new AppError(
                ErrorMessages.PRODUCT.FAILED_TO_FETCH_PRODUCT,
                HttpStatusCode.INTERNAL_SERVER_ERROR,
                ErrorCode.INTERNAL_SERVER_ERROR,
                error
            )
        }
    }

    async getFeaturedProducts(): Promise<ProductResponseDto[]> {
        try {
            const products = await this.productResponsitory.find({
                where: { discount: MoreThan(0) },
                relations: ["brand", "category"],
                order: { discount: 'DESC' },
                take: 8
            });
            return ProductMapper.toProductResponseDtoList(products);
        } catch (error) {
            throw new AppError(
                ErrorMessages.PRODUCT.FAILED_TO_FETCH_PRODUCT,
                HttpStatusCode.INTERNAL_SERVER_ERROR,
                ErrorCode.INTERNAL_SERVER_ERROR,
                error
            )
        }
    }

    async getBestSellers(): Promise<ProductResponseDto[]> {
        try {
            const products = await this.productResponsitory.find({
                where: { discount: MoreThan(0) },
                relations: ["brand", "category"],
                order: { discount: 'DESC', created_at: 'DESC' },
                take: 8
            });
            return ProductMapper.toProductResponseDtoList(products);
        } catch (error) {
            throw new AppError(
                ErrorMessages.PRODUCT.FAILED_TO_FETCH_PRODUCT,
                HttpStatusCode.INTERNAL_SERVER_ERROR,
                ErrorCode.INTERNAL_SERVER_ERROR,
                error
            )
        }
    }

    async getFlashSaleProducts(): Promise<ProductResponseDto[]> {
        try {
            const products = await this.productResponsitory.find({
                where: { is_on_sale: true },
                relations: ["brand", "category"],
                order: { discount: 'DESC', created_at: 'DESC' },
                take: 12
            });
            return ProductMapper.toProductResponseDtoList(products);
        } catch (error) {
            throw new AppError(
                ErrorMessages.PRODUCT.FAILED_TO_FETCH_PRODUCT,
                HttpStatusCode.INTERNAL_SERVER_ERROR,
                ErrorCode.INTERNAL_SERVER_ERROR,
                error
            )
        }
    }

    async getProductsByCategory(categoryId: number): Promise<ProductResponseDto[]> {
        try {
            const products = await this.productResponsitory.find({
                where: { category: { id: categoryId } },
                relations: ["brand", "category"],
                order: { created_at: 'DESC' }
            });
            return ProductMapper.toProductResponseDtoList(products);
        } catch (error) {
            throw new AppError(
                ErrorMessages.PRODUCT.FAILED_TO_FETCH_PRODUCT,
                HttpStatusCode.INTERNAL_SERVER_ERROR,
                ErrorCode.INTERNAL_SERVER_ERROR,
                error
            )
        }
    }
    async getProductById(id: number): Promise<ProductResponseDto> {
        try {
            const product = await this.productResponsitory.findOne({
                where: { id },
                relations: ["brand", "category"]
            });
            if(!product) {
                throw new AppError(
                    ErrorMessages.PRODUCT.PRODUCT_NOT_FOUND,
                    HttpStatusCode.NOT_FOUND,
                    ErrorCode.PRODUCT_NOT_FOUND
                )
            };
            return ProductMapper.toProductResponseDto(product);
        } catch (error) {
            throw new AppError(
                ErrorMessages.PRODUCT.FAILED_TO_FETCH_PRODUCT_BY_ID,
                HttpStatusCode.INTERNAL_SERVER_ERROR,
                ErrorCode.INTERNAL_SERVER_ERROR,
                error
            )
        }
    }
    async updateProduct(id: number, updateData: UpdateProductDto): Promise<ProductResponseDto> {
        try {
           const product = await this.productResponsitory.findOne({
            where: { id },
            relations: ["brand", "category"]
           })
           if(!product) {
            throw new AppError(
                ErrorMessages.PRODUCT.PRODUCT_NOT_FOUND,
                HttpStatusCode.NOT_FOUND,
                ErrorCode.PRODUCT_NOT_FOUND
            )
           }
        if(updateData.brand_id) {
            const brandP = await this.brandResponsitory.findOne({
                where: { id: updateData.brand_id }
            })
            if(!brandP) {
                throw new AppError(
                    ErrorMessages.BRAND.BRAND_NOT_FOUND,
                    HttpStatusCode.NOT_FOUND,
                    ErrorCode.BRAND_NOT_FOUND
                )
            }
            product.brand = brandP;
        }
        if(updateData.category_id) {
            const categoryP = await this.categoryRespository.findOne({
                where: { id: updateData.category_id }
            })
            if(!categoryP) {
                throw new AppError(
                    ErrorMessages.CATEGORY.CATEGORY_NOT_FOUND,
                    HttpStatusCode.NOT_FOUND,
                    ErrorCode.CATEGORY_NOT_FOUND
                )
            }
            product.category = categoryP;
        }
        const {brand_id, category_id, ...updateFields} = updateData;
        Object.assign(product, updateFields);
        const updateProduct = await this.productResponsitory.save(product);
        return ProductMapper.toProductResponseDto(updateProduct);
        } catch (error) {
            throw new AppError(
                ErrorMessages.PRODUCT.UPDATE_PRODUCT_FAILED,
                HttpStatusCode.INTERNAL_SERVER_ERROR,
                ErrorCode.SERVER_ERROR,
                error
            )
        }
    }

    async getRelatedProducts(productId: number, limit: number = 4): Promise<ProductResponseDto[]> {
        try {
            const currentProduct = await this.productResponsitory.findOne({
                where: { id: productId },
                relations: ["category", "brand"]
            });

            if (!currentProduct) {
                throw new AppError(
                    ErrorMessages.PRODUCT.PRODUCT_NOT_FOUND,
                    HttpStatusCode.NOT_FOUND,
                    ErrorCode.PRODUCT_NOT_FOUND
                );
            }

            if (!currentProduct.category || !currentProduct.brand) {
                throw new AppError(
                    "Product category or brand not found",
                    HttpStatusCode.BAD_REQUEST,
                    ErrorCode.INVALID_PARAMS
                );
            }

            const products = await this.productResponsitory.find({
                where: [
                    { category: { id: currentProduct.category.id }, id: Not(productId) },
                    { brand: { id: currentProduct.brand.id }, id: Not(productId) }
                ],
                relations: ["brand", "category"],
                order: { created_at: 'DESC' },
                take: limit
            });

            return ProductMapper.toProductResponseDtoList(products);
        } catch (error) {
            throw new AppError(
                ErrorMessages.PRODUCT.FAILED_TO_FETCH_PRODUCT,
                HttpStatusCode.INTERNAL_SERVER_ERROR,
                ErrorCode.INTERNAL_SERVER_ERROR,
                error
            );
        }
    }
}

export default new ProductService();