import express from "express";
import momoController from "@/modules/momo/momo.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

const router = express.Router();

// Tạo yêu cầu thanh toán MoMo (cần đăng nhập)
router.post("/create-payment", authMiddleware(), momoController.createPayment.bind(momoController));

// Callback từ MoMo (IPN) - không cần auth
router.post("/callback", momoController.handleCallback.bind(momoController));

// Return URL sau khi thanh toán - không cần auth
router.get("/return", momoController.handleReturn.bind(momoController));

// Kiểm tra trạng thái giao dịch
router.get("/check-status/:orderId", authMiddleware(), momoController.checkTransactionStatus.bind(momoController));

export default router;