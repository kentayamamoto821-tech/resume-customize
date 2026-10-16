import { useState } from 'react';
import { Button, Container, Stack } from '@chakra-ui/react';
import { useNavigate } from 'react-router';
import { LuFileUp, LuFiles, LuTriangleAlert } from 'react-icons/lu';
import { MAX_DOCUMENT_SIZE_BYTES, type DocumentFile } from '@resume/shared';
import { useDeleteDocument, useDocuments, useImportPdf } from '../apis/documents';
import { DocumentTable } from '../components/documents/DocumentTable';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { FileImportButton } from '../components/ui/FileImportButton';
import { PageHeader } from '../components/ui/PageHeader';
import { StateMessage } from '../components/ui/StateMessage';
import { toaster } from '../components/ui/toaster';
import { paths } from '../routes/paths';
import { getErrorMessage } from '../utils/errors';
import { formatBytes } from '../utils/format';

const PDF_ACCEPT = '.pdf,application/pdf';

/** Quick checks before uploading; the server validates again. */
function validatePdf(file: File): string | null {
  const looksLikePdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  if (!looksLikePdf) return 'Only PDF files can be imported.';
  if (file.size === 0) return 'The file is empty.';
  if (file.size > MAX_DOCUMENT_SIZE_BYTES) {
    return `The file is ${formatBytes(file.size)}; the limit is ${formatBytes(MAX_DOCUMENT_SIZE_BYTES)}.`;
  }
  return null;
}

export function DocumentsPage() {
  const { data, isPending, isError, error, refetch } = useDocuments();
  const importPdf = useImportPdf();
  const navigate = useNavigate();
  const deleteDocument = useDeleteDocument();
  const [pendingDelete, setPendingDelete] = useState<DocumentFile | null>(null);

  const handleFileSelected = async (file: File) => {
    const problem = validatePdf(file);
    if (problem) {
      toaster.error({ title: 'Can’t import this file', description: problem });
      return;
    }
    try {
      const imported = await importPdf.mutateAsync(file);
      toaster.success({ title: 'PDF imported', description: file.name });
      navigate(paths.document(imported.id));
    } catch (err) {
      toaster.error({ title: 'Import failed', description: getErrorMessage(err) });
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteDocument.mutateAsync(pendingDelete.id);
      toaster.success({ title: 'Document deleted', description: pendingDelete.fileName });
      setPendingDelete(null);
    } catch (err) {
      toaster.error({ title: 'Could not delete document', description: getErrorMessage(err) });
    }
  };

  const importButton = (
    <FileImportButton
      accept={PDF_ACCEPT}
      onFileSelected={handleFileSelected}
      loading={importPdf.isPending}
      loadingText="Importing…"
      size="sm"
    >
      <LuFileUp />
      Import PDF
    </FileImportButton>
  );

  const renderContent = () => {
    if (isError) {
      return (
        <StateMessage
          icon={<LuTriangleAlert />}
          title="Couldn’t load documents"
          description={getErrorMessage(error)}
          action={
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      );
    }
    if (!isPending && data.length === 0) {
      return (
        <StateMessage
          icon={<LuFiles />}
          title="No documents yet"
          description={`Import a PDF, such as an existing resume or a job description. Max ${formatBytes(MAX_DOCUMENT_SIZE_BYTES)}.`}
          action={importButton}
        />
      );
    }
    return <DocumentTable documents={data ?? []} loading={isPending} onDelete={setPendingDelete} />;
  };

  return (
    <Container maxW="5xl" py={{ base: '10', md: '14' }}>
      <Stack gap="8">
        <PageHeader
          title="Documents"
          description="PDFs you’ve imported, such as existing resumes and job descriptions."
          actions={data && data.length > 0 ? importButton : undefined}
        />
        {renderContent()}
      </Stack>

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && !deleteDocument.isPending && setPendingDelete(null)}
        title="Delete document?"
        description={
          <>
            <strong>{pendingDelete?.fileName}</strong> will be permanently deleted.
          </>
        }
        confirmLabel="Delete"
        destructive
        loading={deleteDocument.isPending}
        onConfirm={confirmDelete}
      />
    </Container>
  );
}
