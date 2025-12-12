import express from "express";
import momoController from "@/modules/momo/momo.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

const router = express.Router();

router.post("/create-payment", authMiddleware(), momoController.createPayment.bind(momoController));

router.post("/callback", momoController.handleCallback.bind(momoController));

router.get("/return", momoController.handleReturn.bind(momoController));

router.post("/verify-payment", authMiddleware(), momoController.verifyPayment.bind(momoController));

router.get("/check-status/:orderId", authMiddleware(), momoController.checkTransactionStatus.bind(momoController));

export default router;