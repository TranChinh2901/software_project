import { requireAuth } from "@/middlewares/auth.middleware";
import { validateBody } from "@/middlewares/validate.middleware";
import { uploadBlogImage } from "@/middlewares/upload.middleware";
import blogController from "@/modules/blogs/blog.controller";
import { CreateBlogSchema, UpdateBlogSchema } from "@/modules/blogs/schema/blog.schema";
import { asyncHandle } from "@/utils/handle-error";
import express from "express";
const router = express.Router();

router.post("/", 
  requireAuth(),
  uploadBlogImage.single('image_blogs'),
  validateBody(CreateBlogSchema),
  asyncHandle(blogController.createBlog)
);

router.get("/", 
  asyncHandle(blogController.getAllBlogs)
);

router.get("/:id", 
  asyncHandle(blogController.getBlogById)
);

router.put("/:id", 
  requireAuth(),
  uploadBlogImage.single('image_blogs'),
  validateBody(UpdateBlogSchema),
  asyncHandle(blogController.updateBlog)
);

router.delete("/:id", 
  requireAuth(),
  asyncHandle(blogController.deleteBlog)
);
export default router;