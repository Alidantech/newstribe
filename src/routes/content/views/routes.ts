import { Router } from "express";
import * as viewsController from "./controller";
import { protectedRoute } from "../../../middleware/auth-user";

const router = Router();

// Public routes
router.get("/", viewsController.getAllViews);
router.get("/content/:contentId", viewsController.getViewsByContent);
router.get("/content/:contentId/count", viewsController.getViewCount);
router.get("/user/:userId", viewsController.getViewsByUser);
router.get("/:viewId", viewsController.getViewById);

// Protected routes
router.use(protectedRoute);
router.post("/", viewsController.createView);
router.delete("/:viewId", viewsController.deleteView);
router.get("/content/:contentId/check", viewsController.checkUserView);

export default router; 