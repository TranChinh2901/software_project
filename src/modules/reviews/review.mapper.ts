import { ReviewResponseDto } from "./dto/review.dto";
import { Review } from "./entity/review.entity";

export class ReviewMapper {
    static toReviewResponseDto(review: Review): ReviewResponseDto{
        return {
            id: review.id,
            rating: review.rating,
            comment: review.comment ?? undefined,
            user_id: review.user.id,
            // user: review.user ? {
            //     id: review.user.id,
            //     fullname: review.user.fullname,
            // },
            product_id: review.product.id,
            product: review.product ? {
                id: review.product.id,
                name_product: review.product.name_product,
            } : undefined,
        };
    }

    static toReviewResponseDtoList(reviews: Review[]): ReviewResponseDto[] {
        return reviews.map((review) => {
            return ReviewMapper.toReviewResponseDto(review);
        });
    }
}