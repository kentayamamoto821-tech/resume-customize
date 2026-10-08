import {
  Badge,
  Box,
  Button,
  Container,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  Text,
  Wrap,
} from '@chakra-ui/react';
import { LuArrowRight } from 'react-icons/lu';

export function Hero() {
  return (
    <Box as="section" py={{ base: '16', md: '28' }}>
      <Container maxW="5xl">
        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={{ base: '12', lg: '16' }} alignItems="center">
          <Stack gap="6">
            <Text fontSize="sm" color="fg.muted">
              Resume Customization Engine
            </Text>

            <Heading
              as="h1"
              fontSize={{ base: '4xl', md: '5xl' }}
              lineHeight="1.1"
              letterSpacing="tight"
              fontWeight="semibold"
              css={{ textWrap: 'balance' }}
            >
              One profile. A tailored resume for every role.
            </Heading>

            <Text fontSize={{ base: 'md', md: 'lg' }} color="fg.muted" maxW="lg">
              Combine your professional background with a target job description. The engine
              tailors your content, keywords and structure to the role, then renders it in the
              professional theme you choose.
            </Text>

            <HStack gap="3" flexWrap="wrap" pt="2">
              <Button asChild colorPalette="gray">
                <a href="#get-started">
                  Build my resume
                  <LuArrowRight />
                </a>
              </Button>
              <Button asChild variant="ghost" colorPalette="gray">
                <a href="#workflow">See how it works</a>
              </Button>
            </HStack>
          </Stack>

          <ResumePreview />
        </SimpleGrid>
      </Container>
    </Box>
  );
}

const matchedKeywords = ['TypeScript', 'React', 'REST APIs', 'PostgreSQL', 'CI/CD'];

function ResumePreview() {
  return (
    <Box
      w="full"
      maxW="md"
      mx={{ base: 'auto', lg: '0' }}
      justifySelf="end"
      borderWidth="1px"
      rounded="lg"
      bg="bg"
      p="7"
    >
      <Stack gap="6">
        <Stack gap="1.5">
          <Box h="3" w="40%" bg="fg" opacity="0.8" rounded="full" />
          <Box h="2" w="60%" bg="bg.emphasized" rounded="full" />
        </Stack>

        <PreviewBlock label="Summary" lines={['95%', '88%', '70%']} />
        <PreviewBlock label="Experience" lines={['92%', '84%', '90%', '60%']} />

        <Stack gap="2">
          <Text fontSize="xs" color="fg.subtle">
            Matched keywords
          </Text>
          <Wrap gap="1.5">
            {matchedKeywords.map((k) => (
              <Badge key={k} variant="subtle" colorPalette="gray">
                {k}
              </Badge>
            ))}
          </Wrap>
        </Stack>
      </Stack>
    </Box>
  );
}

function PreviewBlock({ label, lines }: { label: string; lines: string[] }) {
  return (
    <Stack gap="2">
      <Text fontSize="xs" color="fg.subtle">
        {label}
      </Text>
      {lines.map((w, i) => (
        <Box key={i} h="1.5" w={w} bg="bg.muted" rounded="full" />
      ))}
    </Stack>
  );
}
