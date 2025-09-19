import express from "express";

// import userRouter from "@/routes/user";
import authRouter from "@/routes/auth";
import productRouter from "@/routes/products";
import blogRouter from "@/routes/blogs";

const router = express.Router();
const API_V1 = "/api/v1";

router.use(`${API_V1}/auth`, authRouter);
// router.use(`${API_V1}/users`, userRouter);
router.use(`${API_V1}/products`, productRouter);

router.use(`${API_V1}/blogs`, blogRouter)

export default router;
