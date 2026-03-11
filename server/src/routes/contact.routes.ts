import { Router } from 'express';
import { contactController } from '../controllers/contact.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', contactController.list);
router.get('/:id', contactController.getById);
router.patch('/:id', contactController.update);

export default router;
