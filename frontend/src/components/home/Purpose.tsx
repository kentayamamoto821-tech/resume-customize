import { Box, Card, Container, Flex, Icon, SimpleGrid, Text } from '@chakra-ui/react';
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
    <Box as="section" id="purpose" py={{ base: '20', md: '28' }} scrollMarginTop="16">
      <Container maxW="6xl">
        <SectionHeading
          eyebrow="Project purpose"
          title="Stop sending the same resume to every job"
          description="Generic resumes get overlooked. The Resume Customization Engine produces a targeted, professional resume for each application, built from one complete record of your background."
        />

        <SimpleGrid columns={{ base: 1, md: 3 }} gap="6" mt="14">
          {pillars.map((p) => (
            <Card.Root key={p.title} variant="outline" rounded="xl">
              <Card.Body gap="4" p="7">
                <Flex boxSize="11" align="center" justify="center" rounded="lg" bg="teal.subtle">
                  <Icon color="teal.fg" boxSize="5">
                    <p.icon />
                  </Icon>
                </Flex>
                <Card.Title fontSize="lg">{p.title}</Card.Title>
                <Text color="fg.muted">{p.description}</Text>
              </Card.Body>
            </Card.Root>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}
