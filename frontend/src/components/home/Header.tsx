import { Box, Button, Container, Flex, HStack, Icon, Link, Text } from '@chakra-ui/react';
import { LuFileText } from 'react-icons/lu';

const navItems = [
  { label: 'Purpose', href: '#purpose' },
  { label: 'Workflow', href: '#workflow' },
];

export function Header() {
  return (
    <Box
      as="header"
      position="sticky"
      top="0"
      zIndex="sticky"
      bg="bg/80"
      backdropFilter="blur(8px)"
      borderBottomWidth="1px"
    >
      <Container maxW="6xl">
        <Flex h="16" align="center" justify="space-between">
          <HStack gap="2">
            <Flex boxSize="8" align="center" justify="center" rounded="md" bg="teal.solid">
              <Icon color="teal.contrast" boxSize="4">
                <LuFileText />
              </Icon>
            </Flex>
            <Text fontWeight="semibold" letterSpacing="tight">
              Resume Customizer
            </Text>
          </HStack>

          <HStack gap="6">
            <HStack gap="6" display={{ base: 'none', md: 'flex' }}>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  color="fg.muted"
                  fontSize="sm"
                  fontWeight="medium"
                  _hover={{ color: 'fg', textDecoration: 'none' }}
                >
                  {item.label}
                </Link>
              ))}
            </HStack>
            <Button asChild size="sm" colorPalette="teal">
              <a href="#get-started">Get started</a>
            </Button>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}
