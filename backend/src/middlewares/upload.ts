import type { RequestHandler } from 'express';
import multer from 'multer';
import { MAX_DOCUMENT_SIZE_BYTES } from '@resume/shared';
import { HttpError, badRequest } from '../utils/http-error.js';

const MB = 1024 * 1024;

const pdfUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_DOCUMENT_SIZE_BYTES, files: 1 },
  // Decode non-ASCII file names (e.g. Japanese) correctly; busboy defaults to latin1.
  defParamCharset: 'utf8',
});

/**
 * Accepts a single file in the multipart field `fieldName` and puts it on `req.file`.
 * Multer errors are converted to HttpErrors so the error handler renders them uniformly.
 */
export function singleFileUpload(fieldName: string): RequestHandler {
  const handler = pdfUpload.single(fieldName);
  return (req, res, next) => {
    handler(req, res, (err: unknown) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          next(new HttpError(413, `File is too large (max ${MAX_DOCUMENT_SIZE_BYTES / MB} MB)`));
        } else if (err.code === 'LIMIT_UNEXPECTED_FILE' || err.code === 'LIMIT_FILE_COUNT') {
          next(badRequest(`Upload exactly one file in the "${fieldName}" field`));
        } else {
          next(badRequest(err.message));
        }
        return;
      }
      next(err);
    });
  };
}
