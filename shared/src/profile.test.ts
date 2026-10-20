import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  MAX_PROFILE_ENTRIES,
  educationInputSchema,
  experienceInputSchema,
  profileInputSchema,
  toResumeData,
  type ExperienceInput,
  type ProfileInput,
} from './profile.js';

const baseProfile: ProfileInput = {
  fullName: 'Ada Lovelace',
  email: 'ada@example.com',
  phone: '+44 20 0000',
};

const experience = (overrides: Partial<ExperienceInput> = {}): ExperienceInput => ({
  companyName: 'Analytical Engines Ltd',
  roleTitle: 'Engineer',
  startMonth: '2020-04',
  ...overrides,
});

/** First error message per path, e.g. { "experiences.0.endMonth": "..." }. */
function errorsOf(result: { success: boolean; error?: { issues: { path: PropertyKey[]; message: string }[] } }) {
  assert.equal(result.success, false, 'expected validation to fail');
  return Object.fromEntries(result.error!.issues.map((i) => [i.path.join('.'), i.message]));
}

describe('profileInputSchema', () => {
  it('fills defaults: everything shown, empty lists, null job title', () => {
    const p = profileInputSchema.parse(baseProfile);
    assert.deepEqual(p.visibility, { jobTitle: true, email: true, phone: true, linkedinUrl: true });
    assert.deepEqual(p.experiences, []);
    assert.deepEqual(p.educations, []);
    assert.equal(p.jobTitle, null);
  });

  it('keeps explicit false and defaults the rest', () => {
    const p = profileInputSchema.parse({ ...baseProfile, visibility: { phone: false } });
    assert.deepEqual(p.visibility, { jobTitle: true, email: true, phone: false, linkedinUrl: true });
  });

  it('rejects unknown visibility keys', () => {
    const errors = errorsOf(profileInputSchema.safeParse({ ...baseProfile, visibility: { fullName: false } }));
    assert.ok('visibility' in errors, JSON.stringify(errors));
  });

  it('trims text, lowercases email, and turns blank job title into null', () => {
    const p = profileInputSchema.parse({
      ...baseProfile,
      fullName: '  Ada  ',
      email: ' ADA@Example.com ',
      jobTitle: '   ',
    });
    assert.equal(p.fullName, 'Ada');
    assert.equal(p.email, 'ada@example.com');
    assert.equal(p.jobTitle, null);
  });

  it('reuses the user rules (required name, valid email, http(s) LinkedIn)', () => {
    const errors = errorsOf(
      profileInputSchema.safeParse({
        ...baseProfile,
        fullName: '',
        email: 'nope',
        linkedinUrl: 'javascript:alert(1)',
      }),
    );
    assert.equal(errors.fullName, 'Full name is required');
    assert.equal(errors.email, 'Enter a valid email address');
    assert.equal(errors.linkedinUrl, 'Enter a valid http(s) URL');
  });

  it(`limits lists to ${MAX_PROFILE_ENTRIES} entries`, () => {
    const many = Array.from({ length: MAX_PROFILE_ENTRIES + 1 }, () => experience());
    const errors = errorsOf(profileInputSchema.safeParse({ ...baseProfile, experiences: many }));
    assert.equal(errors.experiences, `Add at most ${MAX_PROFILE_ENTRIES} companies`);
    assert.ok(profileInputSchema.safeParse({ ...baseProfile, experiences: many.slice(1) }).success);
  });

  it('reports errors with the entry index in the path', () => {
    const errors = errorsOf(
      profileInputSchema.safeParse({
        ...baseProfile,
        experiences: [experience(), experience({ companyName: '' })],
      }),
    );
    assert.equal(errors['experiences.1.companyName'], 'Company name is required');
  });
});

describe('experienceInputSchema', () => {
  it('accepts a current job (no end month) and normalizes optional fields', () => {
    const e = experienceInputSchema.parse(experience({ companyAddress: '  ' }));
    assert.equal(e.endMonth, null);
    assert.equal(e.companyAddress, null);
    assert.equal(e.showInResume, true);
    assert.deepEqual(e.visibility, { companyName: true, companyAddress: true, roleTitle: true, period: true });
  });

  it('accepts end month equal to or after start month', () => {
    assert.ok(experienceInputSchema.safeParse(experience({ endMonth: '2020-04' })).success);
    assert.ok(experienceInputSchema.safeParse(experience({ endMonth: '2023-01' })).success);
  });

  it('rejects end month before start month, on the endMonth field', () => {
    const errors = errorsOf(experienceInputSchema.safeParse(experience({ startMonth: '2021-05', endMonth: '2020-12' })));
    assert.equal(errors.endMonth, 'End month can’t be before the start month');
  });

  it('requires YYYY-MM months', () => {
    for (const bad of ['2020-4', '2020-13', '2020-00', '2020/04', '2020-04-01', '']) {
      const errors = errorsOf(experienceInputSchema.safeParse(experience({ startMonth: bad })));
      assert.equal(errors.startMonth, 'Use the format YYYY-MM', `"${bad}"`);
    }
  });

  it('requires company name and role title', () => {
    const errors = errorsOf(experienceInputSchema.safeParse(experience({ companyName: ' ', roleTitle: '' })));
    assert.equal(errors.companyName, 'Company name is required');
    assert.equal(errors.roleTitle, 'Role title is required');
  });
});

