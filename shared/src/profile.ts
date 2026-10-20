import { z } from 'zod';
import { userCreateSchema } from './schemas.js';

/*
 * The full profile a user edits: contact details, job title, worked companies and
 * education, each field with a "show on resume" switch.
 *
 * Visibility maps are { field: boolean }. Missing keys mean "shown", so `{}` shows
 * everything; unknown keys are rejected. Full name is always shown.
 */

export const MAX_PROFILE_ENTRIES = 20;

// ---- helpers ----------------------------------------------------------------

const shown = z.boolean().default(true);

const requiredText = (label: string, max: number) =>
  z.string().trim().min(1, `${label} is required`).max(max, `${label} is too long`);

/** Optional text; empty or whitespace-only becomes null. */
const optionalText = (label: string, max: number) =>
  z
    .string()
    .trim()
    .max(max, `${label} is too long`)
    .nullish()
    .transform((v) => v || null);

/** A calendar month, "YYYY-MM". Stored as the 1st of the month in the database. */
export const monthSchema = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Use the format YYYY-MM');
export type Month = z.infer<typeof monthSchema>;

// ---- visibility -------------------------------------------------------------

export const userVisibilitySchema = z
  .strictObject({ jobTitle: shown, email: shown, phone: shown, linkedinUrl: shown })
  .prefault({});
export type UserVisibility = z.output<typeof userVisibilitySchema>;

export const experienceVisibilitySchema = z
  .strictObject({ companyName: shown, companyAddress: shown, roleTitle: shown, period: shown })
  .prefault({});
export type ExperienceVisibility = z.output<typeof experienceVisibilitySchema>;

export const educationVisibilitySchema = z
  .strictObject({ institution: shown, degree: shown, fieldOfStudy: shown, graduationYear: shown })
  .prefault({});
export type EducationVisibility = z.output<typeof educationVisibilitySchema>;

// ---- entries ----------------------------------------------------------------

export const experienceInputSchema = z
  .object({
    companyName: requiredText('Company name', 200),
    companyAddress: optionalText('Company address', 300),
    roleTitle: requiredText('Role title', 200),
    startMonth: monthSchema,
    /** null means "Present". */
    endMonth: monthSchema.nullish().transform((v) => v ?? null),
    showInResume: z.boolean().default(true),
    visibility: experienceVisibilitySchema,
  })
  // "YYYY-MM" strings compare correctly as text.
  .refine((e) => e.endMonth === null || e.endMonth >= e.startMonth, {
    message: 'End month can’t be before the start month',
    path: ['endMonth'],
  });
export type ExperienceInput = z.input<typeof experienceInputSchema>;
export type ExperienceData = z.output<typeof experienceInputSchema>;
export type Experience = ExperienceData & { id: number };

export const educationInputSchema = z.object({
  institution: requiredText('Institution', 200),
  degree: requiredText('Degree', 200),
  fieldOfStudy: optionalText('Field of study', 200),
  graduationYear: z
    .int('Graduation year must be a whole number')
    .min(1900, 'Graduation year must be 1900 or later')
    .max(2100, 'Graduation year must be 2100 or earlier')
    .nullish()
    .transform((v) => v ?? null),
  showInResume: z.boolean().default(true),
  visibility: educationVisibilitySchema,
});
export type EducationInput = z.input<typeof educationInputSchema>;
export type EducationData = z.output<typeof educationInputSchema>;
export type Education = EducationData & { id: number };

// ---- whole profile ----------------------------------------------------------

/** Body of PUT /api/users/:id/profile. List order is the display order. */
export const profileInputSchema = userCreateSchema.extend({
  jobTitle: optionalText('Job title', 200),
  visibility: userVisibilitySchema,
  experiences: z
    .array(experienceInputSchema)
    .max(MAX_PROFILE_ENTRIES, `Add at most ${MAX_PROFILE_ENTRIES} companies`)
    .default([]),
  educations: z
    .array(educationInputSchema)
    .max(MAX_PROFILE_ENTRIES, `Add at most ${MAX_PROFILE_ENTRIES} education entries`)
    .default([]),
});
export type ProfileInput = z.input<typeof profileInputSchema>;
export type ProfileData = z.output<typeof profileInputSchema>;

/** Response of GET/PUT /api/users/:id/profile. */
export interface UserProfile extends ProfileData {
  id: number;
  experiences: Experience[];
  educations: Education[];
  createdAt: string;
  updatedAt: string;
}

// ---- resume view ------------------------------------------------------------

export interface ResumePeriod {
  start: Month;
  /** null means "Present". */
  end: Month | null;
}

export interface ResumeExperience {
  companyName?: string;
  companyAddress?: string;
  roleTitle?: string;
  period?: ResumePeriod;
}

export interface ResumeEducation {
  institution?: string;
  degree?: string;
  fieldOfStudy?: string;
  graduationYear?: number;
}

/** Exactly what appears on the resume: hidden or empty fields and entries are left out. */
export interface ResumeData {
  fullName: string;
  jobTitle?: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  experiences: ResumeExperience[];
  educations: ResumeEducation[];
}

/** Copies `value` into the result only if it's visible and non-empty. */
function pick<T>(visible: boolean, value: T | null | undefined): T | undefined {
  if (!visible || value === null || value === undefined || value === '') return undefined;
  return value;
}

function compact<T extends object>(obj: T): T {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as T;
}

const hasContent = (obj: object) => Object.keys(obj).length > 0;

/**
 * Applies the "show on resume" switches. Used by the live preview and the resume
 * generator so both always agree on what's shown.
 */
export function toResumeData(profile: ProfileData): ResumeData {
  const v = profile.visibility;

  const experiences = profile.experiences
    .filter((e) => e.showInResume)
    .map((e) =>
      compact<ResumeExperience>({
        companyName: pick(e.visibility.companyName, e.companyName),
        companyAddress: pick(e.visibility.companyAddress, e.companyAddress),
        roleTitle: pick(e.visibility.roleTitle, e.roleTitle),
        period: pick(e.visibility.period, { start: e.startMonth, end: e.endMonth }),
      }),
    )
    .filter(hasContent);

  const educations = profile.educations
    .filter((e) => e.showInResume)
    .map((e) =>
      compact<ResumeEducation>({
        institution: pick(e.visibility.institution, e.institution),
        degree: pick(e.visibility.degree, e.degree),
        fieldOfStudy: pick(e.visibility.fieldOfStudy, e.fieldOfStudy),
        graduationYear: pick(e.visibility.graduationYear, e.graduationYear),
      }),
    )
    .filter(hasContent);

  return compact<ResumeData>({
    fullName: profile.fullName,
    jobTitle: pick(v.jobTitle, profile.jobTitle),
    email: pick(v.email, profile.email),
    phone: pick(v.phone, profile.phone),
    linkedinUrl: pick(v.linkedinUrl, profile.linkedinUrl),
    experiences,
    educations,
  });
}
