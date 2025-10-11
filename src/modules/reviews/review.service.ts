import { CreateReviewDto, ReviewResponseDto } from './dto/review.dto';
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
 private productRepository: Repository<Product>
 
 constructor() {
    this.reviewRepository = AppDataSource.getRepository(Review);
    this.userRepository = AppDataSource.getRepository(User);
    this.productRepository = AppDataSource.getRepository(Product);
 }
 async createReview(createReviewDto: CreateReviewDto): Promise<ReviewResponseDto> {
try {
   const checkUser = await this.userRepository.findOne({where: {id: createReviewDto.user_id}});
   const checkProduct = await this.productRepository.findOne({where: {id: createReviewDto.product_id}});
    if (!checkUser) {
     throw new AppError(
          ErrorMessages.USER.USER_NOT_FOUND,
          HttpStatusCode.NOT_FOUND,
          ErrorCode.USER_NOT_FOUND
     )
    }; 
    if (!checkProduct) {
        throw new AppError(
             ErrorMessages.PRODUCT.PRODUCT_NOT_FOUND,
             HttpStatusCode.NOT_FOUND,
             ErrorCode.PRODUCT_NOT_FOUND
        )
       };
       const newReview = this.reviewRepository.create({
        ...createReviewDto,
        user: checkUser,
        product: checkProduct,
       });
       const savedReview = await this.reviewRepository.save(newReview);
       const reviewWithRelations = await this.reviewRepository.findOne({
        where: {
            id: savedReview.id,
        },
        relations: ["user", "product"],
       })
       return ReviewMapper.toReviewResponseDto(reviewWithRelations!);
} catch (error) {
    throw new AppError(
        ErrorMessages.REVIEW.CREATE_REVIEW_FAILED,
        HttpStatusCode.CONFLICT,
        ErrorCode.REVIEW_ALREADY_EXISTS
    )
}
 }
}
export default new ReviewService();