describe('educationInputSchema', () => {
  it('accepts minimal entry and nulls optional fields', () => {
    const e = educationInputSchema.parse({ institution: 'University of London', degree: 'BSc' });
    assert.equal(e.fieldOfStudy, null);
    assert.equal(e.graduationYear, null);
    assert.equal(e.showInResume, true);
  });

  it('validates graduation year', () => {
    const base = { institution: 'U', degree: 'BSc' };
    assert.equal(errorsOf(educationInputSchema.safeParse({ ...base, graduationYear: 1850 })).graduationYear, 'Graduation year must be 1900 or later');
    assert.equal(errorsOf(educationInputSchema.safeParse({ ...base, graduationYear: 2019.5 })).graduationYear, 'Graduation year must be a whole number');
    assert.ok(educationInputSchema.safeParse({ ...base, graduationYear: 2019 }).success);
  });
});

describe('toResumeData', () => {
  const full = profileInputSchema.parse({
    ...baseProfile,
    jobTitle: 'Software Engineer',
    linkedinUrl: 'https://www.linkedin.com/in/ada',
    experiences: [
      experience({ companyName: 'A Corp', companyAddress: 'Tokyo', startMonth: '2019-01', endMonth: '2021-03' }),
      experience({ companyName: 'B Corp', startMonth: '2021-04' }),
    ],
    educations: [{ institution: 'Univ', degree: 'BSc', fieldOfStudy: 'Mathematics', graduationYear: 2018 }],
  });

  it('includes everything when all is shown, in order', () => {
    assert.deepEqual(toResumeData(full), {
      fullName: 'Ada Lovelace',
      jobTitle: 'Software Engineer',
      email: 'ada@example.com',
      phone: '+44 20 0000',
      linkedinUrl: 'https://www.linkedin.com/in/ada',
      experiences: [
        { companyName: 'A Corp', companyAddress: 'Tokyo', roleTitle: 'Engineer', period: { start: '2019-01', end: '2021-03' } },
        { companyName: 'B Corp', roleTitle: 'Engineer', period: { start: '2021-04', end: null } },
      ],
      educations: [{ institution: 'Univ', degree: 'BSc', fieldOfStudy: 'Mathematics', graduationYear: 2018 }],
    });
  });

  it('leaves out hidden user fields but always keeps the name', () => {
    const r = toResumeData({
      ...full,
      visibility: { jobTitle: false, email: true, phone: false, linkedinUrl: false },
    });
    assert.deepEqual(Object.keys(r).sort(), ['educations', 'email', 'experiences', 'fullName']);
  });

  it('leaves out hidden fields inside an entry', () => {
    const r = toResumeData({
      ...full,
      experiences: [{ ...full.experiences[0], visibility: { ...full.experiences[0].visibility, companyAddress: false, period: false } }],
    });
    assert.deepEqual(r.experiences, [{ companyName: 'A Corp', roleTitle: 'Engineer' }]);
  });

  it('drops entries switched off, or with nothing visible left', () => {
    const allHidden = { companyName: false, companyAddress: false, roleTitle: false, period: false };
    const r = toResumeData({
      ...full,
      experiences: [
        { ...full.experiences[0], showInResume: false },
        { ...full.experiences[1], visibility: allHidden },
      ],
      educations: [{ ...full.educations[0], showInResume: false }],
    });
    assert.deepEqual(r.experiences, []);
    assert.deepEqual(r.educations, []);
  });

  it('omits empty optional values even when shown', () => {
    const r = toResumeData(profileInputSchema.parse({ ...baseProfile, educations: [{ institution: 'Univ', degree: 'BSc' }] }));
    assert.equal('jobTitle' in r, false);
    assert.equal('linkedinUrl' in r, false);
    assert.deepEqual(r.educations, [{ institution: 'Univ', degree: 'BSc' }]);
  });
});
