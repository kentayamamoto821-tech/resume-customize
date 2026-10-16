import { Button, Container, Flex, Heading, Link, Stack, Text } from '@chakra-ui/react';
import { Link as RouterLink, useParams } from 'react-router';
import { LuArrowLeft, LuDownload, LuFileQuestion, LuTriangleAlert } from 'react-icons/lu';
import { documentsApi, useDocument } from '../apis/documents';
import { ApiRequestError } from '../apis/client';
import { PdfViewer } from '../components/pdf/PdfViewer';
import { StateMessage } from '../components/ui/StateMessage';
import { paths } from '../routes/paths';
import { getErrorMessage } from '../utils/errors';
import { formatBytes, formatDate } from '../utils/format';

export function DocumentViewerPage() {
  const id = Number(useParams().id);
  const { data: document, isPending, isError, error } = useDocument(id);
  const notFound =
    !Number.isInteger(id) || id <= 0 || (error instanceof ApiRequestError && error.status === 404);

  const backLink = (
    <Link asChild fontSize="sm" color="fg.muted" _hover={{ color: 'fg', textDecoration: 'none' }}>
      <RouterLink to={paths.documents}>
        <LuArrowLeft />
        Documents
      </RouterLink>
    </Link>
  );

  if (notFound || isError) {
    return (
      <Container maxW="5xl" py={{ base: '10', md: '14' }}>
        <Stack gap="8">
          {backLink}
          <StateMessage
            icon={notFound ? <LuFileQuestion /> : <LuTriangleAlert />}
            title={notFound ? 'Document not found' : 'Couldn’t load this document'}
            description={
              notFound ? 'It may have been deleted.' : getErrorMessage(error)
            }
          />
        </Stack>
      </Container>
    );
  }

  return (
    <Container maxW="5xl" py={{ base: '8', md: '10' }}>
      <Stack gap="6">
        {backLink}

        <Flex
          direction={{ base: 'column', sm: 'row' }}
          align={{ base: 'flex-start', sm: 'flex-end' }}
          justify="space-between"
          gap="4"
        >
          <Stack gap="1" minW="0">
            <Heading
              as="h1"
              fontSize="2xl"
              fontWeight="semibold"
              letterSpacing="tight"
              wordBreak="break-word"
            >
              {isPending ? 'Loading…' : document.fileName}
            </Heading>
            {document && (
              <Text color="fg.muted" fontSize="sm">
                {formatBytes(document.sizeBytes)} · Imported {formatDate(document.createdAt)}
              </Text>
            )}
          </Stack>
          <Button asChild variant="outline" size="sm" flexShrink="0">
            <a href={documentsApi.fileUrl(id, { download: true })}>
              <LuDownload />
              Download
            </a>
          </Button>
        </Flex>

        <PdfViewer url={documentsApi.fileUrl(id)} />
      </Stack>
    </Container>
  );
}
