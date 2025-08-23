import { z } from "zod";
import { safeTextSchema, optionalLongTextSchema } from "./common";

export const noteSchema = z.object({
  id: z.string().uuid("Invalid note ID"),
  title: safeTextSchema,
  body: optionalLongTextSchema,
  createdAt: z.string().datetime("Invalid creation date"),
  updatedAt: z.string().datetime("Invalid update date").optional()
});

export const createNoteSchema = z.object({
  title: safeTextSchema,
  body: z.string().max(10000, "Note content must be 10,000 characters or less").optional()
});

export const updateNoteSchema = z.object({
  title: safeTextSchema.optional(),
  body: z.string().max(10000, "Note content must be 10,000 characters or less").optional()
});

export const chatMessageSchema = z.object({
  content: z
    .string()
    .min(1, "Message cannot be empty")
    .max(5000, "Message must be 5,000 characters or less")
    .transform((content) => 
      content
        .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Remove control chars
        .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remove zero-width chars
        .replace(/<[^>]*>/g, '') // Strip HTML tags
        .trim()
        .replace(/\s+/g, ' ') // Collapse whitespace
    )
});

export type NoteData = z.infer<typeof noteSchema>;
export type CreateNoteData = z.infer<typeof createNoteSchema>;
export type UpdateNoteData = z.infer<typeof updateNoteSchema>;
export type ChatMessageData = z.infer<typeof chatMessageSchema>;