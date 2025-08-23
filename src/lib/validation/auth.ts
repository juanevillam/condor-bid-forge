import { z } from "zod";
import { emailSchema, passwordSchema, safeTextSchema } from "./common";

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required")
});

export const registerSchema = z.object({
  name: safeTextSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string()
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  }
);

export const forgotPasswordSchema = z.object({
  email: emailSchema
});

export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;