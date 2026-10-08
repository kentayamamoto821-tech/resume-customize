import { Box, Button, Container, Flex, HStack, Icon, Link, Text } from '@chakra-ui/react';
import { LuFileText } from 'react-icons/lu';

const navItems = [
  { label: 'Purpose', href: '#purpose' },
  { label: 'Workflow', href: '#workflow' },
];

export function Header() {
  return (
    <Box as="header" position="sticky" top="0" zIndex="sticky" bg="bg" borderBottomWidth="1px">
      <Container maxW="5xl">
        <Flex h="14" align="center" justify="space-between">
          <HStack gap="2">
            <Icon boxSize="4.5">
              <LuFileText />
            </Icon>
            <Text fontWeight="semibold" fontSize="sm">
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
                  _hover={{ color: 'fg', textDecoration: 'none' }}
                >
                  {item.label}
                </Link>
              ))}
            </HStack>
            <Button asChild size="sm" variant="solid" colorPalette="gray">
              <a href="#get-started">Get started</a>
            </Button>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}
