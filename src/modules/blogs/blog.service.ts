import { Repository } from "typeorm";
import { Blog } from "./entity/blog.entity";
import { User } from "../users/entity/user.entity";
import { AppDataSource } from "@/config/database.config";
import { BlogResponseDto, CreateBlogDto } from "./dto/blog.dto";
import { ErrorMessages } from "@/constants/message";
import { HttpStatusCode } from "@/constants/status-code";
import { ErrorCode } from "@/constants/error-code";
import { AppError } from "@/common/error.response";
import { BlogMapper } from "./blog.mapper";

export class BlogService {
  private blogRepository: Repository<Blog>;
  private userRepository: Repository<User>;

  constructor() {
    this.blogRepository = AppDataSource.getRepository(Blog);
    this.userRepository = AppDataSource.getRepository(User);
  }

  async createBlog(blogData: CreateBlogDto): Promise<BlogResponseDto> {
    try {
      const author = await this.userRepository.findOne({
        where: {
          id: blogData.author_id,
        },
      });

      if (!author) {
        throw new AppError(
          ErrorMessages.USER.USER_NOT_FOUND,
          HttpStatusCode.NOT_FOUND,
          ErrorCode.USER_NOT_FOUND
        );
      }

      const newBlog = this.blogRepository.create({
        ...blogData,
        author: author,
      });

      const savedBlog = await this.blogRepository.save(newBlog);

      const blogWithAuthor = await this.blogRepository.findOne({
        where: {
          id: savedBlog.id,
        },
        relations: ["author"],
      });

      return BlogMapper.toBlogResponseDto(blogWithAuthor!);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        ErrorMessages.BLOG.CREATE_BLOG_FAILED,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        ErrorCode.SERVER_ERROR,
        error
      );
    }
  }

  async getAllBlogs(
    page: number = 1,
    limit: number = 10
  ): Promise<{ blogs: BlogResponseDto[]; total: number; totalPages: number }> {
    try {
      const skip = (page - 1) * limit;
      const [blogs, total] = await this.blogRepository.findAndCount({
        relations: ["author"],
        order: { id: "DESC" },
        skip: skip,
        take: limit,
      });

      const totalPages = Math.ceil(total / limit);

      return {
        blogs: BlogMapper.toBlogResponseDtoList(blogs),
        total,
        totalPages,
      };
    } catch (error) {
      throw new AppError(
        ErrorMessages.SERVER.DATABASE_ERROR,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        ErrorCode.SERVER_ERROR,
        error
      );
    }
  }


  async getBlogById(id: number): Promise<BlogResponseDto> {
    try {
      const blog = await this.blogRepository.findOne({
        where: { id },
        relations: ["author"],
      });

      if (!blog) {
        throw new AppError(
          ErrorMessages.BLOG.BLOG_NOT_FOUND,
          HttpStatusCode.NOT_FOUND,
          ErrorCode.BLOG_NOT_FOUND
        );
      }
      return BlogMapper.toBlogResponseDto(blog);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        ErrorMessages.SERVER.DATABASE_ERROR,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        ErrorCode.SERVER_ERROR,
        error
      );
    }
  }
}

export default new BlogService();
