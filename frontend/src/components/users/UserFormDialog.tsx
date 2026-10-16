import { useEffect, useState } from 'react';
import { Stack } from '@chakra-ui/react';
import { userCreateSchema, type User } from '@resume/shared';
import { useCreateUser, useUpdateUser } from '../../apis/users';
import {
  getApiFieldErrors,
  getErrorMessage,
  issuesToFieldErrors,
  type FieldErrors,
} from '../../utils/errors';
import { FormDialog } from '../ui/FormDialog';
import { FormField } from '../ui/FormField';
import { toaster } from '../ui/toaster';

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The user to edit, or null to create a new one. */
  user: User | null;
}

type FormValues = {
  fullName: string;
  email: string;
  phone: string;
  linkedinUrl: string;
};

const FIELDS: {
  name: keyof FormValues;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
  helperText?: string;
}[] = [
  { name: 'fullName', label: 'Full name', required: true, autoComplete: 'name', placeholder: 'Ada Lovelace' },
  { name: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'email', placeholder: 'ada@example.com' },
  { name: 'phone', label: 'Phone', type: 'tel', required: true, autoComplete: 'tel', placeholder: '+44 20 7946 0000' },
  {
    name: 'linkedinUrl',
    label: 'LinkedIn URL',
    type: 'url',
    autoComplete: 'url',
    placeholder: 'https://www.linkedin.com/in/…',
    helperText: 'Optional',
  },
];

function toFormValues(user: User | null): FormValues {
  return {
    fullName: user?.fullName ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    linkedinUrl: user?.linkedinUrl ?? '',
  };
}

export function UserFormDialog({ open, onOpenChange, user }: UserFormDialogProps) {
  const isEdit = user !== null;
  const [values, setValues] = useState<FormValues>(() => toFormValues(user));
  const [errors, setErrors] = useState<FieldErrors>({});

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const submitting = createUser.isPending || updateUser.isPending;

  // Start from a clean form each time the dialog opens.
  useEffect(() => {
    if (open) {
      setValues(toFormValues(user));
      setErrors({});
    }
  }, [open, user]);

  const setField = (name: keyof FormValues, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors(({ [name]: _cleared, ...rest }) => rest);
  };

  const handleSubmit = async () => {
    const parsed = userCreateSchema.safeParse({
      ...values,
      linkedinUrl: values.linkedinUrl.trim() || null,
    });
    if (!parsed.success) {
      setErrors(issuesToFieldErrors(parsed.error.issues));
      return;
    }

    try {
      if (isEdit) {
        await updateUser.mutateAsync({ id: user.id, input: parsed.data });
        toaster.success({ title: 'User updated' });
      } else {
        await createUser.mutateAsync(parsed.data);
        toaster.success({ title: 'User created' });
      }
      onOpenChange(false);
    } catch (err) {
      const fieldErrors = getApiFieldErrors(err);
      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
      } else {
        toaster.error({ title: 'Could not save user', description: getErrorMessage(err) });
      }
    }
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? 'Edit user' : 'Add user'}
      description={
        isEdit ? 'Update this person’s contact details.' : 'Add a person and their contact details.'
      }
      submitLabel={isEdit ? 'Save changes' : 'Add user'}
      submitting={submitting}
      onSubmit={handleSubmit}
    >
      <Stack gap="4">
        {FIELDS.map(({ name, ...field }) => (
          <FormField
            key={name}
            {...field}
            value={values[name]}
            onValueChange={(v) => setField(name, v)}
            error={errors[name]}
            disabled={submitting}
          />
        ))}
      </Stack>
    </FormDialog>
  );
}
