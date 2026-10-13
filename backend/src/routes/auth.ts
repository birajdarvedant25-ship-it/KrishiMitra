import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { db, User } from '../db/index.js';
import { generateToken, requireAuth, AuthRequest } from '../middleware/auth.js';

export const authRouter = Router();

// Register
authRouter.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, emailOrPhone, password, preferredLanguage, state, district, village } = req.body;

    if (!name || !emailOrPhone || !password) {
      res.status(400).json({ success: false, message: 'Please provide full name, email or phone, and password.' });
      return;
    }

    const cleanContact = emailOrPhone.trim().toLowerCase();
    const existing = db.users.find((u) => u.emailOrPhone.toLowerCase() === cleanContact);
    if (existing) {
      res.status(409).json({ success: false, message: 'An account with this email or phone already exists. Please login.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser: User = {
      id: uuidv4(),
      name: name.trim(),
      emailOrPhone: cleanContact,
      passwordHash,
      preferredLanguage: ['en', 'hi', 'mr'].includes(preferredLanguage) ? preferredLanguage : 'mr',
      state: state?.trim() || 'Maharashtra',
      district: district?.trim() || 'Pune',
      village: village?.trim() || '',
      onboardingCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.users.create(newUser);

    const token = generateToken(newUser);
    const { passwordHash: _, ...safeUser } = newUser;

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to KrishiMitra.',
      token,
      user: safeUser
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, message: 'Registration could not be completed right now. Please try again.' });
  }
});

// Login
authRouter.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
      res.status(400).json({ success: false, message: 'Please enter your email or phone number and password.' });
      return;
    }

    const cleanContact = emailOrPhone.trim().toLowerCase();
    const user = db.users.find((u) => u.emailOrPhone.toLowerCase() === cleanContact);

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid credentials. Please verify your phone/email and password.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid credentials. Please verify your phone/email and password.' });
      return;
    }

    const token = generateToken(user);
    const { passwordHash: _, ...safeUser } = user;

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: safeUser
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Unable to log in at this time. Please try again.' });
  }
});

// Current User Profile
authRouter.get('/me', requireAuth, (req: AuthRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authenticated.' });
    return;
  }
  const { passwordHash: _, ...safeUser } = req.user;
  const profile = db.profiles.findByUserId(req.user.id) || null;
  res.json({ success: true, user: safeUser, profile });
});

// Complete Onboarding Flow
authRouter.post('/onboarding', requireAuth, (req: AuthRequest, res: Response): void => {
  try {
    const user = req.user!;
    const { preferredLanguage, state, district, village, crops, farmSizeAcres, soilType, irrigationMethod } = req.body;

    const updatedUser = db.users.update(user.id, {
      preferredLanguage: preferredLanguage || user.preferredLanguage,
      state: state || user.state,
      district: district || user.district,
      village: village !== undefined ? village : user.village,
      onboardingCompleted: true
    });

    if (farmSizeAcres || soilType || irrigationMethod) {
      db.profiles.upsert({
        userId: user.id,
        farmSizeAcres: farmSizeAcres ? parseFloat(farmSizeAcres) : undefined,
        soilType: soilType || 'Medium Black Soil',
        irrigationMethod: irrigationMethod || 'Drip Irrigation',
        updatedAt: new Date().toISOString()
      });
    }

    // Save initial crops if provided
    if (Array.isArray(crops)) {
      crops.forEach((cropItem: { name: string; variety?: string; stage?: string }) => {
        if (cropItem && cropItem.name) {
          db.crops.create({
            id: uuidv4(),
            userId: user.id,
            cropName: cropItem.name,
            variety: cropItem.variety || '',
            growthStage: cropItem.stage || 'Vegetative',
            farmLocation: district || user.district,
            soilType: soilType || 'Medium Black Soil',
            irrigationMethod: irrigationMethod || 'Drip Irrigation',
            createdAt: new Date().toISOString()
          });
        }
      });
    }

    const { passwordHash: _, ...safeUser } = updatedUser!;
    res.json({ success: true, message: 'Onboarding completed successfully!', user: safeUser });
  } catch (err) {
    console.error('Onboarding error:', err);
    res.status(500).json({ success: false, message: 'Error saving onboarding choices.' });
  }
});

// Forgot Password
authRouter.post('/forgot-password', (req: Request, res: Response): void => {
  const { emailOrPhone } = req.body;
  if (!emailOrPhone) {
    res.status(400).json({ success: false, message: 'Please provide registered email or phone.' });
    return;
  }

  // Simulate password reset token instruction
  res.json({
    success: true,
    message: 'If your account is registered, a password reset link/OTP has been sent to your phone or email. For quick testing, you can use the reset password screen with token "KRISHI2026".',
    demoToken: 'KRISHI2026'
  });
});

// Reset Password
authRouter.post('/reset-password', async (req: Request, res: Response): Promise<void> => {
  try {
    const { emailOrPhone, resetToken, newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
      return;
    }

    const user = db.users.find((u) => u.emailOrPhone.toLowerCase() === emailOrPhone?.trim()?.toLowerCase());
    if (!user) {
      res.status(404).json({ success: false, message: 'User with this email or phone was not found.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);
    db.users.update(user.id, { passwordHash });

    res.json({ success: true, message: 'Password has been reset successfully. Please log in with your new password.' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ success: false, message: 'Password reset could not be completed.' });
  }
});
