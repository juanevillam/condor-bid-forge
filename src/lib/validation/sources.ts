import { z } from "zod";
import { 
  filenameSchema, 
  ALLOWED_MIME_TYPES, 
  MAX_FILE_SIZE, 
  MAX_FILES_PER_UPLOAD,
  VALID_LABELS,
  sanitizeFilename 
} from "./common";

// Re-export constants for external use
export { ALLOWED_MIME_TYPES, MAX_FILE_SIZE, MAX_FILES_PER_UPLOAD };

export const sourceTypeSchema = z.enum(['pdf', 'docx', 'xlsx', 'txt', 'note', 'custom']);

export const sourceSchema = z.object({
  id: z.string().uuid("Invalid source ID"),
  name: filenameSchema,
  type: sourceTypeSchema,
  size: z.string().min(1, "Size is required"),
  path: z.string().optional(),
  labels: z.array(z.enum(VALID_LABELS)).optional(),
  createdAt: z.string().datetime("Invalid creation date"),
  isNote: z.boolean().optional(),
  dataUrl: z.string().optional()
});

export const fileUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      `File size must be less than ${Math.round(MAX_FILE_SIZE / (1024 * 1024))}MB`
    )
    .refine(
      (file) => ALLOWED_MIME_TYPES.includes(file.type as any),
      "File type not supported. Please upload PDF, DOCX, XLSX, or TXT files only"
    )
    .refine(
      (file) => {
        const sanitized = sanitizeFilename(file.name);
        return sanitized.length > 0 && sanitized.includes('.');
      },
      "Invalid filename"
    )
});

export const bulkFileUploadSchema = z.object({
  files: z
    .array(fileUploadSchema.shape.file)
    .max(20, "Cannot upload more than 20 files at once")
    .min(1, "Please select at least one file")
});

export const sourceLabelsSchema = z
  .array(z.enum(VALID_LABELS))
  .min(1, "At least one label is required")
  .max(5, "Cannot have more than 5 labels");

export type SourceData = z.infer<typeof sourceSchema>;
export type FileUploadData = z.infer<typeof fileUploadSchema>;
export type BulkFileUploadData = z.infer<typeof bulkFileUploadSchema>;