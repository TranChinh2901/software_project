import { requireAdmin } from "@/middlewares/auth.middleware";
// import { validateBody } from "@/middlewares/validate.middleware";
// import { VoucherSchema } from "@/modules/vouchers/schema/voucher.schema";
import voucherController from "@/modules/vouchers/voucher.controller";
import express from "express";
const router = express.Router();

router.post("/", 
    requireAdmin(),
    // validateBody(VoucherSchema),
    voucherController.createVoucher
)

export default router;