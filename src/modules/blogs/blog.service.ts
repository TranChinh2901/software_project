import { Repository } from "typeorm";
import { Blog } from "./entity/blog.entity";
import { User } from "../users/entity/user.entity";
import { AppDataSource } from "@/config/database.config";
import { CreateBlogDto } from "./dto/blog.dto";
import { AppError } from '@/common/error.response';
import { HttpStatusCode } from '@/constants/status-code';
import { AppResponse } from '@/common/success.response';
import { ErrorMessages, SuccessMessages } from "@/constants/message";
import { ErrorCode } from "@/constants/error-code";

export class BlogService {
    private blogRepository: Repository<Blog>;
    private userRepository: Repository<User>;
    
    constructor() {
        this.blogRepository = AppDataSource.getRepository(Blog);
        this.userRepository = AppDataSource.getRepository(User);
    }

    async createBlog(blogData: CreateBlogDto): Promise<AppResponse | AppError> {
        try {
            const author = await this.userRepository.findOne({
                where: {
                    id: blogData.author_id
                    // is_deleted: false
                }
            });
            
            if(!author) {
                return new AppError(
                    ErrorMessages.USER.USER_NOT_FOUND,
                    HttpStatusCode.NOT_FOUND,
                    ErrorCode.USER_NOT_FOUND
                );
            }
            
            const newBlog = this.blogRepository.create({
                ...blogData,
                author: author
            });
            
            const savedBlog = await this.blogRepository.save(newBlog);
            
            const blogWithAuthor = await this.blogRepository.findOne({
                where: {
                    id: savedBlog.id
                },
                relations: ['author']
            });
            
            return new AppResponse({
                statusCode: HttpStatusCode.CREATED,
                message: SuccessMessages.BLOG.BLOG_CREATED,
                data: blogWithAuthor
            });
        } catch (error) {
            return new AppError(
                ErrorMessages.BLOG.CREATE_BLOG_FAILED,
                HttpStatusCode.INTERNAL_SERVER_ERROR,
                ErrorCode.SERVER_ERROR,
                error 
            );
        }
    }
}

export default new BlogService();