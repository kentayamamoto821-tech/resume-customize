import { Button, Container } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router';
import { LuFileQuestion } from 'react-icons/lu';
import { StateMessage } from '../components/ui/StateMessage';
import { paths } from '../routes/paths';

export function NotFoundPage() {
  return (
    <Container maxW="5xl" py="24">
      <StateMessage
        icon={<LuFileQuestion />}
        title="Page not found"
        description="The page you’re looking for doesn’t exist or has moved."
        action={
          <Button asChild variant="outline" size="sm">
            <RouterLink to={paths.home}>Back to home</RouterLink>
          </Button>
        }
      />
    </Container>
  );
}
