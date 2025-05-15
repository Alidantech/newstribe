import { Router } from "express";
import * as rewardsController from "./controller";
import { protectedRoute } from "../../middleware/auth-user";

const router = Router();

// Public routes
router.get("/", rewardsController.getAllRewards);
router.get("/active", rewardsController.getActiveRewards);
router.get("/type/:type", rewardsController.getRewardsByType);
router.get("/:rewardId", rewardsController.getRewardById);

router.use(protectedRoute);

// Admin only routes
router.post("/", protectedRoute, rewardsController.createReward);
router.put("/:rewardId", protectedRoute, rewardsController.updateReward);
router.delete("/:rewardId", protectedRoute, rewardsController.deleteReward);

export default router; 