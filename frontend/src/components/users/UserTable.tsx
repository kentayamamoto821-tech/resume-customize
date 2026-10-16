import { HStack, IconButton, Link, Skeleton, Table, Text } from '@chakra-ui/react';
import { LuExternalLink, LuPencil, LuTrash2 } from 'react-icons/lu';
import type { User } from '@resume/shared';
import { displayUrl, formatDate, isSafeHttpUrl } from '../../utils/format';

interface UserTableProps {
  users: User[];
  loading?: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const COLUMNS = ['Name', 'Email', 'Phone', 'LinkedIn', 'Updated'];
const SKELETON_ROWS = 5;

export function UserTable({ users, loading = false, onEdit, onDelete }: UserTableProps) {
  return (
    <Table.ScrollArea borderWidth="1px" rounded="lg">
      <Table.Root size="sm" variant="line" interactive={!loading}>
        <Table.Header>
          <Table.Row bg="bg.subtle">
            {COLUMNS.map((col) => (
              <Table.ColumnHeader key={col} color="fg.muted" fontWeight="medium" py="3">
                {col}
              </Table.ColumnHeader>
            ))}
            <Table.ColumnHeader w="1">
              <Text srOnly>Actions</Text>
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {loading
            ? Array.from({ length: SKELETON_ROWS }, (_, i) => <SkeletonRow key={i} />)
            : users.map((user) => (
                <UserRow key={user.id} user={user} onEdit={onEdit} onDelete={onDelete} />
              ))}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  );
}

interface UserRowProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

function UserRow({ user, onEdit, onDelete }: UserRowProps) {
  return (
    <Table.Row>
      <Table.Cell fontWeight="medium" whiteSpace="nowrap" py="3">
        {user.fullName}
      </Table.Cell>
      <Table.Cell color="fg.muted">{user.email}</Table.Cell>
      <Table.Cell color="fg.muted" whiteSpace="nowrap">
        {user.phone}
      </Table.Cell>
      <Table.Cell>
        {isSafeHttpUrl(user.linkedinUrl) ? (
          <Link
            href={user.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            color="fg.muted"
            fontSize="sm"
            maxW="48"
            truncate
          >
            {displayUrl(user.linkedinUrl)}
            <LuExternalLink />
          </Link>
        ) : (
          <Text color="fg.subtle">—</Text>
        )}
      </Table.Cell>
      <Table.Cell color="fg.muted" whiteSpace="nowrap">
        {formatDate(user.updatedAt)}
      </Table.Cell>
      <Table.Cell>
        <HStack gap="0" justify="flex-end">
          <IconButton
            aria-label={`Edit ${user.fullName}`}
            variant="ghost"
            size="sm"
            onClick={() => onEdit(user)}
          >
            <LuPencil />
          </IconButton>
          <IconButton
            aria-label={`Delete ${user.fullName}`}
            variant="ghost"
            size="sm"
            colorPalette="red"
            onClick={() => onDelete(user)}
          >
            <LuTrash2 />
          </IconButton>
        </HStack>
      </Table.Cell>
    </Table.Row>
  );
}

function SkeletonRow() {
  return (
    <Table.Row>
      {COLUMNS.map((col) => (
        <Table.Cell key={col} py="3.5">
          <Skeleton h="3.5" w="24" />
        </Table.Cell>
      ))}
      <Table.Cell />
    </Table.Row>
  );
}
