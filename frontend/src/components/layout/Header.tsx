import { Box, Button, Container, Flex, HStack, Icon, Link, Text } from '@chakra-ui/react';
import { Link as RouterLink, NavLink } from 'react-router';
import { LuFileText } from 'react-icons/lu';
import { paths } from '../../routes/paths';

const navItems = [
  { label: 'Workflow', to: paths.workflow },
  { label: 'Users', to: paths.users },
];

export function Header() {
  return (
    <Box as="header" position="sticky" top="0" zIndex="sticky" bg="bg" borderBottomWidth="1px">
      <Container maxW="5xl">
        <Flex h="14" align="center" justify="space-between">
          <Link asChild _hover={{ textDecoration: 'none' }}>
            <RouterLink to={paths.home}>
              <HStack gap="2">
                <Icon boxSize="4.5">
                  <LuFileText />
                </Icon>
                <Text fontWeight="semibold" fontSize="sm">
                  Resume Customizer
                </Text>
              </HStack>
            </RouterLink>
          </Link>

          <HStack gap="6">
            <HStack as="nav" gap="6" display={{ base: 'none', md: 'flex' }}>
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  asChild
                  fontSize="sm"
                  color="fg.muted"
                  _hover={{ color: 'fg', textDecoration: 'none' }}
                  css={{ '&[aria-current=page]': { color: 'fg', fontWeight: 'medium' } }}
                >
                  {/* In-page anchors use a plain Link so they never render as the active page. */}
                  {item.to.includes('#') ? (
                    <RouterLink to={item.to}>{item.label}</RouterLink>
                  ) : (
                    <NavLink to={item.to} end>
                      {item.label}
                    </NavLink>
                  )}
                </Link>
              ))}
            </HStack>
            <Button asChild size="sm">
              <RouterLink to={paths.users}>Get started</RouterLink>
            </Button>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}
