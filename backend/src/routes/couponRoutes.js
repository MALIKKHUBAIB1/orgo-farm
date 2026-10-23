import { Router } from "express";
import { listActiveCoupons } from "../controllers/couponController.js";
import { ah } from "../middleware/asyncHandler.js";

const router = Router();

router.get("/", ah(listActiveCoupons));

export default router;
