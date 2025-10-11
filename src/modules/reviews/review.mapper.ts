import { ReviewResponseDto } from "./dto/review.dto";
import { Review } from "./entity/review.entity";

export class ReviewMapper {
    static toReviewResponseDto(review: Review): ReviewResponseDto {
        return {
            id: review.id,
            rating: review.rating,
            comment: review.comment,
            created_at: review.created_at,
            user: {
                id: review.user.id,
                fullname: review.user.fullname,
                avatar: review.user.avatar,
            },
            product: {
                id: review.product.id,
                name_product: review.product.name_product,
                image_product: review.product.image_product,
            },
        };
    }

    static toReviewResponseDtoList(reviews: Review[]): ReviewResponseDto[] {
        return reviews.map((review) => ReviewMapper.toReviewResponseDto(review));
    }
}