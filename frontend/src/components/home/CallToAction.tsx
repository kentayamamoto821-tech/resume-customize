import { Box, Button, Container, Heading, Stack, Text } from '@chakra-ui/react';
import { LuArrowRight } from 'react-icons/lu';

export function CallToAction() {
  return (
    <Box as="section" id="get-started" py={{ base: '20', md: '24' }} scrollMarginTop="16">
      <Container maxW="4xl">
        <Stack
          gap="6"
          align="center"
          textAlign="center"
          bg="teal.solid"
          color="teal.contrast"
          rounded="2xl"
          px={{ base: '6', md: '12' }}
          py={{ base: '12', md: '16' }}
        >
          <Heading as="h2" fontSize={{ base: '2xl', md: '3xl' }} letterSpacing="tight">
            Ready to tailor your next application?
          </Heading>
          <Text opacity="0.9" maxW="xl">
            Start with your profile. It takes a few minutes, and you can reuse it for every
            job you apply to.
          </Text>
          <Button size="lg" bg="white" color="teal.700" _hover={{ bg: 'whiteAlpha.900' }}>
            Create my profile
            <LuArrowRight />
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
