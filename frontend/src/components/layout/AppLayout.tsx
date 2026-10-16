import { Box } from '@chakra-ui/react';
import { Outlet } from 'react-router';
import { Footer } from './Footer';
import { Header } from './Header';
import { ScrollToHash } from './ScrollToHash';

export function AppLayout() {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <ScrollToHash />
      <Header />
      <Box as="main" flex="1">
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}
