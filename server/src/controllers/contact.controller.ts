import { Request, Response } from 'express';
import { Contact } from '../models/Contact';

export const contactController = {
  async list(req: Request, res: Response) {
    try {
      const { search, page = '1', limit = '50' } = req.query;
      const query: any = {};
      if (search) {
        const term = search as string;
        query.$or = [
          { name: { $regex: term, $options: 'i' } },
          { profileName: { $regex: term, $options: 'i' } },
          { phoneNumber: { $regex: term, $options: 'i' } },
          { waId: { $regex: term, $options: 'i' } },
        ];
      }
      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
      const [contacts, total] = await Promise.all([
        Contact.find(query).sort({ updatedAt: -1 }).skip(skip).limit(parseInt(limit as string)),
        Contact.countDocuments(query),
      ]);
      res.json({ contacts, total, page: parseInt(page as string), limit: parseInt(limit as string) });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const contact = await Contact.findById(req.params.id);
      if (!contact) return res.status(404).json({ error: 'Contact not found' });
      res.json(contact);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!contact) return res.status(404).json({ error: 'Contact not found' });
      res.json(contact);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },
};
