import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Flex,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Stack,
  Text,
  Wrap,
} from '@chakra-ui/react';
import { LuArrowRight, LuSparkles } from 'react-icons/lu';

export function Hero() {
  return (
    <Box
      as="section"
      bgGradient="to-b"
      gradientFrom="teal.subtle"
      gradientTo="bg"
      py={{ base: '16', md: '24' }}
    >
      <Container maxW="6xl">
        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={{ base: '12', lg: '16' }} alignItems="center">
          <Stack gap="6">
            <Badge
              colorPalette="teal"
              variant="surface"
              size="lg"
              rounded="full"
              px="3"
              alignSelf="flex-start"
            >
              <Icon boxSize="3.5">
                <LuSparkles />
              </Icon>
              Resume Customization Engine
            </Badge>

            <Heading
              as="h1"
              fontSize={{ base: '4xl', md: '5xl' }}
              lineHeight="1.1"
              letterSpacing="tight"
              fontWeight="bold"
              css={{ textWrap: 'balance' }}
            >
              One profile.{' '}
              <Text as="span" color="teal.fg">
                A tailored resume
              </Text>{' '}
              for every role.
            </Heading>

            <Text fontSize={{ base: 'md', md: 'lg' }} color="fg.muted" maxW="xl">
              Combine your professional background with a target job description. The engine
              tailors your content, keywords and structure to the role, then renders it in the
              professional theme you choose.
            </Text>

            <HStack gap="3" flexWrap="wrap">
              <Button asChild size="lg" colorPalette="teal">
                <a href="#get-started">
                  Build my resume
                  <LuArrowRight />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
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
    <Box position="relative" maxW="md" w="full" mx={{ base: 'auto', lg: '0' }} justifySelf="end">
      <Card.Root shadow="xl" rounded="xl" overflow="hidden">
        <Box h="2" bg="teal.solid" />
        <Card.Body gap="5" p="6" pb="14">
          <Stack gap="1">
            <Box h="4" w="40%" bg="fg" opacity="0.85" rounded="sm" />
            <Box h="2.5" w="60%" bg="border.emphasized" rounded="sm" />
          </Stack>

          <PreviewBlock label="Summary" lines={['95%', '88%', '70%']} />
          <PreviewBlock label="Experience" lines={['92%', '84%', '90%', '60%']} />

          <Stack gap="2">
            <Text fontSize="xs" fontWeight="semibold" textTransform="uppercase" color="fg.muted">
              Matched keywords
            </Text>
            <Wrap gap="1.5">
              {matchedKeywords.map((k) => (
                <Badge key={k} colorPalette="teal" variant="subtle">
                  {k}
                </Badge>
              ))}
            </Wrap>
          </Stack>
        </Card.Body>
      </Card.Root>

      <Card.Root
        position="absolute"
        bottom={{ base: '-6', md: '-8' }}
        left={{ base: '4', md: '-10' }}
        shadow="lg"
        rounded="lg"
        size="sm"
      >
        <Card.Body py="3" px="4">
          <Flex align="center" gap="3">
            <Text fontSize="2xl" fontWeight="bold" color="teal.fg">
              92%
            </Text>
            <Text fontSize="xs" color="fg.muted" lineHeight="short">
              Example match
              <br />
              with job description
            </Text>
          </Flex>
        </Card.Body>
      </Card.Root>
    </Box>
  );
}

function PreviewBlock({ label, lines }: { label: string; lines: string[] }) {
  return (
    <Stack gap="2">
      <Text fontSize="xs" fontWeight="semibold" textTransform="uppercase" color="fg.muted">
        {label}
      </Text>
      {lines.map((w, i) => (
        <Box key={i} h="2" w={w} bg="bg.emphasized" rounded="sm" />
      ))}
    </Stack>
  );
}
