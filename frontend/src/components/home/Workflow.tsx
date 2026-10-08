import { Box, Container, Flex, Stack, Text } from '@chakra-ui/react';
import { THEMES } from '@resume/shared';
import { SectionHeading } from './SectionHeading';

interface Step {
  title: string;
  description: string;
  tags: string[];
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const steps: Step[] = [
  {
    title: 'Personal profile',
    description: 'Enter your contact details and professional identity.',
    tags: ['Full name', 'Phone', 'Email', 'LinkedIn'],
  },
  {
    title: 'Professional experience',
    description: 'Record your work history to show how your career has progressed.',
    tags: ['Company', 'Job title', 'Duration', 'Achievements'],
  },
  {
    title: 'Education background',
    description: 'Add your degrees and certifications.',
    tags: ['Institution', 'Degree', 'Field of study', 'Graduation year'],
  },
  {
    title: 'Theme selection',
    description: 'Pick a layout and design template for the final document.',
    tags: THEMES.map(capitalize),
  },
  {
    title: 'Target job description',
    description:
      'Paste the job posting text or a link to it. The engine extracts the key skills, qualifications and keywords.',
    tags: ['Raw text', 'Job URL', 'Keyword extraction'],
  },
  {
    title: 'Generate & download',
    description:
      'Your experience is matched to the role, bullet points are optimized, and a themed resume is produced.',
    tags: ['PDF', 'DOCX'],
  },
];

export function Workflow() {
  return (
    <Box as="section" id="workflow" py={{ base: '16', md: '24' }} borderTopWidth="1px" scrollMarginTop="14">
      <Container maxW="5xl">
        <SectionHeading
          eyebrow="Workflow"
          title="Six steps from background to tailored resume"
          description="Enter your details once, then point the engine at any job. Each step builds on the last."
        />

        <Stack as="ol" gap="0" mt="12" listStyleType="none">
          {steps.map((step, i) => (
            <StepRow key={step.title} step={step} index={i + 1} />
          ))}
        </Stack>
      </Container>
    </Box>
  );
}

function StepRow({ step, index }: { step: Step; index: number }) {
  return (
    <Flex
      as="li"
      direction={{ base: 'column', md: 'row' }}
      gap={{ base: '2', md: '8' }}
      py="6"
      borderTopWidth="1px"
      _last={{ borderBottomWidth: '1px' }}
    >
      <Text
        fontSize="sm"
        color="fg.subtle"
        fontVariantNumeric="tabular-nums"
        w={{ md: '10' }}
        flexShrink="0"
        pt="0.5"
      >
        {String(index).padStart(2, '0')}
      </Text>

      <Stack gap="1" flex="1">
        <Text fontWeight="medium">{step.title}</Text>
        <Text color="fg.muted" fontSize="sm">
          {step.description}
        </Text>
      </Stack>

      <Text
        fontSize="sm"
        color="fg.subtle"
        w={{ md: '64' }}
        flexShrink="0"
        textAlign={{ md: 'right' }}
        pt="0.5"
      >
        {step.tags.join(' · ')}
      </Text>
    </Flex>
  );
}
