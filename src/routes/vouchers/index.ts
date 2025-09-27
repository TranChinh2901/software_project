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
router.get("/", voucherController.getAllVouchers);

router.get("/:id", voucherController.getVoucherById);

router.put("/:id", 
    requireAdmin(),
    // validateBody(VoucherSchema),
    voucherController.updateVoucher
)
router.delete("/:id", 
    requireAdmin(),
    voucherController.deleteVoucher
)
export default router;