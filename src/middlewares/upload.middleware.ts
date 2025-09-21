import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '@/config/cloudinary-config';
import { AppError } from '@/common/error.response';
import { HttpStatusCode } from '@/constants/status-code';
import { ErrorCode } from '@/constants/error-code';

const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'user-avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    public_id: (req: Request, avatar: Express.Multer.File) => {
      return `avatar_${Date.now()}_${Math.round(Math.random() * 1E9)}`;
    }
  } as any
});

const blogImageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'blog-images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp']
  } as any
});

const productImageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'product-images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp']
  } as any
});

const categoryImageStorage = new CloudinaryStorage({
   cloudinary,
  params: {
    folder: 'category-images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp']
  } as any

});

const brandImageStorage = new CloudinaryStorage({
   cloudinary,
  params: {
    folder: 'brand-images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp']
  } as any

})

const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        'Only image files are allowed',
        HttpStatusCode.BAD_REQUEST,
        ErrorCode.VALIDATION_ERROR
      ),
      false
    );
  }
};



export const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB
  }
});

export const uploadBlogImage = multer({
  storage: blogImageStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

export const uploadProductImage = multer({
  storage: productImageStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 
  }
});
