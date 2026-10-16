import { Flex, HStack, IconButton, Text } from '@chakra-ui/react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

interface PaginationProps {
  total: number;
  limit: number;
  offset: number;
  onOffsetChange: (offset: number) => void;
  /** Plural noun for the summary, e.g. "users". */
  itemLabel?: string;
}

export function Pagination({
  total,
  limit,
  offset,
  onOffsetChange,
  itemLabel = 'items',
}: PaginationProps) {
  const from = total === 0 ? 0 : offset + 1;
  const to = Math.min(offset + limit, total);
  const hasPrev = offset > 0;
  const hasNext = offset + limit < total;

  return (
    <Flex align="center" justify="space-between" gap="4">
      <Text fontSize="sm" color="fg.muted">
        {total === 0 ? `No ${itemLabel}` : `${from}–${to} of ${total} ${itemLabel}`}
      </Text>
      <HStack gap="1">
        <IconButton
          aria-label="Previous page"
          variant="outline"
          size="sm"
          disabled={!hasPrev}
          onClick={() => onOffsetChange(Math.max(0, offset - limit))}
        >
          <LuChevronLeft />
        </IconButton>
        <IconButton
          aria-label="Next page"
          variant="outline"
          size="sm"
          disabled={!hasNext}
          onClick={() => onOffsetChange(offset + limit)}
        >
          <LuChevronRight />
        </IconButton>
      </HStack>
    </Flex>
  );
}
