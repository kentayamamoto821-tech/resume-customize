import { Box, Container, Flex, Text } from '@chakra-ui/react';

export function Footer() {
  return (
    <Box as="footer" borderTopWidth="1px" py="6">
      <Container maxW="5xl">
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align={{ base: 'flex-start', md: 'center' }}
          gap="1"
        >
          <Text fontSize="sm">Resume Customizer</Text>
          <Text fontSize="sm" color="fg.subtle">
            © {new Date().getFullYear()} Resume Customization Engine
          </Text>
        </Flex>
      </Container>
    </Box>
  );
}
