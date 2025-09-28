
import express from "express";

// import userRouter from "@/routes/user";
import authRouter from "@/routes/auth";
import productRouter from "@/routes/products";
import blogRouter from "@/routes/blogs"; 
import { brandRoutes } from "@/routes/brands";
import {categoryRoutes} from "@/routes/categories";
import colorRouter from "@/routes/colors";
import voucherRouter from "@/routes/vouchers";

const router = express.Router();
const API_V1 = "/api/v1";

router.use(`${API_V1}/auth`, authRouter);
// router.use(`${API_V1}/users`, userRouter);
router.use(`${API_V1}/products`, productRouter);

router.use(`${API_V1}/blogs`, blogRouter);

router.use(`${API_V1}/brands`, brandRoutes);

router.use(`${API_V1}/categories`, categoryRoutes);

router.use(`${API_V1}/colors`, colorRouter);

router.use(`${API_V1}/vouchers`, voucherRouter)

export default router;
