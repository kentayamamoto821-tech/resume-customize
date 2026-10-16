import { GlobalWorkerOptions } from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// pdf.js parses documents in a web worker; point it at the bundled worker file.
GlobalWorkerOptions.workerSrc = workerUrl;

export * from 'pdfjs-dist';

/** A user-facing message for a pdf.js load error. */
export function describePdfError(error: unknown): string {
  const name = error instanceof Error ? error.name : '';
  switch (name) {
    case 'InvalidPDFException':
      return 'This file couldn’t be read as a PDF. It may be damaged.';
    case 'PasswordException':
      return 'This PDF is password-protected and can’t be shown.';
    case 'ResponseException':
    case 'MissingPDFException':
      return 'The file couldn’t be loaded. It may have been deleted.';
    default:
      return 'Something went wrong while opening this PDF.';
  }
}

/** Render/text-layer tasks reject with this when cancelled; that's expected, not an error. */
export function isCancellation(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.name === 'RenderingCancelledException' || error.name === 'AbortException')
  );
}
