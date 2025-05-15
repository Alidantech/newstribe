import { Router } from "express";
import * as rewardsController from "./controller";
import { protectedRoute } from "../../../middleware/auth-user";

const router = Router();

// All routes are protected
router.use(protectedRoute);

/**
 * @route POST /users/rewards
 * @desc Redeem a reward
 * @access Private
 */
router.post("/", rewardsController.redeemReward);

/**
 * @route GET /users/rewards
 * @desc Get user's redeemed rewards
 * @access Private
 */
router.get("/", rewardsController.getUserRewards);

/**
 * @route GET /users/rewards/stats
 * @desc Get user's reward statistics
 * @access Private
 */
router.get("/stats", rewardsController.getUserRewardStats);

/**
 * @route DELETE /users/rewards/:rewardId
 * @desc Cancel a reward redemption
 * @access Private
 */
router.delete("/:rewardId", rewardsController.cancelRewardRedemption);

export default router; 