import { Router, Response } from 'express';
import { db } from '../db/index.js';
import { requireAuth, AuthRequest } from '../middleware/auth.js';

export const profileRouter = Router();

profileRouter.get('/', requireAuth, (req: AuthRequest, res: Response): void => {
  const user = req.user!;
  const { passwordHash: _, ...safeUser } = user;
  const profile = db.profiles.findByUserId(user.id) || {
    userId: user.id,
    farmSizeAcres: 2.5,
    soilType: 'Medium Black Soil',
    irrigationMethod: 'Drip Irrigation',
    updatedAt: new Date().toISOString()
  };

  res.json({
    success: true,
    user: safeUser,
    profile
  });
});

profileRouter.put('/', requireAuth, (req: AuthRequest, res: Response): void => {
  try {
    const user = req.user!;
    const { name, preferredLanguage, state, district, village, farmSizeAcres, soilType, irrigationMethod } = req.body;

    const userUpdates: Record<string, unknown> = {};
    if (name) userUpdates.name = name.trim();
    if (preferredLanguage) userUpdates.preferredLanguage = preferredLanguage;
    if (state) userUpdates.state = state.trim();
    if (district) userUpdates.district = district.trim();
    if (village !== undefined) userUpdates.village = village.trim();

    const updatedUser = db.users.update(user.id, userUpdates);

    const profileUpdates = {
      userId: user.id,
      farmSizeAcres: farmSizeAcres !== undefined ? Number(farmSizeAcres) : undefined,
      soilType: soilType || 'Medium Black Soil',
      irrigationMethod: irrigationMethod || 'Drip Irrigation',
      updatedAt: new Date().toISOString()
    };
    const updatedProfile = db.profiles.upsert(profileUpdates);

    const { passwordHash: _, ...safeUser } = updatedUser!;
    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: safeUser,
      profile: updatedProfile
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ success: false, message: 'Could not update profile.' });
  }
});

profileRouter.post('/language', requireAuth, (req: AuthRequest, res: Response): void => {
  const { language } = req.body;
  if (!['en', 'hi', 'mr'].includes(language)) {
    res.status(400).json({ success: false, message: 'Supported languages are: en, hi, mr' });
    return;
  }

  db.users.update(req.user!.id, { preferredLanguage: language });
  res.json({ success: true, message: 'Language preference saved.', language });
});
