import { useEffect, useRef, useState } from 'react';
import { Box, Button, Flex, HStack, IconButton, Spinner, Stack, Text } from '@chakra-ui/react';
import { LuMoveHorizontal, LuTriangleAlert, LuZoomIn, LuZoomOut } from 'react-icons/lu';
import { PdfPage } from './PdfPage';
import { describePdfError, getDocument, type PDFDocumentProxy } from './pdfjs';
import { StateMessage } from '../ui/StateMessage';
import { useElementWidth } from '../../utils/useElementWidth';

interface PdfViewerProps {
  /** URL of the PDF file (same origin). */
  url: string;
}

const ZOOM_STEPS = [0.5, 0.75, 1, 1.25, 1.5, 2, 3];
const MAX_FIT_SCALE = 2;

type Zoom = 'fit' | number;

/** Renders a PDF inside the page: toolbar with zoom, then every page stacked vertically. */
export function PdfViewer({ url }: PdfViewerProps) {
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [firstPageSize, setFirstPageSize] = useState({ width: 612, height: 792 });
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState<Zoom>('fit');
  const pagesRef = useRef<HTMLDivElement>(null);
  const availableWidth = useElementWidth(pagesRef);

  useEffect(() => {
    setPdf(null);
    setError(null);
    let cancelled = false;
    const loadingTask = getDocument({ url });

    loadingTask.promise
      .then(async (doc) => {
        const { width, height } = (await doc.getPage(1)).getViewport({ scale: 1 });
        if (cancelled) return;
        setFirstPageSize({ width, height });
        setPdf(doc);
      })
      .catch((err) => {
        if (!cancelled) setError(describePdfError(err));
      });

    return () => {
      cancelled = true;
      void loadingTask.destroy();
    };
  }, [url]);

  const fitScale =
    availableWidth > 0 ? Math.min(availableWidth / firstPageSize.width, MAX_FIT_SCALE) : 1;
  const scale = zoom === 'fit' ? fitScale : zoom;

  // Skip steps within 10% of the current scale (e.g. fit-width at 149% -> 200%, not 150%),
  // so every click makes a visible difference.
  const zoomIn = () =>
    setZoom(ZOOM_STEPS.find((s) => s > scale * 1.1) ?? ZOOM_STEPS.at(-1)!);
  const zoomOut = () =>
    setZoom([...ZOOM_STEPS].reverse().find((s) => s < scale / 1.1) ?? ZOOM_STEPS[0]);

  if (error) {
    return (
      <Box borderWidth="1px" rounded="lg" py="12">
        <StateMessage icon={<LuTriangleAlert />} title="Can’t show this PDF" description={error} />
      </Box>
    );
  }

  return (
    // overflow "clip" (not "hidden") keeps the rounded corners without breaking the sticky toolbar.
    <Stack gap="0" borderWidth="1px" rounded="lg" overflow="clip">
      <Flex
        align="center"
        justify="space-between"
        gap="3"
        px="3"
        py="2"
        borderBottomWidth="1px"
        bg="bg"
        position="sticky"
        top="14"
        zIndex="1"
      >
        <Text fontSize="sm" color="fg.muted">
          {pdf ? `${pdf.numPages} ${pdf.numPages === 1 ? 'page' : 'pages'}` : 'Loading…'}
        </Text>
        <HStack gap="1">
          <IconButton
            aria-label="Zoom out"
            variant="ghost"
            size="sm"
            onClick={zoomOut}
            disabled={!pdf || scale <= ZOOM_STEPS[0]}
          >
            <LuZoomOut />
          </IconButton>
          <Text
            fontSize="sm"
            w="12"
            textAlign="center"
            fontVariantNumeric="tabular-nums"
            aria-live="polite"
          >
            {Math.round(scale * 100)}%
          </Text>
          <IconButton
            aria-label="Zoom in"
            variant="ghost"
            size="sm"
            onClick={zoomIn}
            disabled={!pdf || scale >= ZOOM_STEPS.at(-1)!}
          >
            <LuZoomIn />
          </IconButton>
          <Button
            variant={zoom === 'fit' ? 'subtle' : 'ghost'}
            size="sm"
            onClick={() => setZoom('fit')}
            disabled={!pdf}
            aria-pressed={zoom === 'fit'}
          >
            <LuMoveHorizontal />
            Fit width
          </Button>
        </HStack>
      </Flex>

      <Box bg="bg.muted" p={{ base: '3', md: '6' }} overflowX="auto">
        <Stack ref={pagesRef} gap={{ base: '3', md: '5' }} align="center" minW="0">
          {pdf ? (
            Array.from({ length: pdf.numPages }, (_, i) => (
              <PdfPage
                key={i}
                pdf={pdf}
                pageNumber={i + 1}
                scale={scale}
                placeholderSize={firstPageSize}
              />
            ))
          ) : (
            <Flex h="60vh" align="center" justify="center">
              <Spinner color="fg.muted" />
            </Flex>
          )}
        </Stack>
      </Box>
    </Stack>
  );
}
