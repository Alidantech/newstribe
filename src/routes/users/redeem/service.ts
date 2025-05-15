import AfricasTalking from 'africastalking';
import { IAirtimeOptions, POINTS_TO_KES_RATIO } from '../../ussd/types';
import { ApiError } from '../../../utils/api.errors';
import { AFRICAS_TALKING_API_KEY, AFRICAS_TALKING_USERNAME } from '../../../config/env.config';

// Initialize Africa's Talking
const credentials = {
  apiKey: AFRICAS_TALKING_API_KEY,
  username: AFRICAS_TALKING_USERNAME
};

const africastalking = AfricasTalking(credentials) as any;
const airtime = africastalking.Airtime;

/**
 * Convert points to KES amount
 */
export const pointsToKes = (points: number): number => {
  return points / POINTS_TO_KES_RATIO;
};

/**
 * Convert KES amount to points
 */
export const kesToPoints = (kes: number): number => {
  return kes * POINTS_TO_KES_RATIO;
};

/**
 * Send airtime to a phone number
 */
export const sendAirtime = async (phoneNumber: string, amount: number): Promise<any> => {
  try {
    const options: IAirtimeOptions = {
      recipients: [
        {
          phoneNumber,
          amount,
          currencyCode: 'KES'
        }
      ]
    };

    const response = await airtime.send(options);
    return response;
  } catch (error) {
    console.error('Error sending airtime:', error);
    throw new ApiError(500, 'Failed to send airtime');
  }
};

/**
 * Validate if user has enough points for redemption
 */
export const validatePointsForRedemption = (userPoints: number, amountInKes: number): boolean => {
  const requiredPoints = kesToPoints(amountInKes);
  return userPoints >= requiredPoints;
};

/**
 * Calculate points to deduct for airtime redemption
 */
export const calculatePointsToDeduct = (amountInKes: number): number => {
  return kesToPoints(amountInKes);
}; 