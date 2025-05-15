import { Router } from "express";
import * as sharesController from "./controller";
import { protectedRoute } from "../../../middleware/auth-user";

const router = Router();

// Public routes
router.get("/", sharesController.getAllShares);
router.get("/content/:contentId", sharesController.getSharesByContent);
router.get("/content/:contentId/count", sharesController.getShareCount);
router.get("/user/:userId", sharesController.getSharesByUser);
router.get("/:shareId", sharesController.getShareById);

// Protected routes
router.use(protectedRoute);
router.post("/", sharesController.createShare);
router.delete("/:shareId", sharesController.deleteShare);
router.get("/content/:contentId/check", sharesController.checkUserShare);

export default router; 