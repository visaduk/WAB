import { Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from '../models/User';
import { env } from '../config/env';

function generateToken(user: { _id: any; email: string; role: string }) {
  const options: SignOptions = { expiresIn: env.JWT_EXPIRES_IN as any };
  return jwt.sign(
    { id: user._id.toString(), email: user.email, role: user.role },
    env.JWT_SECRET,
    options
  );
}

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const { email, password, name, role } = req.body;
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ error: 'Email already registered' });
      }
      const user = await User.create({ email, password, name, role: role || 'agent' });
      const token = generateToken(user);
      res.status(201).json({
        token,
        user: { id: user._id, email: user.email, name: user.name, role: user.role },
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      user.isOnline = true;
      await user.save();
      const token = generateToken(user);
      res.json({
        token,
        user: { id: user._id, email: user.email, name: user.name, role: user.role },
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async me(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json({
        user: { id: user._id, email: user.email, name: user.name, role: user.role, isOnline: user.isOnline },
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
};
