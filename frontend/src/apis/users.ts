import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Paginated, User, UserCreateInput, UserUpdateInput } from '@resume/shared';
import { http } from './client';

export interface UserListParams {
  limit: number;
  offset: number;
  q?: string;
}

export const usersApi = {
  list: (params: UserListParams, signal?: AbortSignal) =>
    http.get<Paginated<User>>('/users', { query: { ...params }, signal }),
  get: (id: number) => http.get<User>(`/users/${id}`),
  create: (input: UserCreateInput) => http.post<User>('/users', input),
  update: (id: number, input: UserUpdateInput) => http.patch<User>(`/users/${id}`, input),
  remove: (id: number) => http.delete(`/users/${id}`),
};

export const userKeys = {
  all: ['users'] as const,
  list: (params: UserListParams) => [...userKeys.all, 'list', params] as const,
};

export function useUsers(params: UserListParams) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: ({ signal }) => usersApi.list(params, signal),
    placeholderData: keepPreviousData,
  });
}

function useInvalidateUsers() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: userKeys.all });
}

export function useCreateUser() {
  const invalidate = useInvalidateUsers();
  return useMutation({ mutationFn: usersApi.create, onSuccess: invalidate });
}

export function useUpdateUser() {
  const invalidate = useInvalidateUsers();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UserUpdateInput }) =>
      usersApi.update(id, input),
    onSuccess: invalidate,
  });
}

export function useDeleteUser() {
  const invalidate = useInvalidateUsers();
  return useMutation({ mutationFn: usersApi.remove, onSuccess: invalidate });
}
