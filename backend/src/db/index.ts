import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from '../config/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface User {
  id: string;
  name: string;
  emailOrPhone: string;
  passwordHash: string;
  preferredLanguage: 'en' | 'hi' | 'mr';
  state: string;
  district: string;
  village?: string;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FarmerProfile {
  userId: string;
  farmSizeAcres?: number;
  soilType?: string;
  irrigationMethod?: string;
  experienceYears?: number;
  updatedAt: string;
}

export interface Crop {
  id: string;
  userId: string;
  cropName: string;
  variety?: string;
  plantingDate?: string;
  growthStage: string;
  farmLocation?: string;
  soilType?: string;
  irrigationMethod?: string;
  notes?: string;
  createdAt: string;
}

export interface DiseaseAnalysis {
  id: string;
  userId?: string;
  imageUrl: string;
  cropIdentified: string;
  issueType?: string;
  possibleIssue: string;
  confidence: number;
  symptoms: string[];
  severity: 'low' | 'medium' | 'high' | 'unknown';
  organicSolutions: string[];
  biologicalSolutions: string[];
  additionalTreatment: string[];
  prevention: string[];
  warning: string;
  language: string;
  createdAt: string;
}

export interface Alert {
  id: string;
  userId?: string;
  type: 'rain' | 'heat' | 'irrigation' | 'disease' | 'pest';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  date: string;
  read: boolean;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  language: string;
  timestamp: string;
}

export interface DatabaseSchema {
  users: User[];
  farmerProfiles: FarmerProfile[];
  crops: Crop[];
  diseaseAnalyses: DiseaseAnalysis[];
  alerts: Alert[];
  chatMessages: ChatMessage[];
}

class Database {
  private dbPath: string;
  private data: DatabaseSchema;

  constructor() {
    this.dbPath = config.databasePath;
    const dir = path.dirname(this.dbPath);
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    } catch (err) {
      console.warn('[DB] Could not ensure directory exists:', err);
    }

