import type { DocumentFile } from '@resume/shared';
import { pool } from '../db/pool.js';

const DOCUMENT_COLUMNS = `
  id,
  file_name  AS "fileName",
  mime_type  AS "mimeType",
  size_bytes AS "sizeBytes",
  created_at AS "createdAt"
`;

interface NewDocument {
  fileName: string;
  mimeType: string;
  content: Buffer;
}

async function findAll(): Promise<DocumentFile[]> {
  const { rows } = await pool.query<DocumentFile>(
    `SELECT ${DOCUMENT_COLUMNS} FROM documents ORDER BY created_at DESC, id DESC`,
  );
  return rows;
}

async function findById(id: number): Promise<DocumentFile | null> {
  const { rows } = await pool.query<DocumentFile>(
    `SELECT ${DOCUMENT_COLUMNS} FROM documents WHERE id = $1`,
    [id],
  );
  return rows[0] ?? null;
}

async function findContent(
  id: number,
): Promise<{ fileName: string; mimeType: string; content: Buffer } | null> {
  const { rows } = await pool.query<{ fileName: string; mimeType: string; content: Buffer }>(
    `SELECT file_name AS "fileName", mime_type AS "mimeType", content FROM documents WHERE id = $1`,
    [id],
  );
  return rows[0] ?? null;
}

async function create({ fileName, mimeType, content }: NewDocument): Promise<DocumentFile> {
  const { rows } = await pool.query<DocumentFile>(
    `INSERT INTO documents (file_name, mime_type, size_bytes, content)
     VALUES ($1, $2, $3, $4)
     RETURNING ${DOCUMENT_COLUMNS}`,
    [fileName, mimeType, content.length, content],
  );
  return rows[0];
}

async function remove(id: number): Promise<boolean> {
  const { rowCount } = await pool.query('DELETE FROM documents WHERE id = $1', [id]);
  return (rowCount ?? 0) > 0;
}

export const documentRepository = { findAll, findById, findContent, create, remove };
