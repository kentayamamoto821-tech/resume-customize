import path from 'node:path';
import { PDF_MIME_TYPE, type DocumentFile } from '@resume/shared';
import { documentRepository } from '../repositories/document.repository.js';
import { badRequest, notFound } from '../utils/http-error.js';

// Every PDF starts with this signature; checking it stops renamed non-PDF files.
const PDF_SIGNATURE = Buffer.from('%PDF-');
const MAX_FILE_NAME_LENGTH = 255;

interface UploadedFile {
  originalname: string;
  buffer: Buffer;
}

function isPdf(content: Buffer): boolean {
  return content.subarray(0, PDF_SIGNATURE.length).equals(PDF_SIGNATURE);
}

/** Keeps only the base name and removes control characters. */
function cleanFileName(name: string): string {
  const base = path.basename(name.replace(/\\/g, '/'));
  const cleaned = base.replace(/[\u0000-\u001f\u007f]/g, '').trim();
  return (cleaned || 'document.pdf').slice(0, MAX_FILE_NAME_LENGTH);
}

function list(): Promise<DocumentFile[]> {
  return documentRepository.findAll();
}

async function importPdf(file: UploadedFile | undefined): Promise<DocumentFile> {
  if (!file) throw badRequest('Choose a PDF file to import');
  if (file.buffer.length === 0) throw badRequest('The file is empty');
  if (!isPdf(file.buffer)) throw badRequest('Only PDF files can be imported');

  return documentRepository.create({
    fileName: cleanFileName(file.originalname),
    mimeType: PDF_MIME_TYPE,
    content: file.buffer,
  });
}

async function getById(id: number): Promise<DocumentFile> {
  const document = await documentRepository.findById(id);
  if (!document) throw notFound('Document');
  return document;
}

async function getContent(id: number) {
  const document = await documentRepository.findContent(id);
  if (!document) throw notFound('Document');
  return document;
}

async function remove(id: number): Promise<void> {
  const deleted = await documentRepository.remove(id);
  if (!deleted) throw notFound('Document');
}

export const documentService = { list, importPdf, getById, getContent, remove };
