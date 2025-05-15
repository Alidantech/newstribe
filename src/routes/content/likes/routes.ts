import { Router } from "express";
import * as likesController from "./controller";
import { protectedRoute } from "../../../middleware/auth-user";

const router = Router();

// Public routes
router.get("/", likesController.getAllLikes);
router.get("/content/:contentId", likesController.getLikesByContent);
router.get("/content/:contentId/count", likesController.getLikeCount);
router.get("/user/:userId", likesController.getLikesByUser);
router.get("/:likeId", likesController.getLikeById);

// Protected routes
router.use(protectedRoute);
router.post("/", likesController.createLike);
router.delete("/:likeId", likesController.deleteLike);
router.get("/content/:contentId/check", likesController.checkUserLike);

export default router; 