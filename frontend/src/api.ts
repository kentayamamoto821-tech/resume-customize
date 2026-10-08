import type {
  ApiError,
  Paginated,
  User,
  UserCreateInput,
  UserUpdateInput,
} from '@resume/shared';

export class ApiRequestError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: ApiError,
  ) {
    super(body.error);
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`/api${path}`, {
    method,
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({ error: res.statusText }))) as ApiError;
    throw new ApiRequestError(res.status, err);
  }
  return (res.status === 204 ? undefined : await res.json()) as T;
}

export const apiGet = <T>(path: string) => request<T>('GET', path);

export const usersApi = {
  list: (params: { limit?: number; offset?: number } = {}) => {
    const qs = new URLSearchParams();
    if (params.limit !== undefined) qs.set('limit', String(params.limit));
    if (params.offset !== undefined) qs.set('offset', String(params.offset));
    const suffix = qs.size ? `?${qs}` : '';
    return request<Paginated<User>>('GET', `/users${suffix}`);
  },
  get: (id: number) => request<User>('GET', `/users/${id}`),
  create: (input: UserCreateInput) => request<User>('POST', '/users', input),
  update: (id: number, input: UserUpdateInput) => request<User>('PATCH', `/users/${id}`, input),
  remove: (id: number) => request<void>('DELETE', `/users/${id}`),
};
