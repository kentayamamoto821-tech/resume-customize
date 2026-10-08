import { Heading, Stack, Text } from '@chakra-ui/react';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <Stack gap="3" maxW="2xl">
      <Text fontSize="sm" color="fg.muted">
        {eyebrow}
      </Text>
      <Heading
        as="h2"
        fontSize={{ base: '2xl', md: '3xl' }}
        fontWeight="semibold"
        letterSpacing="tight"
        css={{ textWrap: 'balance' }}
      >
        {title}
      </Heading>
      <Text color="fg.muted">{description}</Text>
    </Stack>
  );
}
