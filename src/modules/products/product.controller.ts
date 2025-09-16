import { Request, Response } from 'express';
import { AppResponse } from '@/common/success.response';
import { HttpStatusCode } from '@/constants/status-code';

class ProductController {
  async getAll(req: Request, res: Response) {
    return new AppResponse({
      message: 'Products retrieved successfully',
      statusCode: HttpStatusCode.OK,
      data: []
    }).sendResponse(res);
  }

  async getById(req: Request, res: Response) {
    const id = req.params.id;
    return new AppResponse({
      message: 'Product retrieved successfully',
      statusCode: HttpStatusCode.OK,
      data: { id, message: 'Product details will be implemented' }
    }).sendResponse(res);
  }

  async getVariants(req: Request, res: Response) {
    const id = req.params.id;
    return new AppResponse({
      message: 'Product variants retrieved successfully',
      statusCode: HttpStatusCode.OK,
      data: { productId: id, variants: [] }
    }).sendResponse(res);
  }

  async create(req: Request, res: Response) {
    return new AppResponse({
      message: 'Product created successfully',
      statusCode: HttpStatusCode.CREATED,
      data: { message: 'Create product will be implemented' }
    }).sendResponse(res);
  }

  async update(req: Request, res: Response) {
    const id = req.params.id;
    return new AppResponse({
      message: 'Product updated successfully',
      statusCode: HttpStatusCode.OK,
      data: { id, message: 'Update product will be implemented' }
    }).sendResponse(res);
  }

  async delete(req: Request, res: Response) {
    const id = req.params.id;
    return new AppResponse({
      message: 'Product deleted successfully',
      statusCode: HttpStatusCode.OK,
      data: { id }
    }).sendResponse(res);
  }

  async uploadImages(req: Request, res: Response) {
    // TODO: Implement upload product images
    const id = req.params.id;
    return new AppResponse({
      message: 'Product images uploaded successfully',
      statusCode: HttpStatusCode.OK,
      data: { productId: id, images: [] }
    }).sendResponse(res);
  }
}

export default new ProductController();