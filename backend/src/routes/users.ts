import { Router } from 'express';
import {
  idParamSchema,
  listQuerySchema,
  userCreateSchema,
  userUpdateSchema,
} from '@resume/shared';
import { notFound } from '../errors.js';
import * as users from '../users/userRepository.js';

export const usersRouter = Router();

usersRouter.get('/', async (req, res) => {
  const query = listQuerySchema.parse(req.query);
  res.json(await users.listUsers(query));
});

usersRouter.get('/:id', async (req, res) => {
  const user = await users.getUser(idParamSchema.parse(req.params.id));
  if (!user) throw notFound('User');
  res.json(user);
});

usersRouter.post('/', async (req, res) => {
  const input = userCreateSchema.parse(req.body);
  res.status(201).json(await users.createUser(input));
});

usersRouter.patch('/:id', async (req, res) => {
  const id = idParamSchema.parse(req.params.id);
  const input = userUpdateSchema.parse(req.body);
  const user = await users.updateUser(id, input);
  if (!user) throw notFound('User');
  res.json(user);
});

usersRouter.delete('/:id', async (req, res) => {
  const deleted = await users.deleteUser(idParamSchema.parse(req.params.id));
  if (!deleted) throw notFound('User');
  res.status(204).end();
});
