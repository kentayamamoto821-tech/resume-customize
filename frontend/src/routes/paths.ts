export const paths = {
  home: '/',
  workflow: '/#workflow',
  users: '/users',
  documents: '/documents',
  document: (id: number) => `/documents/${id}`,
} as const;
