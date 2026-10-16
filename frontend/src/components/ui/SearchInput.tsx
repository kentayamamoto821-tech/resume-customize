import { CloseButton, Input, InputGroup } from '@chakra-ui/react';
import { LuSearch } from 'react-icons/lu';

interface SearchInputProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export function SearchInput({
  value,
  onValueChange,
  placeholder = 'Search…',
  label = 'Search',
}: SearchInputProps) {
  return (
    <InputGroup
      maxW={{ base: 'full', sm: 'xs' }}
      startElement={<LuSearch />}
      endElement={
        value ? (
          <CloseButton size="xs" me="-2" aria-label="Clear search" onClick={() => onValueChange('')} />
        ) : undefined
      }
    >
      <Input
        type="search"
        aria-label={label}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
      />
    </InputGroup>
  );
}
