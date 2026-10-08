import { Box, Container, Flex, Text } from '@chakra-ui/react';

export function Footer() {
  return (
    <Box as="footer" borderTopWidth="1px" py="8">
      <Container maxW="6xl">
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align="center"
          gap="2"
        >
          <Text fontSize="sm" fontWeight="medium">
            Resume Customizer
          </Text>
          <Text fontSize="sm" color="fg.muted">
            © {new Date().getFullYear()} Resume Customization Engine
          </Text>
        </Flex>
      </Container>
    </Box>
  );
}
