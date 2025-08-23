import { z } from "zod";
import { safeTextSchema, optionalSafeTextSchema, optionalDateSchema } from "./common";

export const bidStageSchema = z.enum(['discovery', 'proposal', 'review', 'submitted']);

export const createBidSchema = z.object({
  title: safeTextSchema,
  client: optionalSafeTextSchema,
  submissionDeadline: optionalDateSchema,
  stage: bidStageSchema.optional(),
  description: z.string().max(1000, "Description must be 1000 characters or less").optional()
});

export const updateBidSchema = z.object({
  title: safeTextSchema.optional(),
  client: optionalSafeTextSchema,
  submissionDeadline: optionalDateSchema,
  stage: bidStageSchema.optional()
});

export const bidSetupSchema = z.object({
  title: safeTextSchema,
  client: z.string().max(120, "Client name must be 120 characters or less").optional(),
  submissionDeadline: z.string().optional(),
  stage: z.string().optional(),
  description: z.string().max(1000, "Description must be 1000 characters or less").optional()
});

export type CreateBidData = z.infer<typeof createBidSchema>;
export type UpdateBidData = z.infer<typeof updateBidSchema>;
export type BidSetupData = z.infer<typeof bidSetupSchema>;