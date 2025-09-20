import { AuthenticatedRequest } from "@/middlewares/auth.middleware";
import { CreateBlogDto, UpdateBlogDto } from "./dto/blog.dto";
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

    async updateBlog(req: AuthenticatedRequest, res: Response) {
        const id = parseInt(req.params.id);
        const updateData: UpdateBlogDto = req.body;

        const result = await blogService.updateBlog(id, updateData);

        return new AppResponse({
            message: SuccessMessages.BLOG.BLOG_UPDATED,
            statusCode: HttpStatusCode.OK,
            data: result
        }).sendResponse(res);
    }

    async deleteBlog(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        await blogService.deleteBlog(id);

        return new AppResponse({
            message: SuccessMessages.BLOG.BLOG_DELETED,
            statusCode: HttpStatusCode.OK,
            data: {id}
        }).sendResponse(res);
    }
}

export default new BlogController();