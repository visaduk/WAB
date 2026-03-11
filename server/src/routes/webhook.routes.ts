import { Router } from 'express';
import { webhookController } from '../controllers/webhook.controller';

const router = Router();

router.get('/', webhookController.verify);
router.post('/', webhookController.handleIncoming);

export default router;
