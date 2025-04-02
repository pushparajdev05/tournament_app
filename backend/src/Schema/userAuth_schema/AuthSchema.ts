import { z } from "zod";

//Password and email schema for reset password
export const passwordResetSchema = z.object({
    email: z.string().email("Valid email is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters long"),
});

//User validation schema for registration
export const User = z.object({
  email: z.string().email(),
  username: z.string().min(1),
  password: z.string().min(6), // Minimum length for security
  isVerified: z.boolean().optional(),
  resetPasswordToken: z.string().optional(),
  resetPasswordExpires: z.number().optional(),
});

//Email Schema of zod
export const emailSchema = z.object({
    email: z.string().email("Invalid email format"),
});

export { z };