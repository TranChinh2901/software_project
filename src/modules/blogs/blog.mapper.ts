import { BlogResponseDto } from "./dto/blog.dto";
import { Blog } from "./entity/blog.entity";

export class BlogMapper {
  static toBlogResponseDto(blog: Blog): BlogResponseDto {
    return {
      id: blog.id,
      title: blog.title,
      content: blog.content,
      image_blogs: blog.image_blogs,
      status: blog.status,
      author_id: blog.author.id,
      author: {
        id: blog.author.id,
        fullname: blog.author.fullname,
        email: blog.author.email,
        role: blog.author.role,
      },
    };
  }
  static toBlogResponseDtoList(blogs: Blog[]): BlogResponseDto[] {
    return blogs.map((blog) => this.toBlogResponseDto(blog));
  }
}
