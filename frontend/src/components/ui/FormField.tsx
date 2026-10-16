import type { ComponentProps, ReactNode } from 'react';
import { Field, Input } from '@chakra-ui/react';

type InputProps = Omit<ComponentProps<typeof Input>, 'value' | 'onChange'>;

interface FormFieldProps extends InputProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  error?: string;
  helperText?: ReactNode;
  required?: boolean;
}

/** Labelled text input with helper and error text. */
export function FormField({
  label,
  value,
  onValueChange,
  error,
  helperText,
  required,
  ...inputProps
}: FormFieldProps) {
  return (
    <Field.Root invalid={!!error} required={required}>
      <Field.Label>
        {label}
        <Field.RequiredIndicator />
      </Field.Label>
      <Input value={value} onChange={(e) => onValueChange(e.target.value)} {...inputProps} />
      {error ? (
        <Field.ErrorText>{error}</Field.ErrorText>
      ) : (
        helperText && <Field.HelperText>{helperText}</Field.HelperText>
      )}
    </Field.Root>
  );
}
