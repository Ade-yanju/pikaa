import { z } from "zod";

export const emailSchema = z.string().trim().toLowerCase().email();

export const registerSchema = z.object({
  full_name: z.string().trim().min(2, "Enter your full name").max(80),
  email: emailSchema,
  country: z.string().trim().min(2, "Select your country").max(60),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
});

export const otpSchema = z.object({
  email: emailSchema,
  token: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Enter the 6-digit code"),
});

export const messageSchema = z.object({
  conversation_id: z.string().uuid(),
  body: z.string().trim().min(1, "Type a message").max(4000),
});

export const paymentRequestSchema = z.object({
  currency: z.string().trim().min(3, "Currency required").max(8),
  amount: z.coerce.number().positive("Enter a valid amount").optional(),
  client_name: z.string().trim().max(120).optional().or(z.literal("")),
  purpose: z.string().trim().max(500).optional().or(z.literal("")),
});

export const companyAccountSchema = z.object({
  label: z.string().trim().min(2).max(80),
  currency: z.string().trim().min(3).max(8),
  region: z.string().trim().max(60).optional().or(z.literal("")),
  bank_name: z.string().trim().max(120).optional().or(z.literal("")),
  account_name: z.string().trim().max(120).optional().or(z.literal("")),
  account_number: z.string().trim().max(60).optional().or(z.literal("")),
  routing_number: z.string().trim().max(60).optional().or(z.literal("")),
});

export type RegisterInput = z.infer<typeof registerSchema>;
