import { Heading, Stack, Text } from '@chakra-ui/react';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <Stack gap="3" textAlign="center" maxW="2xl" mx="auto">
      <Text
        fontSize="sm"
        fontWeight="semibold"
        color="teal.fg"
        textTransform="uppercase"
        letterSpacing="wider"
      >
        {eyebrow}
      </Text>
      <Heading
        as="h2"
        fontSize={{ base: '3xl', md: '4xl' }}
        letterSpacing="tight"
        css={{ textWrap: 'balance' }}
      >
        {title}
      </Heading>
      <Text color="fg.muted" fontSize={{ base: 'md', md: 'lg' }}>
        {description}
      </Text>
    </Stack>
  );
}
