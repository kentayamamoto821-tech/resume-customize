import type { Request, Response } from 'express';
import { idParamSchema } from '@resume/shared';
import { documentService } from '../services/document.service.js';
import { contentDisposition } from '../utils/content-disposition.js';

async function list(_req: Request, res: Response) {
  res.json(await documentService.list());
}

async function getById(req: Request, res: Response) {
  res.json(await documentService.getById(idParamSchema.parse(req.params.id)));
}

async function importPdf(req: Request, res: Response) {
  res.status(201).json(await documentService.importPdf(req.file));
}

/** Streams the file; `?download=1` saves it instead of opening it in the browser. */
async function getFile(req: Request, res: Response) {
  const id = idParamSchema.parse(req.params.id);
  const { fileName, mimeType, content } = await documentService.getContent(id);
  const disposition = req.query.download === '1' ? 'attachment' : 'inline';

  res.setHeader('Content-Type', mimeType);
  res.setHeader('Content-Length', content.length);
  res.setHeader('Content-Disposition', contentDisposition(disposition, fileName));
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.send(content);
}

async function remove(req: Request, res: Response) {
  await documentService.remove(idParamSchema.parse(req.params.id));
  res.status(204).end();
}

export const documentController = { list, getById, importPdf, getFile, remove };
