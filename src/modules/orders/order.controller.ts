import { NextFunction, Request, Response } from "express";
import { CreateOrderDto, UpdateOrderDto } from "./dto/order.dto";
import orderService from "./order.service";
import { AppResponse } from "@/common/success.response";
import { SuccessMessages } from "@/constants/message";
import { HttpStatusCode } from "@/constants/status-code";
import { AuthenticatedRequest } from "@/middlewares/auth.middleware";

export class OrderController {
  async createOrder(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      console.log('Create Order Request Body:', JSON.stringify(req.body, null, 2));
      console.log('User ID from token:', userId);
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      const { items, shipping_address_id, shipping_address, voucher_id, note, payment_method } = req.body;

      const order = await orderService.createOrder({
        user_id: userId,
        items,
        shipping_address_id,
        shipping_address,
        voucher_id,
        note,
        payment_method
      });

      return new AppResponse({
        message: SuccessMessages.ORDER.ORDER_CREATED,
        statusCode: HttpStatusCode.CREATED,
        data: order
      }).sendResponse(res);
    } catch (error) {
      console.error('Create Order Error:', error);
      next(error);
    }
  }

  async getOrderById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const order = await orderService.getOrderById(parseInt(id));

      return new AppResponse({
        message: SuccessMessages.ORDER.ORDER_GET,
        statusCode: HttpStatusCode.OK,
        data: order
      }).sendResponse(res);
    } catch (error) {
      next(error);
    }
  }

  async getUserOrders(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }
      const orders = await orderService.getUserOrders(userId);

      return new AppResponse({
        message: SuccessMessages.ORDER.ORDER_LIST_GET,
        statusCode: HttpStatusCode.OK,
        data: orders
      }).sendResponse(res);
    } catch (error) {
      next(error);
    }
  }

  async getAllOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, page = '1', limit = '10' } = req.query;
      const orders = await orderService.getAllOrders({
        status: status as string,
        page: parseInt(page as string),
        limit: parseInt(limit as string)
      });

      return new AppResponse({
        message: SuccessMessages.ORDER.ORDER_LIST_GET,
        statusCode: HttpStatusCode.OK,
        data: orders
      }).sendResponse(res);
    } catch (error) {
      next(error);
    }
  }

  async updateOrderStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const order = await orderService.updateOrderStatus(parseInt(id), status);

      return new AppResponse({
        message: SuccessMessages.ORDER.ORDER_UPDATED,
        statusCode: HttpStatusCode.OK,
        data: order
      }).sendResponse(res);
    } catch (error) {
      next(error);
    }
  }

  async cancelOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { cancel_reason } = req.body;

      const order = await orderService.cancelOrder(parseInt(id), cancel_reason);

      return new AppResponse({
        message: SuccessMessages.ORDER.ORDER_CANCELLED,
        statusCode: HttpStatusCode.OK,
        data: order
      }).sendResponse(res);
    } catch (error) {
      next(error);
    }
  }

  async deleteOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await orderService.deleteOrder(parseInt(id));

      return new AppResponse({
        message: 'Xóa đơn hàng thành công',
        statusCode: HttpStatusCode.OK,
        data: null
      }).sendResponse(res);
    } catch (error) {
      next(error);
    }
  }

  async getOrderDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const order = await orderService.getOrderDetailById(parseInt(id));

      return new AppResponse({
        message: SuccessMessages.ORDER.ORDER_GET,
        statusCode: HttpStatusCode.OK,
        data: order
      }).sendResponse(res);
    } catch (error) {
      next(error);
    }
  }
}

export default new OrderController();
