import { z } from 'zod';

export const THEMES = ['modern', 'classic', 'technical', 'creative'] as const;
export const themeSchema = z.enum(THEMES);
export type Theme = z.infer<typeof themeSchema>;

export const idParamSchema = z.coerce.number().int().positive();

export const listQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});
export type ListQuery = z.infer<typeof listQuerySchema>;

export const userCreateSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required').max(200, 'Full name is too long'),
  phone: z.string().trim().min(1, 'Phone is required').max(50, 'Phone is too long'),
  // Normalize before validating so " Ada@Example.com" is accepted and stored lowercase.
  email: z.string().trim().toLowerCase().pipe(z.email('Enter a valid email address')),
  // http(s) only: the URL is rendered as a link, so javascript: and similar must be rejected.
  linkedinUrl: z.url({ protocol: /^https?$/, error: 'Enter a valid http(s) URL' }).nullish(),
});
export type UserCreateInput = z.infer<typeof userCreateSchema>;

export const userListQuerySchema = listQuerySchema.extend({
  q: z
    .string()
    .trim()
    .max(200)
    .optional()
    .transform((v) => v || undefined),
});
export type UserListQuery = z.infer<typeof userListQuerySchema>;

export const userUpdateSchema = userCreateSchema
  .partial()
  .refine((v) => Object.keys(v).length > 0, { message: 'No fields to update' });
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;

export interface User {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  linkedinUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export const jobDescriptionInputSchema = z
  .object({
    rawText: z.string().optional(),
    sourceUrl: z.url().optional(),
  })
  .refine((v) => v.rawText || v.sourceUrl, {
    message: 'Provide rawText or sourceUrl',
  });
export type JobDescriptionInput = z.infer<typeof jobDescriptionInputSchema>;

export const generateResumeSchema = z.object({
  userId: z.number().int(),
  jobDescriptionId: z.number().int(),
  theme: themeSchema,
});
export type GenerateResumeInput = z.infer<typeof generateResumeSchema>;
