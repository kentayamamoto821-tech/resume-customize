import { Router } from 'express';
import { documentController } from '../controllers/document.controller.js';
import { singleFileUpload } from '../middlewares/upload.js';

export const documentRouter = Router();

documentRouter.get('/', documentController.list);
documentRouter.post('/', singleFileUpload('file'), documentController.importPdf);
documentRouter.get('/:id/file', documentController.getFile);
documentRouter.delete('/:id', documentController.remove);
