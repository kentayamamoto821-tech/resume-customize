import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Box, Skeleton } from '@chakra-ui/react';
import { TextLayer, isCancellation, type PDFDocumentProxy, type PDFPageProxy } from './pdfjs';
import { useInView } from '../../utils/useInView';
import './pdf-text-layer.css';

interface PdfPageProps {
  pdf: PDFDocumentProxy;
  pageNumber: number;
  scale: number;
  /** Size to reserve before the page itself has loaded (usually page 1's size). */
  placeholderSize: { width: number; height: number };
}

/** One PDF page: a canvas drawing plus a selectable text layer. Renders once scrolled near. */
export function PdfPage({ pdf, pageNumber, scale, placeholderSize }: PdfPageProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textLayerRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState<PDFPageProxy | null>(null);
  const [rendered, setRendered] = useState(false);
  const nearViewport = useInView(wrapperRef, '800px');

  useEffect(() => {
    let cancelled = false;
    pdf.getPage(pageNumber).then((p) => !cancelled && setPage(p));
    return () => {
      cancelled = true;
    };
  }, [pdf, pageNumber]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const textContainer = textLayerRef.current;
    if (!page || !nearViewport || !canvas || !textContainer) return;

    const viewport = page.getViewport({ scale });
    // Draw at device resolution so text stays sharp on high-DPI screens.
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.floor(viewport.width * ratio);
    canvas.height = Math.floor(viewport.height * ratio);

    const renderTask = page.render({
      canvas,
      viewport,
      transform: ratio === 1 ? undefined : [ratio, 0, 0, ratio, 0, 0],
    });
    renderTask.promise.then(
      () => setRendered(true),
      (err) => !isCancellation(err) && console.error(err),
    );

    textContainer.replaceChildren();
    const textLayer = new TextLayer({
      textContentSource: page.streamTextContent(),
      container: textContainer,
      viewport,
    });
    textLayer.render().catch((err) => !isCancellation(err) && console.error(err));

    return () => {
      renderTask.cancel();
      textLayer.cancel();
    };
  }, [page, scale, nearViewport]);

  const size = page ? page.getViewport({ scale }) : null;
  const width = Math.floor(size?.width ?? placeholderSize.width * scale);
  const height = Math.floor(size?.height ?? placeholderSize.height * scale);

  return (
    <Box
      ref={wrapperRef}
      role="img"
      aria-label={`Page ${pageNumber}`}
      data-page-number={pageNumber}
      position="relative"
      flexShrink="0"
      bg="white"
      shadow="sm"
      borderWidth="1px"
      borderColor="border"
      style={
        {
          width,
          height,
          '--total-scale-factor': scale,
          '--scale-round-x': '1px',
          '--scale-round-y': '1px',
        } as CSSProperties
      }
    >
      {!rendered && <Skeleton position="absolute" inset="0" rounded="none" />}
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
      <div ref={textLayerRef} className="textLayer" />
    </Box>
  );
}
