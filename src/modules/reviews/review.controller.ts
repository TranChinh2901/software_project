import { CreateReviewDto, UpdateReviewDto } from './dto/review.dto';
import { NextFunction, Request, Response } from "express";
import reviewService from './review.service';
import { AppResponse } from '@/common/success.response';
import { SuccessMessages } from '@/constants/message';
import { HttpStatusCode } from '@/constants/status-code';
import { AuthenticatedRequest } from '@/middlewares/auth.middleware';
import { AppError } from '@/common/error.response';
import { ErrorCode } from '@/constants/error-code';

export class ReviewController {
    async createReview(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const createReviewDto: CreateReviewDto = {
                ...req.body,
                user_id: req.user?.id
            };
            
            const review = await reviewService.createReview(createReviewDto);
            
            return new AppResponse({
                message: SuccessMessages.REVIEW.REVIEW_CREATED,
                statusCode: HttpStatusCode.CREATED,
                data: review
            }).sendResponse(res);
        } catch (error) {
            next(error);
        }
    }
    async getAllReviews(req: Request, res: Response, next: NextFunction) {
        try {
            const reviews = await reviewService.getAllReviews();
            
            return new AppResponse({
                message: SuccessMessages.REVIEW.REVIEW_LIST_GET,
                statusCode: HttpStatusCode.OK,
                data: reviews
            }).sendResponse(res);
        } catch (error) {
            next(error);
        }
    }
    async getReviewsByProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const { productId } = req.params;
            const productIdInt = parseInt(productId);
            
            if (isNaN(productIdInt)) {
                throw new AppError(
                    "Invalid product ID",
                    HttpStatusCode.BAD_REQUEST,
                    ErrorCode.INVALID_PARAMS
                );
            }

            const reviews = await reviewService.getReviewsByProduct(productIdInt);
            
            return new AppResponse({
                message: SuccessMessages.REVIEW.REVIEW_LIST_GET,
                statusCode: HttpStatusCode.OK,
                data: reviews
            }).sendResponse(res);
        } catch (error) {
            next(error);
        }
    }
    async getReviewById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const reviewId = parseInt(id);
            
            if (isNaN(reviewId)) {
                throw new AppError(
                    "Invalid review ID",
                    HttpStatusCode.BAD_REQUEST,
                    ErrorCode.INVALID_PARAMS
                );
            }

            const review = await reviewService.getReviewById(reviewId);
            
            return new AppResponse({
                message: SuccessMessages.REVIEW.REVIEW_GET,
                statusCode: HttpStatusCode.OK,
                data: review
            }).sendResponse(res);
        } catch (error) {
            next(error);
        }
    }
    async updateReview(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const reviewId = parseInt(id);
            
            if (isNaN(reviewId)) {
                throw new AppError(
                    "Invalid review ID",
                    HttpStatusCode.BAD_REQUEST,
                    ErrorCode.INVALID_PARAMS
                );
            }

            const updateData: UpdateReviewDto = req.body;
            const userId = req.user?.id!;

            const review = await reviewService.updateReview(reviewId, updateData, userId);
            
            return new AppResponse({
                message: SuccessMessages.REVIEW.REVIEW_UPDATED,
                statusCode: HttpStatusCode.OK,
                data: review
            }).sendResponse(res);
        } catch (error) {
            next(error);
        }
    }
    async deleteReview(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const reviewId = parseInt(id);
            
            if (isNaN(reviewId)) {
                throw new AppError(
                    "Invalid review ID",
                    HttpStatusCode.BAD_REQUEST,
                    ErrorCode.INVALID_PARAMS
                );
            }

            const userId = req.user?.id!;
            await reviewService.deleteReview(reviewId, userId);
            
            return new AppResponse({
                message: SuccessMessages.REVIEW.REVIEW_DELETED,
                statusCode: HttpStatusCode.OK,
                data: { id: reviewId }
            }).sendResponse(res);
        } catch (error) {
            next(error);
        }
    }
}

export default new ReviewController();