import { Request, Response, NextFunction } from "express";
import momoService from "./momo.service";
import { AppResponse } from "@/common/success.response";
import { HttpStatusCode } from "@/constants/status-code";

export class MomoController {

  async createPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { order_id, amount, orderInfo } = req.body;

      if (!order_id || !amount) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "order_id và amount là bắt buộc"
        });
      }

      const result = await momoService.createPayment({
        order_id: Number(order_id),
        amount: Number(amount),
        orderInfo
      });

      return new AppResponse({
        message: "Tạo yêu cầu thanh toán thành công",
        statusCode: HttpStatusCode.OK,
        data: result
      }).sendResponse(res);
    } catch (error) {
      next(error);
    }
  }


  async handleCallback(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("MoMo IPN Callback:", JSON.stringify(req.body, null, 2));
      
      const result = await momoService.handleCallback(req.body);
      return res.status(HttpStatusCode.NO_CONTENT).send();
    } catch (error) {
      console.error("MoMo Callback Error:", error);
      return res.status(HttpStatusCode.NO_CONTENT).send();
    }
  }


  async handleReturn(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("MoMo Return Query:", req.query);
      
      const result = await momoService.handleReturn(req.query);
      
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
      const redirectUrl = `${frontendUrl}/checkout/momo-return?success=${result.success}&order_id=${result.order_id || ""}&message=${encodeURIComponent(result.message)}`;
      
      return res.redirect(redirectUrl);
    } catch (error) {
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
      return res.redirect(`${frontendUrl}/checkout/momo-return?success=false&message=${encodeURIComponent("Có lỗi xảy ra")}`);
    }
  }

 
  async checkTransactionStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId } = req.params;

      if (!orderId) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "orderId là bắt buộc"
        });
      }

      const result = await momoService.checkTransactionStatus(orderId);

      return new AppResponse({
        message: "Kiểm tra trạng thái thành công",
        statusCode: HttpStatusCode.OK,
        data: result
      }).sendResponse(res);
    } catch (error) {
      next(error);
    }
  }

  async verifyPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId, resultCode, transId, amount, extraData } = req.body;

      console.log("MoMo Verify Payment:", req.body);

      const result = await momoService.verifyAndUpdatePayment({
        orderId,
        resultCode: Number(resultCode),
        transId,
        amount: Number(amount),
        extraData
      });

      return new AppResponse({
        message: result.message,
        statusCode: HttpStatusCode.OK,
        data: { success: result.success, order_id: result.order_id }
      }).sendResponse(res);
    } catch (error) {
      next(error);
    }
  }
}

export default new MomoController();
