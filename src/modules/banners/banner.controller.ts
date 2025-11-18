import { Request, Response } from 'express';
import { BannerService } from './banner.service';
import { AppResponse } from '@/common/success.response';

const bannerService = new BannerService();

const bannerController = {
  async getAllBanners(req: Request, res: Response) {
    try {
      const banners = await bannerService.getAll();
      return new AppResponse({
        message: 'Lấy danh sách banners thành công',
        statusCode: 200,
        data: banners
      }).sendResponse(res);
    } catch (error: any) {
      console.error('Error getting banners:', error);
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  async getBannerById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const banner = await bannerService.getById(id);

      if (!banner) {
        return res.status(404).json({ message: 'Không tìm thấy banner' });
      }

      return new AppResponse({
        message: 'Lấy banner thành công',
        statusCode: 200,
        data: banner
      }).sendResponse(res);
    } catch (error: any) {
      console.error('Error getting banner:', error);
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  async createBanner(req: Request, res: Response) {
    try {
      const { title, subtitle, description, image_url, button_text, button_link, is_active, display_order } = req.body;
      const banner = await bannerService.create({
        title,
        subtitle,
        description,
        image_url,
        button_text,
        button_link,
        is_active: is_active !== false,
        display_order: display_order || 0
      });

      return new AppResponse({
        message: 'Tạo banner thành công',
        statusCode: 201,
        data: banner
      }).sendResponse(res);
    } catch (error: any) {
      console.error('Error creating banner:', error);
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  async updateBanner(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { title, subtitle, description, image_url, button_text, button_link, is_active, display_order } = req.body;

      const banner = await bannerService.update(id, {
        title,
        subtitle,
        description,
        image_url,
        button_text,
        button_link,
        is_active,
        display_order
      });

      if (!banner) {
        return res.status(404).json({ message: 'Không tìm thấy banner' });
      }

      return new AppResponse({
        message: 'Cập nhật banner thành công',
        statusCode: 200,
        data: banner
      }).sendResponse(res);
    } catch (error: any) {
      console.error('Error updating banner:', error);
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  async deleteBanner(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await bannerService.delete(id);

      return new AppResponse({
        message: 'Xóa banner thành công',
        statusCode: 200
      }).sendResponse(res);
    } catch (error: any) {
      console.error('Error deleting banner:', error);
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  }
};

export default bannerController;
