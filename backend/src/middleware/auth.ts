import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { db, User } from '../db/index.js';

export interface AuthRequest extends Request {
  user?: User;
}

export function generateToken(user: User): string {
  return jwt.sign(
    { id: user.id, emailOrPhone: user.emailOrPhone, preferredLanguage: user.preferredLanguage },
    config.jwtSecret,
    { expiresIn: '30d' }
  );
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Authentication required. Please login.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as { id: string };
    const user = db.users.find((u) => u.id === decoded.id);
    if (!user) {
      res.status(401).json({ success: false, message: 'User not found or session expired.' });
      return;
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid or expired session. Please log in again.' });
  }
}

export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, config.jwtSecret) as { id: string };
      const user = db.users.find((u) => u.id === decoded.id);
      if (user) {
        req.user = user;
      }
    } catch {
      // Ignore token verification errors in optionalAuth
    }
  }
  next();
}
