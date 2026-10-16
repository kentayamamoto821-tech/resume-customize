import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { DocumentFile } from '@resume/shared';
import { apiUrl, http } from './client';

export const documentsApi = {
  list: () => http.get<DocumentFile[]>('/documents'),
  importPdf: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return http.upload<DocumentFile>('/documents', form);
  },
  remove: (id: number) => http.delete(`/documents/${id}`),
  /** URL that opens the PDF in the browser, or downloads it with `download: true`. */
  fileUrl: (id: number, { download = false } = {}) =>
    apiUrl(`/documents/${id}/file${download ? '?download=1' : ''}`),
};

export const documentKeys = {
  all: ['documents'] as const,
};

export function useDocuments() {
  return useQuery({ queryKey: documentKeys.all, queryFn: documentsApi.list });
}

function useInvalidateDocuments() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: documentKeys.all });
}

export function useImportPdf() {
  const invalidate = useInvalidateDocuments();
  return useMutation({ mutationFn: documentsApi.importPdf, onSuccess: invalidate });
}

export function useDeleteDocument() {
  const invalidate = useInvalidateDocuments();
  return useMutation({ mutationFn: documentsApi.remove, onSuccess: invalidate });
}
