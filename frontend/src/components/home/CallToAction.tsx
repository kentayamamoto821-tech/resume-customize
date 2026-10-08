import { Box, Button, Container, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { LuArrowRight } from 'react-icons/lu';

export function CallToAction() {
  return (
    <Box as="section" id="get-started" py={{ base: '16', md: '24' }} scrollMarginTop="14">
      <Container maxW="5xl">
        <Flex
          direction={{ base: 'column', md: 'row' }}
          align={{ base: 'flex-start', md: 'center' }}
          justify="space-between"
          gap="6"
          bg="bg.subtle"
          rounded="lg"
          p={{ base: '8', md: '10' }}
        >
          <Stack gap="2" maxW="lg">
            <Heading as="h2" fontSize={{ base: 'xl', md: '2xl' }} fontWeight="semibold" letterSpacing="tight">
              Ready to tailor your next application?
            </Heading>
            <Text color="fg.muted">
              Start with your profile. It takes a few minutes, and you can reuse it for every job
              you apply to.
            </Text>
          </Stack>
          <Button colorPalette="gray" flexShrink="0">
            Create my profile
            <LuArrowRight />
          </Button>
        </Flex>
      </Container>
    </Box>
  );
}
