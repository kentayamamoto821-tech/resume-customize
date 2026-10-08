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
  fullName: z.string().trim().min(1).max(200),
  phone: z.string().trim().min(1).max(50),
  // Normalize before validating so " Ada@Example.com" is accepted and stored lowercase.
  email: z.string().trim().toLowerCase().pipe(z.email()),
  linkedinUrl: z.url().nullish(),
});
export type UserCreateInput = z.infer<typeof userCreateSchema>;

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

export const experienceInputSchema = z.object({
  company: z.string().min(1),
  title: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
  highlights: z.array(z.string()).default([]),
});
export type ExperienceInput = z.infer<typeof experienceInputSchema>;
export type Experience = ExperienceInput & { id: number; userId: number };

export const educationInputSchema = z.object({
  institution: z.string().min(1),
  degree: z.string().min(1),
  fieldOfStudy: z.string().optional(),
  graduationYear: z.number().int().optional(),
});
export type EducationInput = z.infer<typeof educationInputSchema>;
export type Education = EducationInput & { id: number; userId: number };

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
