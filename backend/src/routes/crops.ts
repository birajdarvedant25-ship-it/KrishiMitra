import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db, Crop } from '../db/index.js';
import { optionalAuth, requireAuth, AuthRequest } from '../middleware/auth.js';
import { AgriculturalKnowledgeService, CROP_PROFILES } from '../services/agriculture/knowledgeBase.js';

export const cropsRouter = Router();

// Get crops
cropsRouter.get('/', optionalAuth, (req: AuthRequest, res: Response): void => {
  const userId = req.user?.id;
  let userCrops: Crop[] = [];

  if (userId) {
    userCrops = db.crops.findByUserId(userId);
  }

  // If no crops found yet, provide starter sample crops so dashboard is immediately rich & engaging
  if (userCrops.length === 0) {
    const demoCrops: Crop[] = [
      {
        id: 'demo-tomato',
        userId: userId || 'demo-user',
        cropName: 'Tomato (टोमॅटो)',
        variety: 'Abhinav Hybrid',
        growthStage: 'Flowering & Fruit Set',
        plantingDate: new Date(Date.now() - 40 * 86400000).toISOString().split('T')[0],
        soilType: 'Medium Black Soil',
        irrigationMethod: 'Drip Irrigation',
        notes: 'Healthy crop canopy, regular organic compost applied.',
        createdAt: new Date().toISOString()
      },
      {
        id: 'demo-cotton',
        userId: userId || 'demo-user',
        cropName: 'Cotton (कापूस)',
        variety: 'Bt Cotton RCH-2',
        growthStage: 'Square Formation',
        plantingDate: new Date(Date.now() - 50 * 86400000).toISOString().split('T')[0],
        soilType: 'Deep Black Soil',
        irrigationMethod: 'Furrow Irrigation',
        notes: 'Installed pheromone traps for pink bollworm monitoring.',
        createdAt: new Date().toISOString()
      }
    ];

    if (userId) {
      demoCrops.forEach((c) => db.crops.create(c));
      userCrops = demoCrops;
    } else {
      res.json({ success: true, crops: demoCrops });
      return;
    }
  }

  res.json({ success: true, crops: userCrops });
});

// Add Crop
cropsRouter.post('/', requireAuth, (req: AuthRequest, res: Response): void => {
  try {
    const { cropName, variety, plantingDate, growthStage, farmLocation, soilType, irrigationMethod, notes } = req.body;

    if (!cropName) {
      res.status(400).json({ success: false, message: 'Crop name is required.' });
      return;
    }

    const newCrop: Crop = {
      id: uuidv4(),
      userId: req.user!.id,
      cropName: cropName.trim(),
      variety: variety?.trim() || '',
      plantingDate: plantingDate || new Date().toISOString().split('T')[0],
      growthStage: growthStage?.trim() || 'Vegetative',
      farmLocation: farmLocation?.trim() || req.user!.district,
      soilType: soilType?.trim() || 'Medium Black Soil',
      irrigationMethod: irrigationMethod?.trim() || 'Drip Irrigation',
      notes: notes?.trim() || '',
      createdAt: new Date().toISOString()
    };

    const saved = db.crops.create(newCrop);
    res.status(201).json({ success: true, message: 'Crop added to farm successfully!', crop: saved });
  } catch (err) {
    console.error('Add crop error:', err);
    res.status(500).json({ success: false, message: 'Failed to add crop.' });
  }
});

// Get Crop Detail + Knowledge Profile
cropsRouter.get('/:id', optionalAuth, (req: AuthRequest, res: Response): void => {
  const { id } = req.params;
  const crop = db.crops.findById(id);

  if (!crop) {
    res.status(404).json({ success: false, message: 'Crop not found.' });
    return;
  }

  const knowledge = AgriculturalKnowledgeService.getCrop(crop.cropName);
  const commonDiseases = AgriculturalKnowledgeService.findDiseasesForCrop(crop.cropName);

  res.json({
    success: true,
    crop,
    knowledge: knowledge || null,
    commonDiseases
  });
});

// Update Crop
cropsRouter.put('/:id', requireAuth, (req: AuthRequest, res: Response): void => {
  const { id } = req.params;
  const crop = db.crops.findById(id);

  if (!crop || crop.userId !== req.user!.id) {
    res.status(404).json({ success: false, message: 'Crop not found or permission denied.' });
    return;
  }

  const updated = db.crops.update(id, req.body);
  res.json({ success: true, message: 'Crop details updated.', crop: updated });
});

// Delete Crop
cropsRouter.delete('/:id', requireAuth, (req: AuthRequest, res: Response): void => {
  const { id } = req.params;
  const success = db.crops.delete(id, req.user!.id);

  if (!success) {
    res.status(404).json({ success: false, message: 'Crop not found or could not be removed.' });
    return;
  }

  res.json({ success: true, message: 'Crop removed successfully.' });
});

// Reference list of supported crops in the knowledge layer
cropsRouter.get('/meta/supported', (_req, res: Response): void => {
  res.json({
    success: true,
    supportedCrops: Object.values(CROP_PROFILES)
  });
});
