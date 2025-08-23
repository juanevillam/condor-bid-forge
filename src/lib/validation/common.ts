import { z } from "zod";

// Common sanitization functions
export const sanitizeText = (input: string): string => {
  // Remove control characters and normalize whitespace
  return input
    .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Remove control chars
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remove zero-width chars
    .replace(/[<>`]/g, '') // Remove potential HTML injection chars
    .replace(/[\u2013\u2014]/g, '-') // en/em dash -> hyphen
    .trim()
    .replace(/\s+/g, ' '); // Collapse whitespace
};

export const sanitizeLongText = (input: string): string => {
  // For longer text like note bodies and chat messages
  return input
    .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Remove control chars
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remove zero-width chars
    .replace(/<[^>]*>/g, '') // Strip HTML tags
    .replace(/[`]/g, '') // Remove backticks
    .trim()
    .replace(/\s+/g, ' '); // Collapse whitespace
};

export const sanitizeFilename = (filename: string): string => {
  // Normalize unicode and sanitize filename
  return filename
    .normalize('NFC')
    .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Remove control chars
    .replace(/[<>:"|?*\\\/]/g, '') // Remove invalid filename chars
    .replace(/\.\./g, '') // Remove path traversal
    .trim();
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.toLowerCase().trim());
};

// Common validation schemas
export const safeTextSchema = z
  .string()
  .min(1, "This field is required")
  .max(120, "Must be 120 characters or less")
  .transform(sanitizeText)
  .refine(
    // Allow letters (incl. accents), digits, spaces, and common punctuation:
    // . , ' ( ) & - : / + _
    // Also allow en dash (–) and em dash (—)
    (val) => /^[A-Za-zÀ-ÿ0-9\s\.,'()&\-:\/+_–—]+$/.test(val),
    "Contains invalid characters"
  );

export const optionalSafeTextSchema = z
  .string()
  .max(120, "Must be 120 characters or less")
  .transform(sanitizeText)
  .refine(
    (val) => val === '' || /^[A-Za-zÀ-ÿ0-9\s\.,'()&\-:\/+_–—]+$/.test(val),
    "Contains invalid characters"
  )
  .optional();

export const longTextSchema = z
  .string()
  .max(10000, "Must be 10,000 characters or less")
  .transform(sanitizeLongText);

export const optionalLongTextSchema = z
  .string()
  .max(10000, "Must be 10,000 characters or less")
  .transform(sanitizeLongText)
  .optional();

export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .max(254, "Email is too long")
  .email("Please enter a valid email address")
  .transform((email) => email.toLowerCase().trim());

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be 128 characters or less")
  .refine(
    (password) => /[A-Za-z]/.test(password) && /[0-9]/.test(password),
    "Password must contain both letters and numbers"
  );

export const dateSchema = z
  .string()
  .min(1, "Date is required")
  .refine(
    (date) => {
      const parsed = new Date(date);
      return !isNaN(parsed.getTime());
    },
    "Please enter a valid date"
  );

export const optionalDateSchema = z
  .string()
  .refine(
    (date) => {
      if (!date) return true;
      const parsed = new Date(date);
      return !isNaN(parsed.getTime());
    },
    "Please enter a valid date"
  )
  .optional();

// File validation constants
export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain'
] as const;

export const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
export const MAX_FILES_PER_UPLOAD = 20;

export const VALID_LABELS = ['Legal', 'Finance', 'Technical', 'Commercial', 'Admin'] as const;

// Filename validation
export const filenameSchema = z
  .string()
  .min(1, "Filename is required")
  .max(200, "Filename must be 200 characters or less")
  .transform(sanitizeFilename)
  .refine(
    (filename) => filename.includes('.'),
    "Filename must include an extension"
  )
  .refine(
    (filename) => /^[A-Za-z0-9\s._()-]+$/.test(filename),
    "Filename contains invalid characters"
  );