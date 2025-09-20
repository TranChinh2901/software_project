import { AuthenticatedRequest } from "@/middlewares/auth.middleware";
import { CreateBlogDto } from "./dto/blog.dto";
import { AppResponse } from "@/common/success.response";
import { SuccessMessages } from "@/constants/message";
import { HttpStatusCode } from "@/constants/status-code";
import blogService from "./blog.service";
import { Request, Response } from "express";

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

       async getAllBlogs(req: Request, res: Response) {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const result = await blogService.getAllBlogs(page, limit);

        return new AppResponse({
            message: SuccessMessages.BLOG.BLOG_LIST_GET,
            statusCode: HttpStatusCode.OK,
            data: {
                ...result,
                currentPage: page,
                limit
            }
        }).sendResponse(res);
    }

    async getBlogById(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        const result = await blogService.getBlogById(id);

        return new AppResponse({
            message: SuccessMessages.BLOG.BLOG_GET,
            statusCode: HttpStatusCode.OK,
            data: result
        }).sendResponse(res);
    }

}

export default new BlogController();