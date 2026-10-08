import { z } from 'zod';

export const THEMES = ['modern', 'classic', 'technical', 'creative'] as const;
export const themeSchema = z.enum(THEMES);
export type Theme = z.infer<typeof themeSchema>;

export const profileInputSchema = z.object({
  fullName: z.string().min(1),
  phone: z.string().min(1),
  email: z.email(),
  linkedinUrl: z.url().optional(),
});
export type ProfileInput = z.infer<typeof profileInputSchema>;
export type Profile = ProfileInput & { id: number; createdAt: string };

export const experienceInputSchema = z.object({
  company: z.string().min(1),
  title: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
  highlights: z.array(z.string()).default([]),
});
export type ExperienceInput = z.infer<typeof experienceInputSchema>;
export type Experience = ExperienceInput & { id: number; profileId: number };

export const educationInputSchema = z.object({
  institution: z.string().min(1),
  degree: z.string().min(1),
  fieldOfStudy: z.string().optional(),
  graduationYear: z.number().int().optional(),
});
export type EducationInput = z.infer<typeof educationInputSchema>;
export type Education = EducationInput & { id: number; profileId: number };

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
  profileId: z.number().int(),
  jobDescriptionId: z.number().int(),
  theme: themeSchema,
});
export type GenerateResumeInput = z.infer<typeof generateResumeSchema>;
