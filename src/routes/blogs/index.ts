import { requireAuth } from "@/middlewares/auth.middleware";
import { validateBody } from "@/middlewares/validate.middleware";
import blogController from "@/modules/blogs/blog.controller";
import { CreateBlogSchema } from "@/modules/blogs/schema/blog.schema";
import { asyncHandle } from "@/utils/handle-error";
import express from "express";
const router = express.Router();

router.post("/", 
  requireAuth(),
  validateBody(CreateBlogSchema),
  asyncHandle(blogController.createBlog)
);

router.get("/", 
  asyncHandle(blogController.getAllBlogs)
)

router.get("/:id", 
  asyncHandle(blogController.getBlogById)
);
export default router;