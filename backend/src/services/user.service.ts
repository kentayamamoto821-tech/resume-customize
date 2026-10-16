import type {
  Paginated,
  User,
  UserCreateInput,
  UserListQuery,
  UserUpdateInput,
} from '@resume/shared';
import { isUniqueViolation } from '../db/errors.js';
import { userRepository } from '../repositories/user.repository.js';
import { conflict, notFound } from '../utils/http-error.js';

const EMAIL_TAKEN = 'Email is already in use';

/** Turns the users.email unique-constraint error into a 409 tied to the email field. */
async function guardEmailConflict<T>(operation: Promise<T>): Promise<T> {
  try {
    return await operation;
  } catch (err) {
    if (isUniqueViolation(err, 'users_email_key')) {
      throw conflict(EMAIL_TAKEN, [{ path: ['email'], message: EMAIL_TAKEN }]);
    }
    throw err;
  }
}

async function list(query: UserListQuery): Promise<Paginated<User>> {
  const { rows, total } = await userRepository.findMany(query);
  return { items: rows, total, limit: query.limit, offset: query.offset };
}

async function getById(id: number): Promise<User> {
  const user = await userRepository.findById(id);
  if (!user) throw notFound('User');
  return user;
}

function create(input: UserCreateInput): Promise<User> {
  return guardEmailConflict(userRepository.create(input));
}

async function update(id: number, input: UserUpdateInput): Promise<User> {
  const user = await guardEmailConflict(userRepository.update(id, input));
  if (!user) throw notFound('User');
  return user;
}

async function remove(id: number): Promise<void> {
  const deleted = await userRepository.remove(id);
  if (!deleted) throw notFound('User');
}

export const userService = { list, getById, create, update, remove };
