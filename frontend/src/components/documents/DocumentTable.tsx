import { HStack, Icon, IconButton, Link, Skeleton, Table, Text } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router';
import { LuDownload, LuFileText, LuTrash2 } from 'react-icons/lu';
import type { DocumentFile } from '@resume/shared';
import { documentsApi } from '../../apis/documents';
import { paths } from '../../routes/paths';
import { formatBytes, formatDate } from '../../utils/format';

interface DocumentTableProps {
  documents: DocumentFile[];
  loading?: boolean;
  onDelete: (document: DocumentFile) => void;
}

const COLUMNS = [
  { label: 'Name' },
  { label: 'Size', hideBelow: 'md' },
  { label: 'Imported', hideBelow: 'md' },
] as const;
const SKELETON_ROWS = 3;

export function DocumentTable({ documents, loading = false, onDelete }: DocumentTableProps) {
  return (
    <Table.ScrollArea borderWidth="1px" rounded="lg">
      <Table.Root size="sm" variant="line" interactive={!loading}>
        <Table.Header>
          <Table.Row bg="bg.subtle">
            {COLUMNS.map((col) => (
              <Table.ColumnHeader
                key={col.label}
                color="fg.muted"
                fontWeight="medium"
                py="3"
                hideBelow={'hideBelow' in col ? col.hideBelow : undefined}
              >
                {col.label}
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
            : documents.map((doc) => <DocumentRow key={doc.id} document={doc} onDelete={onDelete} />)}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  );
}

function DocumentRow({
  document,
  onDelete,
}: {
  document: DocumentFile;
  onDelete: (document: DocumentFile) => void;
}) {
  return (
    <Table.Row>
      <Table.Cell py="3">
        <HStack gap="2.5" minW="0">
          <Icon color="fg.muted" boxSize="4" flexShrink="0">
            <LuFileText />
          </Icon>
          <Link asChild fontWeight="medium" wordBreak="break-all">
            <RouterLink to={paths.document(document.id)}>{document.fileName}</RouterLink>
          </Link>
        </HStack>
        <Text color="fg.muted" fontSize="xs" hideFrom="md" ps="6.5">
          {formatBytes(document.sizeBytes)} · {formatDate(document.createdAt)}
        </Text>
      </Table.Cell>
      <Table.Cell color="fg.muted" whiteSpace="nowrap" hideBelow="md">
        {formatBytes(document.sizeBytes)}
      </Table.Cell>
      <Table.Cell color="fg.muted" whiteSpace="nowrap" hideBelow="md">
        {formatDate(document.createdAt)}
      </Table.Cell>
      <Table.Cell>
        <HStack gap="0" justify="flex-end">
          <IconButton asChild aria-label={`Download ${document.fileName}`} variant="ghost" size="sm">
            <a href={documentsApi.fileUrl(document.id, { download: true })}>
              <LuDownload />
            </a>
          </IconButton>
          <IconButton
            aria-label={`Delete ${document.fileName}`}
            variant="ghost"
            size="sm"
            colorPalette="red"
            onClick={() => onDelete(document)}
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
        <Table.Cell
          key={col.label}
          py="3.5"
          hideBelow={'hideBelow' in col ? col.hideBelow : undefined}
        >
          <Skeleton h="3.5" w="24" />
        </Table.Cell>
      ))}
      <Table.Cell />
    </Table.Row>
  );
}
