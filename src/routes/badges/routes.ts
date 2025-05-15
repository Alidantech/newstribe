import { Router } from "express";
import * as badgesController from "./controller";
import { protectedRoute } from "../../middleware/auth-user";

const router = Router();

// Public routes
router.get("/", badgesController.getAllBadges);
router.get("/:badgeId", badgesController.getBadgeById);
router.get("/criteria", badgesController.getBadgesByCriteria);

// Admin only routes
router.use(protectedRoute);
router.post("/", badgesController.createBadge);
router.put("/:badgeId", badgesController.updateBadge);
router.delete("/:badgeId", badgesController.deleteBadge);

export default router;
