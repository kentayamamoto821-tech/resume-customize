import { Box, Container, Icon, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import type { IconType } from 'react-icons';
import { LuPalette, LuScanSearch, LuTarget } from 'react-icons/lu';
import { SectionHeading } from './SectionHeading';

interface Pillar {
  icon: IconType;
  title: string;
  description: string;
}

const pillars: Pillar[] = [
  {
    icon: LuTarget,
    title: 'Targeted content',
    description:
      'Your experience and education are mapped to what the role asks for, so the most relevant achievements come first.',
  },
  {
    icon: LuScanSearch,
    title: 'Keyword alignment',
    description:
      'Key skills, qualifications and industry terms are pulled from the job description and reflected in your summary and bullet points.',
  },
  {
    icon: LuPalette,
    title: 'Professional presentation',
    description:
      'Choose a visual theme that suits the industry, from clean and classic to modern and creative, ready to download.',
  },
];

export function Purpose() {
  return (
    <Box as="section" id="purpose" py={{ base: '16', md: '24' }} borderTopWidth="1px" scrollMarginTop="14">
      <Container maxW="5xl">
        <SectionHeading
          eyebrow="Purpose"
          title="Stop sending the same resume to every job"
          description="Generic resumes get overlooked. The Resume Customization Engine produces a targeted, professional resume for each application, built from one complete record of your background."
        />

        <SimpleGrid columns={{ base: 1, md: 3 }} gap={{ base: '10', md: '12' }} mt="14">
          {pillars.map((p) => (
            <Stack key={p.title} gap="3">
              <Icon boxSize="5" color="fg.muted">
                <p.icon />
              </Icon>
              <Text fontWeight="medium">{p.title}</Text>
              <Text color="fg.muted" fontSize="sm" lineHeight="tall">
                {p.description}
              </Text>
            </Stack>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}
