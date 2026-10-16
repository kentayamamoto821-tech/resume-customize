import type { ReactNode } from 'react';
import { Flex, Heading, HStack, Stack, Text } from '@chakra-ui/react';

interface PageHeaderProps {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <Flex
      direction={{ base: 'column', sm: 'row' }}
      align={{ base: 'flex-start', sm: 'flex-end' }}
      justify="space-between"
      gap="4"
    >
      <Stack gap="1">
        <Heading as="h1" fontSize="2xl" fontWeight="semibold" letterSpacing="tight">
          {title}
        </Heading>
        {description && <Text color="fg.muted">{description}</Text>}
      </Stack>
      {actions && <HStack gap="2">{actions}</HStack>}
    </Flex>
  );
}
