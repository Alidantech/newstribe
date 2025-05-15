import { Router } from 'express';
import { protectedRoute } from '../../../middleware/auth-user';
import * as redeemController from './controller';


const router = Router();

/**
 * @route POST /users/redeem/airtime
 * @desc Redeem points for airtime
 * @access Private
 */
router.post('/airtime', protectedRoute, redeemController.redeemAirtime);

/**
 * @route GET /users/redeem/balance
 * @desc Get user's points balance
 * @access Private
 */
router.get('/balance', protectedRoute, redeemController.getPointsBalance);

export default router;

