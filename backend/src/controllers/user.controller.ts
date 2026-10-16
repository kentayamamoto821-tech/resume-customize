import type { Request, Response } from 'express';
import {
  idParamSchema,
  userCreateSchema,
  userListQuerySchema,
  userUpdateSchema,
} from '@resume/shared';
import { userService } from '../services/user.service.js';

// Controllers translate HTTP <-> service calls. Validation failures throw a
// ZodError, which the error-handler middleware renders as a 400.

async function list(req: Request, res: Response) {
  const query = userListQuerySchema.parse(req.query);
  res.json(await userService.list(query));
}

async function getById(req: Request, res: Response) {
  const id = idParamSchema.parse(req.params.id);
  res.json(await userService.getById(id));
}

async function create(req: Request, res: Response) {
  const input = userCreateSchema.parse(req.body);
  res.status(201).json(await userService.create(input));
}

async function update(req: Request, res: Response) {
  const id = idParamSchema.parse(req.params.id);
  const input = userUpdateSchema.parse(req.body);
  res.json(await userService.update(id, input));
}

async function remove(req: Request, res: Response) {
  const id = idParamSchema.parse(req.params.id);
  await userService.remove(id);
  res.status(204).end();
}

export const userController = { list, getById, create, update, remove };
