import { Router } from 'express';
import { userController } from '../controllers/user.controller.js';

export const userRouter = Router();

userRouter.get('/', userController.list);
userRouter.post('/', userController.create);
userRouter.get('/:id', userController.getById);
userRouter.patch('/:id', userController.update);
userRouter.delete('/:id', userController.remove);
