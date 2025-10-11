import { CreateReviewDto, ReviewResponseDto, UpdateReviewDto } from './dto/review.dto';
import { Repository } from "typeorm";
import { Review } from "./entity/review.entity";
import { AppDataSource } from "@/config/database.config";
import { AppError } from '@/common/error.response';
import { ErrorMessages } from '@/constants/message';
import { HttpStatusCode } from '@/constants/status-code';
import { ErrorCode } from '@/constants/error-code';
import { User } from '../users/entity/user.entity';
import { Product } from '../products/entity/product.entity';
import { ReviewMapper } from './review.mapper';

export class ReviewService {
    private reviewRepository: Repository<Review>;
    private userRepository: Repository<User>;
    private productRepository: Repository<Product>;
    
    constructor() {
        this.reviewRepository = AppDataSource.getRepository(Review);
        this.userRepository = AppDataSource.getRepository(User);
        this.productRepository = AppDataSource.getRepository(Product);
    }

    async createReview(createReviewDto: CreateReviewDto): Promise<ReviewResponseDto> {
        try {
            if (createReviewDto.rating < 1 || createReviewDto.rating > 5) {
                throw new AppError(
                    'Rating must be between 1 and 5',
                    HttpStatusCode.BAD_REQUEST,
                    ErrorCode.VALIDATION_ERROR
                );
            }
            const checkUser = await this.userRepository.findOne({
                where: { id: createReviewDto.user_id }
            });
            if (!checkUser) {
                throw new AppError(
                    ErrorMessages.USER.USER_NOT_FOUND,
                    HttpStatusCode.NOT_FOUND,
                    ErrorCode.USER_NOT_FOUND
                );
            }
            const checkProduct = await this.productRepository.findOne({
                where: { id: createReviewDto.product_id }
            });
            
            if (!checkProduct) {
                throw new AppError(
                    ErrorMessages.PRODUCT.PRODUCT_NOT_FOUND,
                    HttpStatusCode.NOT_FOUND,
                    ErrorCode.PRODUCT_NOT_FOUND
                );
            }
            const existingReview = await this.reviewRepository.findOne({
                where: {
                    user: { id: createReviewDto.user_id },
                    product: { id: createReviewDto.product_id }
                }
            });
            if (existingReview) {
                throw new AppError(
                    ErrorMessages.REVIEW.REVIEW_ALREADY_EXISTS,
                    HttpStatusCode.CONFLICT,
                    ErrorCode.REVIEW_ALREADY_EXISTS
                );
            }
            const newReview = this.reviewRepository.create({
                rating: createReviewDto.rating,
                comment: createReviewDto.comment,
                user: checkUser,
                product: checkProduct,
            });

            const savedReview = await this.reviewRepository.save(newReview);
            const reviewWithRelations = await this.reviewRepository.findOne({
                where: { id: savedReview.id },
                relations: ["user", "product"],
            });
            return ReviewMapper.toReviewResponseDto(reviewWithRelations!);

        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(
                ErrorMessages.REVIEW.CREATE_REVIEW_FAILED,
                HttpStatusCode.INTERNAL_SERVER_ERROR,
                ErrorCode.INTERNAL_SERVER_ERROR,
                error
            );
        }
    }

    async getAllReviews(): Promise<ReviewResponseDto[]> {
        try {
            const reviews = await this.reviewRepository.find({
                relations: ["user", "product"],
                order: { created_at: 'DESC' }
            });
            return ReviewMapper.toReviewResponseDtoList(reviews);
        } catch (error) {
            throw new AppError(
                ErrorMessages.REVIEW.FAILED_TO_FETCH_REVIEW,
                HttpStatusCode.INTERNAL_SERVER_ERROR,
                ErrorCode.INTERNAL_SERVER_ERROR
            );
        }
    }

    async getReviewsByProduct(productId: number): Promise<ReviewResponseDto[]> {
        try {
            const reviews = await this.reviewRepository.find({
                where: { product: { id: productId } },
                relations: ["user", "product"],
                order: { created_at: 'DESC' }
            });
            return ReviewMapper.toReviewResponseDtoList(reviews);
        } catch (error) {
            throw new AppError(
                ErrorMessages.REVIEW.FAILED_TO_FETCH_REVIEW,
                HttpStatusCode.INTERNAL_SERVER_ERROR,
                ErrorCode.INTERNAL_SERVER_ERROR
            );
        }
    }

    async getReviewById(id: number): Promise<ReviewResponseDto> {
        try {
            const review = await this.reviewRepository.findOne({
                where: { id },
                relations: ["user", "product"]
            });

            if (!review) {
                throw new AppError(
                    ErrorMessages.REVIEW.REVIEW_NOT_FOUND,
                    HttpStatusCode.NOT_FOUND,
                    ErrorCode.REVIEW_NOT_FOUND
                );
            }

            return ReviewMapper.toReviewResponseDto(review);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(
                ErrorMessages.REVIEW.FAILED_TO_FETCH_REVIEW_BY_ID,
                HttpStatusCode.INTERNAL_SERVER_ERROR,
                ErrorCode.INTERNAL_SERVER_ERROR
            );
        }
    }

    async updateReview(id: number, updateData: UpdateReviewDto, userId: number): Promise<ReviewResponseDto> {
        try {
            const review = await this.reviewRepository.findOne({
                where: { id },
                relations: ["user", "product"]
            });

            if (!review) {
                throw new AppError(
                    ErrorMessages.REVIEW.REVIEW_NOT_FOUND,
                    HttpStatusCode.NOT_FOUND,
                    ErrorCode.REVIEW_NOT_FOUND
                );
            }
            if (review.user.id !== userId) {
                throw new AppError(
                    ErrorMessages.REVIEW.REVIEW_NOT_ALLOWED,
                    HttpStatusCode.FORBIDDEN,
                    ErrorCode.FORBIDDEN
                );
            }
            if (updateData.rating && (updateData.rating < 1 || updateData.rating > 5)) {
                throw new AppError(
                    'Rating must be between 1 and 5',
                    HttpStatusCode.BAD_REQUEST,
                    ErrorCode.VALIDATION_ERROR
                );
            }
            Object.assign(review, updateData);
            const updatedReview = await this.reviewRepository.save(review);

            return ReviewMapper.toReviewResponseDto(updatedReview);

        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(
                ErrorMessages.REVIEW.CREATE_REVIEW_FAILED,
                HttpStatusCode.INTERNAL_SERVER_ERROR,
                ErrorCode.INTERNAL_SERVER_ERROR,
                error
            );
        }
    }
    async deleteReview(id: number, userId: number): Promise<void> {
        try {
            const review = await this.reviewRepository.findOne({
                where: { id },
                relations: ["user"]
            });

            if (!review) {
                throw new AppError(
                    ErrorMessages.REVIEW.REVIEW_NOT_FOUND,
                    HttpStatusCode.NOT_FOUND,
                    ErrorCode.REVIEW_NOT_FOUND
                );
            }
            if (review.user.id !== userId) {
                throw new AppError(
                    ErrorMessages.REVIEW.REVIEW_NOT_ALLOWED,
                    HttpStatusCode.FORBIDDEN,
                    ErrorCode.FORBIDDEN
                );
            }
            await this.reviewRepository.remove(review);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(
                ErrorMessages.REVIEW.FAILED_DELETE_REVIEW,
                HttpStatusCode.INTERNAL_SERVER_ERROR,
                ErrorCode.INTERNAL_SERVER_ERROR
            );
        }
    }
}

export default new ReviewService();