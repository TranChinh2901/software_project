import express from "express";

import userRouter from "@/routes/user";
import authRouter from "@/routes/auth";
import productRouter from "@/routes/products";

const router = express.Router();
const API_V1 = "/api/v1";

router.use(`${API_V1}/auth`, authRouter);
router.use(`${API_V1}/users`, userRouter);
router.use(`${API_V1}/products`, productRouter);

export default router;
