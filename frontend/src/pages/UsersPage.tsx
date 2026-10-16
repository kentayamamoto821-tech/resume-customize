import { useEffect, useState } from 'react';
import { Button, Container, Stack } from '@chakra-ui/react';
import { LuPlus, LuTriangleAlert, LuUsers } from 'react-icons/lu';
import type { User } from '@resume/shared';
import { useDeleteUser, useUsers } from '../apis/users';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { PageHeader } from '../components/ui/PageHeader';
import { Pagination } from '../components/ui/Pagination';
import { SearchInput } from '../components/ui/SearchInput';
import { StateMessage } from '../components/ui/StateMessage';
import { toaster } from '../components/ui/toaster';
import { UserFormDialog } from '../components/users/UserFormDialog';
import { UserTable } from '../components/users/UserTable';
import { getErrorMessage } from '../utils/errors';
import { useDebouncedValue } from '../utils/useDebouncedValue';

const PAGE_SIZE = 10;

export function UsersPage() {
  const [search, setSearch] = useState('');
  const [offset, setOffset] = useState(0);
  const q = useDebouncedValue(search.trim(), 300);

  const { data, isPending, isError, error, refetch } = useUsers({ limit: PAGE_SIZE, offset, q });

  const [form, setForm] = useState<{ open: boolean; user: User | null }>({ open: false, user: null });
  const [pendingDelete, setPendingDelete] = useState<User | null>(null);
  const deleteUser = useDeleteUser();

  // Go back a page if the current one became empty (e.g. after deleting its last row).
  useEffect(() => {
    if (data && data.items.length === 0 && offset > 0) {
      setOffset(Math.max(0, offset - PAGE_SIZE));
    }
  }, [data, offset]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setOffset(0);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteUser.mutateAsync(pendingDelete.id);
      toaster.success({ title: 'User deleted', description: pendingDelete.fullName });
      setPendingDelete(null);
    } catch (err) {
      toaster.error({ title: 'Could not delete user', description: getErrorMessage(err) });
    }
  };

  const openCreate = () => setForm({ open: true, user: null });
  const addButton = (
    <Button size="sm" onClick={openCreate}>
      <LuPlus />
      Add user
    </Button>
  );

  const renderContent = () => {
    if (isError) {
      return (
        <StateMessage
          icon={<LuTriangleAlert />}
          title="Couldn’t load users"
          description={getErrorMessage(error)}
          action={
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      );
    }
    if (!isPending && data.total === 0) {
      return q ? (
        <StateMessage
          icon={<LuUsers />}
          title="No matching users"
          description={`Nothing matches “${q}”. Try a different name or email.`}
        />
      ) : (
        <StateMessage
          icon={<LuUsers />}
          title="No users yet"
          description="Add the first person to start building tailored resumes."
          action={addButton}
        />
      );
    }
    return (
      <Stack gap="4">
        <UserTable
          users={data?.items ?? []}
          loading={isPending}
          onEdit={(user) => setForm({ open: true, user })}
          onDelete={setPendingDelete}
        />
        {data && (
          <Pagination
            total={data.total}
            limit={PAGE_SIZE}
            offset={offset}
            onOffsetChange={setOffset}
            itemLabel="users"
          />
        )}
      </Stack>
    );
  };

  return (
    <Container maxW="5xl" py={{ base: '10', md: '14' }}>
      <Stack gap="8">
        <PageHeader
          title="Users"
          description="People whose profiles are used to generate tailored resumes."
          actions={addButton}
        />
        <SearchInput
          value={search}
          onValueChange={handleSearch}
          placeholder="Search by name or email"
          label="Search users"
        />
        {renderContent()}
      </Stack>

      <UserFormDialog
        open={form.open}
        user={form.user}
        onOpenChange={(open) => setForm((prev) => ({ ...prev, open }))}
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && !deleteUser.isPending && setPendingDelete(null)}
        title="Delete user?"
        description={
          <>
            <strong>{pendingDelete?.fullName}</strong> and their experience, education and
            generated resumes will be permanently deleted.
          </>
        }
        confirmLabel="Delete"
        destructive
        loading={deleteUser.isPending}
        onConfirm={confirmDelete}
      />
    </Container>
  );
}
