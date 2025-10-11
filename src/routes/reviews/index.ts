import express from "express";
import reviewController from "@/modules/reviews/review.controller";
import { requireAuth } from "@/middlewares/auth.middleware";
import { validateBody } from "@/middlewares/validate.middleware";
import { CreateReviewSchema, UpdateReviewSchema } from "@/modules/reviews/schema/review.schema";

const router = express.Router();

// Create review (requires authentication)
router.post("/",
    requireAuth(),
    validateBody(CreateReviewSchema),
    reviewController.createReview
);

// Get all reviews (public)
router.get("/", reviewController.getAllReviews);

// Get reviews by product (public)
router.get("/product/:productId", reviewController.getReviewsByProduct);

// Get review by ID (public)
router.get("/:id", reviewController.getReviewById);

// Update review (requires authentication + ownership)
router.put("/:id",
    requireAuth(),
    validateBody(UpdateReviewSchema),
    reviewController.updateReview
);

// Delete review (requires authentication + ownership)
router.delete("/:id",
    requireAuth(),
    reviewController.deleteReview
);

export { router as reviewRoutes };
