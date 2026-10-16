import { useId, type FormEvent, type ReactNode } from 'react';
import { Button, CloseButton, Dialog, Portal } from '@chakra-ui/react';

interface FormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: ReactNode;
  submitLabel: string;
  submitting?: boolean;
  onSubmit: () => void;
  children: ReactNode;
}

/** Modal dialog wrapping a form, with Cancel / Submit actions in the footer. */
export function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  submitLabel,
  submitting = false,
  onSubmit,
  children,
}: FormDialogProps) {
  const formId = useId();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(e) => onOpenChange(e.open)}
      placement="center"
      closeOnInteractOutside={!submitting}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content mx="4">
            <Dialog.Header flexDirection="column" alignItems="flex-start" gap="1">
              <Dialog.Title>{title}</Dialog.Title>
              {description && (
                <Dialog.Description color="fg.muted" fontSize="sm">
                  {description}
                </Dialog.Description>
              )}
            </Dialog.Header>
            <Dialog.Body>
              <form id={formId} onSubmit={handleSubmit} noValidate>
                {children}
              </form>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline" disabled={submitting}>
                  Cancel
                </Button>
              </Dialog.ActionTrigger>
              <Button type="submit" form={formId} loading={submitting}>
                {submitLabel}
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild disabled={submitting}>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
