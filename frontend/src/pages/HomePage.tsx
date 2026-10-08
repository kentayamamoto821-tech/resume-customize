import { Box } from '@chakra-ui/react';
import { Header } from '../components/home/Header';
import { Hero } from '../components/home/Hero';
import { Purpose } from '../components/home/Purpose';
import { Workflow } from '../components/home/Workflow';
import { CallToAction } from '../components/home/CallToAction';
import { Footer } from '../components/home/Footer';

export function HomePage() {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />
      <Box as="main" flex="1">
        <Hero />
        <Purpose />
        <Workflow />
        <CallToAction />
      </Box>
      <Footer />
    </Box>
  );
}