    // Seed file fallback if destination file doesn't exist yet (e.g. /tmp on Vercel)
    if (!fs.existsSync(this.dbPath)) {
      const candidateSeeds = [
        path.resolve(process.cwd(), 'backend/data/krishimitra.json'),
        path.resolve(process.cwd(), 'data/krishimitra.json'),
        path.resolve(__dirname, '../../data/krishimitra.json'),
        path.resolve(__dirname, '../../../data/krishimitra.json'),
        path.resolve(__dirname, '../data/krishimitra.json'),
        path.resolve(__dirname, './data/krishimitra.json')
      ];
      for (const seed of candidateSeeds) {
        if (fs.existsSync(seed)) {
          try {
            fs.copyFileSync(seed, this.dbPath);
            break;
          } catch {
            // ignore and fallback
          }
        }
      }
    }

    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(this.dbPath)) {
        const raw = fs.readFileSync(this.dbPath, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          users: parsed.users || [],
          farmerProfiles: parsed.farmerProfiles || [],
          crops: parsed.crops || [],
          diseaseAnalyses: parsed.diseaseAnalyses || [],
          alerts: parsed.alerts || [],
          chatMessages: parsed.chatMessages || [],
        };
      }
    } catch (err) {
      console.error('Error loading database file, checking candidate seeds:', err);
    }

    const candidateSeeds = [
      path.resolve(process.cwd(), 'backend/data/krishimitra.json'),
      path.resolve(process.cwd(), 'data/krishimitra.json'),
      path.resolve(__dirname, '../../data/krishimitra.json'),
      path.resolve(__dirname, '../../../data/krishimitra.json'),
      path.resolve(__dirname, '../data/krishimitra.json'),
      path.resolve(__dirname, './data/krishimitra.json')
    ];
    for (const seed of candidateSeeds) {
      try {
        if (fs.existsSync(seed)) {
          const raw = fs.readFileSync(seed, 'utf-8');
          const parsed = JSON.parse(raw);
          return {
            users: parsed.users || [],
            farmerProfiles: parsed.farmerProfiles || [],
            crops: parsed.crops || [],
            diseaseAnalyses: parsed.diseaseAnalyses || [],
            alerts: parsed.alerts || [],
            chatMessages: parsed.chatMessages || [],
          };
        }
      } catch {
        // continue
      }
    }

    return {
      users: [],
      farmerProfiles: [],
      crops: [],
      diseaseAnalyses: [],
      alerts: [],
      chatMessages: [],
    };
  }

  private save(): void {
    try {
      const dir = path.dirname(this.dbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const tempPath = `${this.dbPath}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tempPath, this.dbPath);
    } catch (err) {
      console.warn('[DB] Warning: could not persist database to disk:', err);
    }
  }

  // Users
  get users() {
    return {
      find: (predicate: (u: User) => boolean) => this.data.users.find(predicate),
      filter: (predicate: (u: User) => boolean) => this.data.users.filter(predicate),
      create: (user: User) => {
        this.data.users.push(user);
        this.save();
        return user;
      },
      update: (id: string, updates: Partial<User>) => {
        const index = this.data.users.findIndex((u) => u.id === id);
        if (index !== -1) {
          this.data.users[index] = { ...this.data.users[index], ...updates, updatedAt: new Date().toISOString() };
          this.save();
          return this.data.users[index];
        }
        return null;
      },
    };
  }

  // Farmer Profiles
  get profiles() {
    return {
      findByUserId: (userId: string) => this.data.farmerProfiles.find((p) => p.userId === userId),
      upsert: (profile: FarmerProfile) => {
        const index = this.data.farmerProfiles.findIndex((p) => p.userId === profile.userId);
        if (index !== -1) {
          this.data.farmerProfiles[index] = { ...this.data.farmerProfiles[index], ...profile, updatedAt: new Date().toISOString() };
        } else {
          this.data.farmerProfiles.push({ ...profile, updatedAt: new Date().toISOString() });
        }
        this.save();
        return profile;
      },
    };
  }

  // Crops
  get crops() {
    return {
      findByUserId: (userId: string) => this.data.crops.filter((c) => c.userId === userId),
      findById: (id: string) => this.data.crops.find((c) => c.id === id),
      create: (crop: Crop) => {
        this.data.crops.push(crop);
        this.save();
        return crop;
      },
      update: (id: string, updates: Partial<Crop>) => {
        const index = this.data.crops.findIndex((c) => c.id === id);
        if (index !== -1) {
          this.data.crops[index] = { ...this.data.crops[index], ...updates };
          this.save();
          return this.data.crops[index];
        }
        return null;
      },
      delete: (id: string, userId: string) => {
        const index = this.data.crops.findIndex((c) => c.id === id && c.userId === userId);
        if (index !== -1) {
          this.data.crops.splice(index, 1);
          this.save();
          return true;
        }
        return false;
      },
    };
  }

  // Disease Analyses
  get diseaseAnalyses() {
    return {
      findByUserId: (userId?: string) => {
        if (!userId) return this.data.diseaseAnalyses.slice(-20);
        return this.data.diseaseAnalyses.filter((d) => d.userId === userId || !d.userId).slice(-20);
      },
      findById: (id: string) => this.data.diseaseAnalyses.find((d) => d.id === id),
      create: (analysis: DiseaseAnalysis) => {
        this.data.diseaseAnalyses.push(analysis);
        this.save();
        return analysis;
      },
    };
  }

  // Alerts
  get alerts() {
    return {
      findByUserId: (userId?: string) => {
        return this.data.alerts.filter((a) => !a.userId || a.userId === userId);
      },
      create: (alert: Alert) => {
        this.data.alerts.unshift(alert);
        if (this.data.alerts.length > 50) this.data.alerts.pop();
        this.save();
        return alert;
      },
      markAsRead: (id: string) => {
        const item = this.data.alerts.find((a) => a.id === id);
        if (item) {
          item.read = true;
          this.save();
          return true;
        }
        return false;
      },
    };
  }

  // Chat
  get chat() {
    return {
      getMessages: (conversationId: string) => {
        return this.data.chatMessages.filter((m) => m.conversationId === conversationId);
      },
      addMessage: (msg: ChatMessage) => {
        this.data.chatMessages.push(msg);
        this.save();
        return msg;
      },
    };
  }
}

export const db = new Database();
