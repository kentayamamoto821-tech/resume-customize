export const PDF_MIME_TYPE = 'application/pdf';
export const MAX_DOCUMENT_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

/** Metadata of an imported file; the content is fetched separately. */
export interface DocumentFile {
  id: number;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
}
