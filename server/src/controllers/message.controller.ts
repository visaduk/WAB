import { Request, Response } from 'express';
import { messageService } from '../services/message.service';
import { AuthRequest } from '../middleware/auth.middleware';

export const messageController = {
  async send(req: AuthRequest, res: Response) {
    try {
      const result = await messageService.send({
        ...req.body,
        sentBy: req.user!.id,
      });
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },
};
