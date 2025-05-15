import { Request, Response } from 'express';
import { catchAsyncError } from '../../../utils/api.catcher';
import { ApiResponse } from '../../../utils/api.response';
import * as redeemService from './service';
import * as userService from '../service';
import { ApiError } from '../../../utils/api.errors';

/**
 * Redeem points for airtime
 */
export const redeemAirtime = catchAsyncError(async (req: Request | any, res: Response) => {
  const { amount } = req.body;
  const userId = req.user._id;

  // Get user's current points
  const user = await userService.getUserByIdService(userId);
  
  // Validate if user has enough points
  if (!redeemService.validatePointsForRedemption(user.points || 0, amount)) {
    const requiredPoints = redeemService.kesToPoints(amount);
    throw new ApiError(400, `Insufficient points. You need ${requiredPoints} points for ${amount} KES.`);
  }

  // Send airtime
  const response = await redeemService.sendAirtime(user.phone || '', amount);

  // Deduct points from user
  const pointsToDeduct = redeemService.calculatePointsToDeduct(amount);
  await userService.updateUserService(userId, {
    points: (user.points || 0) - pointsToDeduct
  });

  ApiResponse.success(res, { 
    amount,
    pointsDeducted: pointsToDeduct,
    remainingPoints: (user.points || 0) - pointsToDeduct,
    airtimeResponse: response
  }, 'Airtime redeemed successfully');
});

/**
 * Get user's points balance
 */
export const getPointsBalance = catchAsyncError(async (req: Request | any, res: Response) => {
  const user = await userService.getUserByIdService(req.user._id);
  
  ApiResponse.success(res, {
    points: user.points || 0,
    equivalentKes: redeemService.pointsToKes(user.points || 0)
  }, 'Points balance retrieved successfully');
}); 