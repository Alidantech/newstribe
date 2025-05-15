import Joi from "joi";

// signin schema
export const signinSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// signup schema
export const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  username: Joi.string().required(),
});

// reset password schema
export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

// change password schema
export const resetPasswordSchema = Joi.object({
  password: Joi.string().min(6).required(),
  newPassword: Joi.string().min(6).required(),
});
