import { BlogType } from "../enum/blog.enum";

export interface CreateBlogDto {
  title: string;
  content?: string;
  image_blogs?: string;
  status: BlogType;
  author_id: number;
}

export interface UpdateBlogDto {
  title?: string;
  content?: string;
  image_blogs?: string;
  status?: BlogType;
}

export interface BlogResponseDto {
  id: number;
  title: string;
  content?: string;
  image_blogs?: string;
  status: BlogType;
  author_id: number;
  author: {
    id: number;
    fullname: string;
    email: string;
    role: string;
  };
  createdAt: Date;
  updatedAt: Date;
}