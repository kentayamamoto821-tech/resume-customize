import { Router } from 'express';
import { documentRouter } from './document.routes.js';
import { healthRouter } from './health.routes.js';
import { userRouter } from './user.routes.js';

export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/documents', documentRouter);
