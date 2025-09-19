import { AuthenticatedRequest } from "@/middlewares/auth.middleware";
import { CreateBlogDto } from "./dto/blog.dto";
import { AppResponse } from "@/common/success.response";
import { SuccessMessages } from "@/constants/message";
import { HttpStatusCode } from "@/constants/status-code";
import blogService from "./blog.service";
import { Response } from "express";

class BlogController {
    async createBlog(req: AuthenticatedRequest, res: Response) {
        const blogData: CreateBlogDto = {
            ...req.body,
            author_id: req.user!.id
        }
        const result = await blogService.createBlog(blogData);
        return new AppResponse({
            message: SuccessMessages.BLOG.BLOG_CREATED, 
            statusCode: HttpStatusCode.CREATED,
            data: result
        }).sendResponse(res);
    }
}

export default new BlogController();