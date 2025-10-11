import express from "express";
import reviewController from "@/modules/reviews/review.controller";
import { requireAuth } from "@/middlewares/auth.middleware";
import { validateBody } from "@/middlewares/validate.middleware";
import { CreateReviewSchema, UpdateReviewSchema } from "@/modules/reviews/schema/review.schema";

const router = express.Router();
router.post("/",
    requireAuth(),
    validateBody(CreateReviewSchema),
    reviewController.createReview
);
router.get("/", reviewController.getAllReviews);
router.get("/product/:productId", reviewController.getReviewsByProduct);

router.get("/:id", reviewController.getReviewById);

router.put("/:id",
    requireAuth(),
    validateBody(UpdateReviewSchema),
    reviewController.updateReview
);
router.delete("/:id",
    requireAuth(),
    reviewController.deleteReview
);

export { router as reviewRoutes };
