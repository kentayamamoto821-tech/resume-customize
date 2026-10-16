import { useRef, type ComponentProps, type ReactNode } from 'react';
import { Button, VisuallyHidden } from '@chakra-ui/react';

type ButtonProps = Omit<ComponentProps<typeof Button>, 'onClick' | 'children'>;

interface FileImportButtonProps extends ButtonProps {
  /** File types the picker shows, e.g. ".pdf,application/pdf". */
  accept: string;
  onFileSelected: (file: File) => void;
  children: ReactNode;
}

/** A button that opens the system file picker and reports the chosen file. */
export function FileImportButton({
  accept,
  onFileSelected,
  children,
  disabled,
  loading,
  ...buttonProps
}: FileImportButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Button
        {...buttonProps}
        disabled={disabled}
        loading={loading}
        onClick={() => inputRef.current?.click()}
      >
        {children}
      </Button>
      <VisuallyHidden asChild>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          tabIndex={-1}
          aria-hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            // Reset so choosing the same file again still fires onChange.
            e.target.value = '';
            if (file) onFileSelected(file);
          }}
        />
      </VisuallyHidden>
    </>
  );
}
