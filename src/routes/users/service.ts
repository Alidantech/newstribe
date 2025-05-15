import User from "./model";
import { IUser, UserRoles } from "./type";
import { ApiError } from "../../utils/api.errors";
import { ApiFeatures } from "../../utils/api.features";

/**
 * Generate a 6-digit OTP
 */
export const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Create a random phone number
 */
export const createRandomPhoneNumber = (): string => {
  return "+1" + Math.floor(1000000000 + Math.random() * 9000000000);
};

/**
 * Email OTP Cache
 */
export const emailOtpCache: Record<string, { otp: string; expiresAt: Date }> = {};

/**
 * Create a new user
 */
export const createUserService = async (userData: Partial<IUser>): Promise<IUser> => {
  const user = await User.create(userData);
  return user;
};

/**
 * Get all users with pagination and filters
 */
export const getAllUsersService = async (query: any = {}): Promise<any> => {
  const apiFeatures = new ApiFeatures(User.find().lean(), query)
    .search()
    .filteration()
    .sort()
    .pagination();

  const users = await apiFeatures.getPaginatedData<IUser>("users");
  return users;
};

/**
 * Get user by ID
 */
export const getUserByIdService = async (id: string): Promise<IUser> => {
  const user = await User.findById(id).lean();
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user as IUser;
};

/**
 * Update user
 */
export const updateUserService = async (id: string, updateData: Partial<IUser>): Promise<IUser> => {
  const user = await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user.toObject();
};

/**
 * Delete user
 */
export const deleteUserService = async (id: string): Promise<IUser> => {
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user.toObject();
};

/**
 * Register new user
 */
export const registerUserService = async (
  userData: IUser
): Promise<{
  user: IUser;
}> => {
  const existingUser = await User.findOne({ email: userData.email });

  if (existingUser && existingUser.roles.includes(UserRoles.USER)) {
    throw new ApiError(400, "Email already exists");
  } else if (existingUser && !existingUser.roles.includes(UserRoles.USER)) {
    // Update existing user with new registration details
    existingUser.roles = [...existingUser.roles, UserRoles.USER];
    existingUser.firstName = userData.firstName;
    existingUser.lastName = userData.lastName;
    existingUser.password = userData.password;
    // Add any other relevant fields from userData

    await existingUser.save();

    // Create default organisation for the existing user
    await existingUser.save();
    let userWithoutPassword = existingUser.toObject();
    if (userWithoutPassword.password) {
      delete (userWithoutPassword as any).password;
    }

    return { user: userWithoutPassword };
  }

  // Create new user if no existing user found
  const user = await createUserService(userData);

  if (!user) {
    throw new ApiError(500, "An unexpected error occurred");
  }

  await user.save();

  // Send welcome email
  // await sendWelcomeEmail(user);

  let userWithoutPassword = user.toObject();
  delete userWithoutPassword.password;

  return { user: userWithoutPassword };
};

/**
 * Login user
 */
export const loginUserService = async (email: string, password: string): Promise<IUser> => {
  const user = await User.findOne({ email }).select("+password");
  if (!user || !user.roles.includes(UserRoles.USER)) {
    throw new ApiError(404, "Invalid email or password");
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  let userWithoutPassword = user.toObject() as any;
  delete userWithoutPassword.password;

  return userWithoutPassword;
};

/**
 * Get user by email
 */
export const getUserByEmailService = async (email: string) => {
  const user = await User.findOne({ email }).lean();
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user.toObject();
};

/**
 * Send OTP by email
 */
export const sendOtpByEmailService = async (email: string): Promise<void> => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const otp = generateOtp();
  emailOtpCache[email] = {
    otp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), // Valid for 10 minutes
  };

  // Send OTP email with user's name
  // await sendOtpEmail(email, otp, user.firstName || user.email.split("@")[0]);
};

/**
 * Verify email OTP
 */
export const verifyEmailOtpService = async (email: string, otp: string): Promise<IUser> => {
  const cachedOtpData = emailOtpCache[email];
  if (
    !cachedOtpData ||
    cachedOtpData.otp !== otp ||
    cachedOtpData.expiresAt.getTime() < Date.now()
  ) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  await user.save();

  // Remove OTP from cache after successful verification
  delete emailOtpCache[email];

  return user.toObject();
};

/**
 * Email OTP login
 */
export const emailOtpLoginService = async (email: string): Promise<IUser> => {
  // Try to find existing user
  let user = await User.findOne({ email });

  // If user doesn't exist, create a new one with 'customer' role
  if (!user) {
    user = await User.create({
      email,
      roles: [UserRoles.CUSTOMER],
      // Add any other required default fields
      firstName: email.split("@")[0], // Use email prefix as default name
      lastName: "",
    });
  } else if (!user.roles.includes(UserRoles.CUSTOMER)) {
    user.roles = [...user.roles, UserRoles.CUSTOMER];
    await user.save();
  }

  const otp = generateOtp();
  emailOtpCache[email] = {
    otp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), // OTP expires in 10 minutes
  };

  // Send OTP email with user's name
  // await sendOtpEmail(email, otp, user.firstName || user.email.split("@")[0]);

  return user.toObject();
};

/**
 * SUPER ADMIN AUTHENTICATION
 */

/**
 * Authenticate a SuperAdmin user using email and password.
 *
 * @param email - SuperAdmin's email address
 * @param password - Raw password input
 * @returns User object without password
 * @throws ApiError - If user not found or password is invalid
 */
export const superAdminLoginService = async (email: string, password: string): Promise<IUser> => {
  const user = await User.findOne({ email }).select("+password");

  if (!user || !user.roles.includes(UserRoles.SUPER_ADMIN)) {
    throw new ApiError(404, "Invalid email or password");
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  // const userWithoutPassword = user.toObject();
  // delete userWithoutPassword.password;

  return user.toObject();
};

/**
 * Create a new SuperAdmin user.
 *
 * @param userData - Incoming user object (must include email, password, roles)
 * @returns Created SuperAdmin user
 * @throws ApiError - If user already exists or role is not valid
 */
export const superAdminCreateUserService = async (userData: IUser): Promise<IUser> => {
  const existing = await User.findOne({ email: userData.email });
  if (existing) {
    throw new ApiError(400, "User with this email already exists.");
  }

  if (!userData.roles?.includes(UserRoles.SUPER_ADMIN)) {
    throw new ApiError(403, "Role must include SUPER_ADMIN.");
  }

  const user = await User.create(userData);
  const sanitizedUser = user.toObject();
  // delete sanitizedUser.password;

  return sanitizedUser;
};
