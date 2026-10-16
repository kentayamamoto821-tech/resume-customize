import type { ReactNode } from 'react';
import { EmptyState, VStack } from '@chakra-ui/react';

interface StateMessageProps {
  icon: ReactNode;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
}

/** Centered message for empty, error and "not found" states. */
export function StateMessage({ icon, title, description, action }: StateMessageProps) {
  return (
    <EmptyState.Root size="md">
      <EmptyState.Content>
        <EmptyState.Indicator>{icon}</EmptyState.Indicator>
        <VStack textAlign="center" gap="1">
          <EmptyState.Title>{title}</EmptyState.Title>
          {description && <EmptyState.Description>{description}</EmptyState.Description>}
        </VStack>
        {action}
      </EmptyState.Content>
    </EmptyState.Root>
  );
}
