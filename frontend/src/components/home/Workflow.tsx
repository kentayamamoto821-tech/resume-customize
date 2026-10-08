import {
  Badge,
  Box,
  Card,
  Container,
  Flex,
  HStack,
  Icon,
  SimpleGrid,
  Text,
  Wrap,
} from '@chakra-ui/react';
import type { IconType } from 'react-icons';
import {
  LuBriefcase,
  LuFileCheck,
  LuFileSearch,
  LuGraduationCap,
  LuPalette,
  LuUser,
} from 'react-icons/lu';
import { THEMES } from '@resume/shared';
import { SectionHeading } from './SectionHeading';

interface Step {
  icon: IconType;
  title: string;
  description: string;
  tags: string[];
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const steps: Step[] = [
  {
    icon: LuUser,
    title: 'Personal profile',
    description: 'Enter your contact details and professional identity.',
    tags: ['Full name', 'Phone', 'Email', 'LinkedIn'],
  },
  {
    icon: LuBriefcase,
    title: 'Professional experience',
    description: 'Record your work history to show how your career has progressed.',
    tags: ['Company', 'Job title', 'Duration', 'Achievements'],
  },
  {
    icon: LuGraduationCap,
    title: 'Education background',
    description: 'Add your degrees and certifications.',
    tags: ['Institution', 'Degree', 'Field of study', 'Graduation year'],
  },
  {
    icon: LuPalette,
    title: 'Theme selection',
    description: 'Pick a layout and design template for the final document.',
    tags: THEMES.map(capitalize),
  },
  {
    icon: LuFileSearch,
    title: 'Target job description',
    description:
      'Paste the job posting text or a link to it. The engine extracts the key skills, qualifications and keywords.',
    tags: ['Raw text', 'Job URL', 'Keyword extraction'],
  },
  {
    icon: LuFileCheck,
    title: 'Generate & download',
    description:
      'Your experience is matched to the role, bullet points are optimized, and a themed resume is produced.',
    tags: ['PDF', 'DOCX'],
  },
];

export function Workflow() {
  return (
    <Box
      as="section"
      id="workflow"
      py={{ base: '20', md: '28' }}
      bg="bg.subtle"
      borderYWidth="1px"
      scrollMarginTop="16"
    >
      <Container maxW="6xl">
        <SectionHeading
          eyebrow="How it works"
          title="Six steps from background to tailored resume"
          description="Enter your details once, then point the engine at any job. Each step builds on the last."
        />

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap="6" mt="14">
          {steps.map((step, i) => (
            <StepCard key={step.title} step={step} index={i + 1} />
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}

function StepCard({ step, index }: { step: Step; index: number }) {
  return (
    <Card.Root
      rounded="xl"
      variant="elevated"
      transition="transform 0.2s ease, box-shadow 0.2s ease"
      _hover={{ transform: 'translateY(-4px)', shadow: 'lg' }}
    >
      <Card.Body gap="4" p="7">
        <HStack justify="space-between">
          <Flex boxSize="11" align="center" justify="center" rounded="lg" bg="teal.solid">
            <Icon color="teal.contrast" boxSize="5">
              <step.icon />
            </Icon>
          </Flex>
          <Text fontSize="3xl" fontWeight="bold" color="border.emphasized" lineHeight="1">
            {String(index).padStart(2, '0')}
          </Text>
        </HStack>

        <Card.Title fontSize="lg">{step.title}</Card.Title>
        <Text color="fg.muted" flex="1">
          {step.description}
        </Text>

        <Wrap gap="1.5">
          {step.tags.map((tag) => (
            <Badge key={tag} variant="outline" colorPalette="gray" rounded="full" px="2.5">
              {tag}
            </Badge>
          ))}
        </Wrap>
      </Card.Body>
    </Card.Root>
  );
}
