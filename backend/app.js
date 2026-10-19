"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/app.ts
var app_exports = {};
__export(app_exports, {
  app: () => app,
  default: () => app_default
});
module.exports = __toCommonJS(app_exports);
var import_express9 = __toESM(require("express"), 1);
var import_cors = __toESM(require("cors"), 1);

// src/config/index.ts
var import_dotenv = __toESM(require("dotenv"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_url = require("url");
var getDirname = () => {
  try {
    if (typeof __dirname === "string") return __dirname;
  } catch {
  }
  try {
    const getMetaUrl = new Function('return typeof import.meta !== "undefined" && import.meta ? import.meta.url : null');
    const metaUrl = getMetaUrl();
    if (metaUrl) {
      return import_path.default.dirname((0, import_url.fileURLToPath)(metaUrl));
    }
  } catch {
  }
  return process.cwd();
};
var __dirname = getDirname();
var possibleEnvPaths = [
  import_path.default.resolve(process.cwd(), ".env"),
  import_path.default.resolve(process.cwd(), "backend/.env"),
  import_path.default.resolve(__dirname, "../../.env"),
  import_path.default.resolve(__dirname, "../../../.env")
];
for (const envPath of possibleEnvPaths) {
  if (import_fs.default.existsSync(envPath)) {
    import_dotenv.default.config({ path: envPath });
  }
}
var rawAiMode = (process.env.AI_MODE || "").trim().toLowerCase();
var geminiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY)?.trim() || "";
var openaiKey = process.env.OPENAI_API_KEY?.trim() || "";
var resolvedAiMode = rawAiMode === "mock" ? "mock" : rawAiMode === "production" || rawAiMode === "live" || Boolean(geminiKey || openaiKey) ? "production" : "mock";
var isVercel = Boolean(process.env.VERCEL);
var defaultDbPath = isVercel ? import_path.default.join("/tmp", "krishimitra.json") : import_path.default.resolve(__dirname, "../../data/krishimitra.json");
var defaultUploadDir = isVercel ? import_path.default.join("/tmp", "uploads") : import_path.default.resolve(__dirname, "../../uploads");
var resolvedDbPath = process.env.DATABASE_PATH || defaultDbPath;
if (isVercel && !resolvedDbPath.startsWith("/tmp")) {
  resolvedDbPath = import_path.default.join("/tmp", import_path.default.basename(resolvedDbPath).replace(/\.db$/, ".json"));
}
var resolvedUploadDir = process.env.UPLOAD_DIR || defaultUploadDir;
if (isVercel && !resolvedUploadDir.startsWith("/tmp")) {
  resolvedUploadDir = import_path.default.join("/tmp", "uploads");
}
var config = {
  host: process.env.HOST || "0.0.0.0",
  port: parseInt(process.env.PORT || "5000", 10),
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  jwtSecret: process.env.JWT_SECRET || "krishimitra_super_secret_jwt_key_2026_dev",
  aiMode: resolvedAiMode,
  geminiApiKey: geminiKey,
  geminiModel: process.env.GEMINI_MODEL?.trim() || "",
  openaiApiKey: openaiKey,
  weatherApiKey: process.env.WEATHER_API_KEY?.trim() || "",
  databasePath: resolvedDbPath,
  uploadDir: resolvedUploadDir
};

// src/routes/auth.ts
var import_express = require("express");
var import_bcryptjs = __toESM(require("bcryptjs"), 1);
var import_uuid = require("uuid");

// src/db/index.ts
var import_fs2 = __toESM(require("fs"), 1);
var import_path2 = __toESM(require("path"), 1);
var import_url2 = require("url");
var getDirname2 = () => {
  try {
    if (typeof __dirname2 === "string") return __dirname2;
  } catch {
  }
  try {
    const getMetaUrl = new Function('return typeof import.meta !== "undefined" && import.meta ? import.meta.url : null');
    const metaUrl = getMetaUrl();
    if (metaUrl) {
      return import_path2.default.dirname((0, import_url2.fileURLToPath)(metaUrl));
    }
  } catch {
  }
  return process.cwd();
};
var __dirname2 = getDirname2();
var Database = class {
  dbPath;
  data;
  constructor() {
    this.dbPath = config.databasePath;
    const dir = import_path2.default.dirname(this.dbPath);
    try {
      if (!import_fs2.default.existsSync(dir)) {
        import_fs2.default.mkdirSync(dir, { recursive: true });
      }
    } catch (err) {
      console.warn("[DB] Could not ensure directory exists:", err);
    }
    if (!import_fs2.default.existsSync(this.dbPath)) {
      const candidateSeeds = [
        import_path2.default.resolve(process.cwd(), "backend/data/krishimitra.json"),
        import_path2.default.resolve(process.cwd(), "data/krishimitra.json"),
        import_path2.default.resolve(__dirname2, "../../data/krishimitra.json"),
        import_path2.default.resolve(__dirname2, "../../../data/krishimitra.json"),
        import_path2.default.resolve(__dirname2, "../data/krishimitra.json"),
        import_path2.default.resolve(__dirname2, "./data/krishimitra.json")
      ];
      for (const seed of candidateSeeds) {
        if (import_fs2.default.existsSync(seed)) {
          try {
            import_fs2.default.copyFileSync(seed, this.dbPath);
            break;
          } catch {
          }
        }
      }
    }
    this.data = this.load();
  }
  load() {
    try {
      if (import_fs2.default.existsSync(this.dbPath)) {
        const raw = import_fs2.default.readFileSync(this.dbPath, "utf-8");
        const parsed = JSON.parse(raw);
        return {
          users: parsed.users || [],
          farmerProfiles: parsed.farmerProfiles || [],
          crops: parsed.crops || [],
          diseaseAnalyses: parsed.diseaseAnalyses || [],
          alerts: parsed.alerts || [],
          chatMessages: parsed.chatMessages || []
        };
      }
    } catch (err) {
      console.error("Error loading database file, checking candidate seeds:", err);
    }
    const candidateSeeds = [
      import_path2.default.resolve(process.cwd(), "backend/data/krishimitra.json"),
      import_path2.default.resolve(process.cwd(), "data/krishimitra.json"),
      import_path2.default.resolve(__dirname2, "../../data/krishimitra.json"),
      import_path2.default.resolve(__dirname2, "../../../data/krishimitra.json"),
      import_path2.default.resolve(__dirname2, "../data/krishimitra.json"),
      import_path2.default.resolve(__dirname2, "./data/krishimitra.json")
    ];
    for (const seed of candidateSeeds) {
      try {
        if (import_fs2.default.existsSync(seed)) {
          const raw = import_fs2.default.readFileSync(seed, "utf-8");
          const parsed = JSON.parse(raw);
          return {
            users: parsed.users || [],
            farmerProfiles: parsed.farmerProfiles || [],
            crops: parsed.crops || [],
            diseaseAnalyses: parsed.diseaseAnalyses || [],
            alerts: parsed.alerts || [],
            chatMessages: parsed.chatMessages || []
          };
        }
      } catch {
      }
    }
    return {
      users: [],
      farmerProfiles: [],
      crops: [],
      diseaseAnalyses: [],
      alerts: [],
      chatMessages: []
    };
  }
  save() {
    try {
      const dir = import_path2.default.dirname(this.dbPath);
      if (!import_fs2.default.existsSync(dir)) {
        import_fs2.default.mkdirSync(dir, { recursive: true });
      }
      const tempPath = `${this.dbPath}.tmp`;
      import_fs2.default.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), "utf-8");
      import_fs2.default.renameSync(tempPath, this.dbPath);
    } catch (err) {
      console.warn("[DB] Warning: could not persist database to disk:", err);
    }
  }
  // Users
  get users() {
    return {
      find: (predicate) => this.data.users.find(predicate),
      filter: (predicate) => this.data.users.filter(predicate),
      create: (user) => {
        this.data.users.push(user);
        this.save();
        return user;
      },
      update: (id, updates) => {
        const index = this.data.users.findIndex((u) => u.id === id);
        if (index !== -1) {
          this.data.users[index] = { ...this.data.users[index], ...updates, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
          this.save();
          return this.data.users[index];
        }
        return null;
      }
    };
  }
  // Farmer Profiles
  get profiles() {
    return {
      findByUserId: (userId) => this.data.farmerProfiles.find((p) => p.userId === userId),
      upsert: (profile) => {
        const index = this.data.farmerProfiles.findIndex((p) => p.userId === profile.userId);
        if (index !== -1) {
          this.data.farmerProfiles[index] = { ...this.data.farmerProfiles[index], ...profile, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
        } else {
          this.data.farmerProfiles.push({ ...profile, updatedAt: (/* @__PURE__ */ new Date()).toISOString() });
        }
        this.save();
        return profile;
      }
    };
  }
  // Crops
  get crops() {
    return {
      findByUserId: (userId) => this.data.crops.filter((c) => c.userId === userId),
      findById: (id) => this.data.crops.find((c) => c.id === id),
      create: (crop) => {
        this.data.crops.push(crop);
        this.save();
        return crop;
      },
      update: (id, updates) => {
        const index = this.data.crops.findIndex((c) => c.id === id);
        if (index !== -1) {
          this.data.crops[index] = { ...this.data.crops[index], ...updates };
          this.save();
          return this.data.crops[index];
        }
        return null;
      },
      delete: (id, userId) => {
        const index = this.data.crops.findIndex((c) => c.id === id && c.userId === userId);
        if (index !== -1) {
          this.data.crops.splice(index, 1);
          this.save();
          return true;
        }
        return false;
      }
    };
  }
  // Disease Analyses
  get diseaseAnalyses() {
    return {
      findByUserId: (userId) => {
        if (!userId) return this.data.diseaseAnalyses.slice(-20);
        return this.data.diseaseAnalyses.filter((d) => d.userId === userId || !d.userId).slice(-20);
      },
      findById: (id) => this.data.diseaseAnalyses.find((d) => d.id === id),
      create: (analysis) => {
        this.data.diseaseAnalyses.push(analysis);
        this.save();
        return analysis;
      }
    };
  }
  // Alerts
  get alerts() {
    return {
      findByUserId: (userId) => {
        return this.data.alerts.filter((a) => !a.userId || a.userId === userId);
      },
      create: (alert) => {
        this.data.alerts.unshift(alert);
        if (this.data.alerts.length > 50) this.data.alerts.pop();
        this.save();
        return alert;
      },
      markAsRead: (id) => {
        const item = this.data.alerts.find((a) => a.id === id);
        if (item) {
          item.read = true;
          this.save();
          return true;
        }
        return false;
      }
    };
  }
  // Chat
  get chat() {
    return {
      getMessages: (conversationId) => {
        return this.data.chatMessages.filter((m) => m.conversationId === conversationId);
      },
      addMessage: (msg) => {
        this.data.chatMessages.push(msg);
        this.save();
        return msg;
      }
    };
  }
};
var db = new Database();

// src/middleware/auth.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);
function generateToken(user) {
  return import_jsonwebtoken.default.sign(
    { id: user.id, emailOrPhone: user.emailOrPhone, preferredLanguage: user.preferredLanguage },
    config.jwtSecret,
    { expiresIn: "30d" }
  );
}
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ success: false, message: "Authentication required. Please login." });
    return;
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = import_jsonwebtoken.default.verify(token, config.jwtSecret);
    const user = db.users.find((u) => u.id === decoded.id);
    if (!user) {
      res.status(401).json({ success: false, message: "User not found or session expired." });
      return;
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: "Invalid or expired session. Please log in again." });
  }
}
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = import_jsonwebtoken.default.verify(token, config.jwtSecret);
      const user = db.users.find((u) => u.id === decoded.id);
      if (user) {
        req.user = user;
      }
    } catch {
    }
  }
  next();
}

// src/routes/auth.ts
var authRouter = (0, import_express.Router)();
authRouter.post("/register", async (req, res) => {
  try {
    const { name, emailOrPhone, password, preferredLanguage, state, district, village } = req.body;
    if (!name || !emailOrPhone || !password) {
      res.status(400).json({ success: false, message: "Please provide full name, email or phone, and password." });
      return;
    }
    const cleanContact = emailOrPhone.trim().toLowerCase();
    const existing = db.users.find((u) => u.emailOrPhone.toLowerCase() === cleanContact);
    if (existing) {
      res.status(409).json({ success: false, message: "An account with this email or phone already exists. Please login." });
      return;
    }
    const salt = await import_bcryptjs.default.genSalt(10);
    const passwordHash = await import_bcryptjs.default.hash(password, salt);
    const newUser = {
      id: (0, import_uuid.v4)(),
      name: name.trim(),
      emailOrPhone: cleanContact,
      passwordHash,
      preferredLanguage: ["en", "hi", "mr"].includes(preferredLanguage) ? preferredLanguage : "mr",
      state: state?.trim() || "Maharashtra",
      district: district?.trim() || "Pune",
      village: village?.trim() || "",
      onboardingCompleted: false,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.users.create(newUser);
    const token = generateToken(newUser);
    const { passwordHash: _, ...safeUser } = newUser;
    res.status(201).json({
      success: true,
      message: "Registration successful! Welcome to KrishiMitra.",
      token,
      user: safeUser
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ success: false, message: "Registration could not be completed right now. Please try again." });
  }
});
authRouter.post("/login", async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;
    if (!emailOrPhone || !password) {
      res.status(400).json({ success: false, message: "Please enter your email or phone number and password." });
      return;
    }
    const cleanContact = emailOrPhone.trim().toLowerCase();
    const user = db.users.find((u) => u.emailOrPhone.toLowerCase() === cleanContact);
    if (!user) {
      res.status(401).json({ success: false, message: "Invalid credentials. Please verify your phone/email and password." });
      return;
    }
    const isMatch = await import_bcryptjs.default.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, message: "Invalid credentials. Please verify your phone/email and password." });
      return;
    }
    const token = generateToken(user);
    const { passwordHash: _, ...safeUser } = user;
    res.json({
      success: true,
      message: "Login successful.",
      token,
      user: safeUser
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Unable to log in at this time. Please try again." });
  }
});
authRouter.get("/me", requireAuth, (req, res) => {
  if (!req.user) {
    res.status(401).json({ success: false, message: "Not authenticated." });
    return;
  }
  const { passwordHash: _, ...safeUser } = req.user;
  const profile = db.profiles.findByUserId(req.user.id) || null;
  res.json({ success: true, user: safeUser, profile });
});
authRouter.post("/onboarding", requireAuth, (req, res) => {
  try {
    const user = req.user;
    const { preferredLanguage, state, district, village, crops, farmSizeAcres, soilType, irrigationMethod } = req.body;
    const updatedUser = db.users.update(user.id, {
      preferredLanguage: preferredLanguage || user.preferredLanguage,
      state: state || user.state,
      district: district || user.district,
      village: village !== void 0 ? village : user.village,
      onboardingCompleted: true
    });
    if (farmSizeAcres || soilType || irrigationMethod) {
      db.profiles.upsert({
        userId: user.id,
        farmSizeAcres: farmSizeAcres ? parseFloat(farmSizeAcres) : void 0,
        soilType: soilType || "Medium Black Soil",
        irrigationMethod: irrigationMethod || "Drip Irrigation",
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
    if (Array.isArray(crops)) {
      crops.forEach((cropItem) => {
        if (cropItem && cropItem.name) {
          db.crops.create({
            id: (0, import_uuid.v4)(),
            userId: user.id,
            cropName: cropItem.name,
            variety: cropItem.variety || "",
            growthStage: cropItem.stage || "Vegetative",
            farmLocation: district || user.district,
            soilType: soilType || "Medium Black Soil",
            irrigationMethod: irrigationMethod || "Drip Irrigation",
            createdAt: (/* @__PURE__ */ new Date()).toISOString()
          });
        }
      });
    }
    const { passwordHash: _, ...safeUser } = updatedUser;
    res.json({ success: true, message: "Onboarding completed successfully!", user: safeUser });
  } catch (err) {
    console.error("Onboarding error:", err);
    res.status(500).json({ success: false, message: "Error saving onboarding choices." });
  }
});
authRouter.post("/forgot-password", (req, res) => {
  const { emailOrPhone } = req.body;
  if (!emailOrPhone) {
    res.status(400).json({ success: false, message: "Please provide registered email or phone." });
    return;
  }
  res.json({
    success: true,
    message: 'If your account is registered, a password reset link/OTP has been sent to your phone or email. For quick testing, you can use the reset password screen with token "KRISHI2026".',
    demoToken: "KRISHI2026"
  });
});
authRouter.post("/reset-password", async (req, res) => {
  try {
    const { emailOrPhone, resetToken, newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      res.status(400).json({ success: false, message: "New password must be at least 6 characters long." });
      return;
    }
    const user = db.users.find((u) => u.emailOrPhone.toLowerCase() === emailOrPhone?.trim()?.toLowerCase());
    if (!user) {
      res.status(404).json({ success: false, message: "User with this email or phone was not found." });
      return;
    }
    const salt = await import_bcryptjs.default.genSalt(10);
    const passwordHash = await import_bcryptjs.default.hash(newPassword, salt);
    db.users.update(user.id, { passwordHash });
    res.json({ success: true, message: "Password has been reset successfully. Please log in with your new password." });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ success: false, message: "Password reset could not be completed." });
  }
});

// src/routes/profile.ts
var import_express2 = require("express");
var profileRouter = (0, import_express2.Router)();
profileRouter.get("/", requireAuth, (req, res) => {
  const user = req.user;
  const { passwordHash: _, ...safeUser } = user;
  const profile = db.profiles.findByUserId(user.id) || {
    userId: user.id,
    farmSizeAcres: 2.5,
    soilType: "Medium Black Soil",
    irrigationMethod: "Drip Irrigation",
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  res.json({
    success: true,
    user: safeUser,
    profile
  });
});
profileRouter.put("/", requireAuth, (req, res) => {
  try {
    const user = req.user;
    const { name, preferredLanguage, state, district, village, farmSizeAcres, soilType, irrigationMethod } = req.body;
    const userUpdates = {};
    if (name) userUpdates.name = name.trim();
    if (preferredLanguage) userUpdates.preferredLanguage = preferredLanguage;
    if (state) userUpdates.state = state.trim();
    if (district) userUpdates.district = district.trim();
    if (village !== void 0) userUpdates.village = village.trim();
    const updatedUser = db.users.update(user.id, userUpdates);
    const profileUpdates = {
      userId: user.id,
      farmSizeAcres: farmSizeAcres !== void 0 ? Number(farmSizeAcres) : void 0,
      soilType: soilType || "Medium Black Soil",
      irrigationMethod: irrigationMethod || "Drip Irrigation",
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const updatedProfile = db.profiles.upsert(profileUpdates);
    const { passwordHash: _, ...safeUser } = updatedUser;
    res.json({
      success: true,
      message: "Profile updated successfully.",
      user: safeUser,
      profile: updatedProfile
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ success: false, message: "Could not update profile." });
  }
});
profileRouter.post("/language", requireAuth, (req, res) => {
  const { language } = req.body;
  if (!["en", "hi", "mr"].includes(language)) {
    res.status(400).json({ success: false, message: "Supported languages are: en, hi, mr" });
    return;
  }
  db.users.update(req.user.id, { preferredLanguage: language });
  res.json({ success: true, message: "Language preference saved.", language });
});

// src/routes/crops.ts
var import_express3 = require("express");
var import_uuid2 = require("uuid");

// src/services/agriculture/knowledgeBase.ts
var CROP_PROFILES = {
  tomato: {
    id: "tomato",
    name: { en: "Tomato", hi: "\u091F\u092E\u093E\u091F\u0930", mr: "\u091F\u094B\u092E\u0945\u091F\u094B" },
    seasons: ["Kharif", "Rabi", "Zaid"],
    stages: [
      { en: "Seedling (0-25 days)", hi: "\u0905\u0902\u0915\u0941\u0930\u0923 (0-25 \u0926\u093F\u0928)", mr: "\u0930\u094B\u092A\u0935\u093E\u091F\u093F\u0915\u093E (\u0966-\u0968\u096B \u0926\u093F\u0935\u0938)" },
      { en: "Vegetative (25-45 days)", hi: "\u0935\u093E\u0928\u0938\u094D\u092A\u0924\u093F\u0915 \u0935\u093F\u0915\u093E\u0938 (25-45 \u0926\u093F\u0928)", mr: "\u0936\u093E\u0915\u0940\u092F \u0935\u093E\u0922 (\u0968\u096B-\u096A\u096B \u0926\u093F\u0935\u0938)" },
      { en: "Flowering & Fruit Set (45-70 days)", hi: "\u092B\u0942\u0932 \u0935 \u092B\u0932\u0927\u093E\u0930\u0923 (45-70 \u0926\u093F\u0928)", mr: "\u092B\u0941\u0932\u094B\u0930\u093E \u0935 \u092B\u0933\u0927\u093E\u0930\u0923\u093E (\u096A\u096B-\u096D\u0966 \u0926\u093F\u0935\u0938)" },
      { en: "Harvesting (70-120 days)", hi: "\u0924\u0941\u0921\u093C\u093E\u0908 (70-120 \u0926\u093F\u0928)", mr: "\u0924\u094B\u0921\u0923\u0940 (\u096D\u0966-\u0967\u0968\u0966 \u0926\u093F\u0935\u0938)" }
    ],
    soilTypes: ["Sandy Loam", "Clay Loam", "Black Soil"],
    waterNeeds: "Moderate to high, requires consistent soil moisture without waterlogging.",
    commonDiseases: ["early_blight", "late_blight", "leaf_curl", "bacterial_wilt"]
  },
  cotton: {
    id: "cotton",
    name: { en: "Cotton", hi: "\u0915\u092A\u093E\u0938", mr: "\u0915\u093E\u092A\u0942\u0938" },
    seasons: ["Kharif"],
    stages: [
      { en: "Germination & Seedling (0-30 days)", hi: "\u0905\u0902\u0915\u0941\u0930\u0923 \u0935 \u092A\u094D\u0930\u093E\u0930\u0902\u092D\u093F\u0915 \u0905\u0935\u0938\u094D\u0925\u093E (0-30 \u0926\u093F\u0928)", mr: "\u0909\u0917\u0935\u0923 \u0935 \u0930\u094B\u092A\u093E\u0935\u0938\u094D\u0925\u093E (\u0966-\u0969\u0966 \u0926\u093F\u0935\u0938)" },
      { en: "Square Formation & Flowering (30-70 days)", hi: "\u0915\u0932\u0940 \u0935 \u092B\u0942\u0932 \u0906\u0928\u093E (30-70 \u0926\u093F\u0928)", mr: "\u092A\u093E\u0924\u094D\u092F\u093E \u0935 \u092B\u0941\u0932\u0947 \u092F\u0947\u0923\u0947 (\u0969\u0966-\u096D\u0966 \u0926\u093F\u0935\u0938)" },
      { en: "Boll Development (70-120 days)", hi: "\u091F\u093F\u0902\u0921\u0947 \u092C\u0928\u0928\u093E (70-120 \u0926\u093F\u0928)", mr: "\u092C\u094B\u0902\u0921 \u092D\u0930\u0923\u0947 (\u096D\u0966-\u0967\u0968\u0966 \u0926\u093F\u0935\u0938)" },
      { en: "Boll Bursting & Picking (120-160 days)", hi: "\u0915\u092A\u093E\u0938 \u091A\u0941\u0928\u093E\u0908 (120-160 \u0926\u093F\u0928)", mr: "\u092C\u094B\u0902\u0921 \u092B\u0941\u091F\u0923\u0947 \u0935 \u0935\u0947\u091A\u0923\u0940 (\u0967\u0968\u0966-\u0967\u096C\u0966 \u0926\u093F\u0935\u0938)" }
    ],
    soilTypes: ["Deep Black Soil", "Alluvial Soil"],
    waterNeeds: "Critical during square formation and boll development; avoid water stagnation.",
    commonDiseases: ["pink_bollworm", "bacterial_blight", "grey_mildew", "leaf_curl"]
  },
  chilli: {
    id: "chilli",
    name: { en: "Chilli", hi: "\u092E\u093F\u0930\u094D\u091A", mr: "\u092E\u093F\u0930\u091A\u0940" },
    seasons: ["Kharif", "Rabi"],
    stages: [
      { en: "Transplanting & Establishment (0-20 days)", hi: "\u0930\u094B\u092A\u0923 \u0935 \u091C\u0921\u093C \u092A\u0915\u0921\u093C\u0928\u093E (0-20 \u0926\u093F\u0928)", mr: "\u092A\u0941\u0928\u0930\u094D\u0932\u093E\u0917\u0935\u0921 (\u0966-\u0968\u0966 \u0926\u093F\u0935\u0938)" },
      { en: "Vegetative Growth (20-45 days)", hi: "\u0935\u093E\u0928\u0938\u094D\u092A\u0924\u093F\u0915 \u0935\u093F\u0915\u093E\u0938 (20-45 \u0926\u093F\u0928)", mr: "\u0936\u093E\u0915\u0940\u092F \u0935\u093E\u0922 (\u0968\u0966-\u096A\u096B \u0926\u093F\u0935\u0938)" },
      { en: "Flowering & Fruit Initiation (45-75 days)", hi: "\u092B\u0942\u0932 \u0935 \u092E\u093F\u0930\u094D\u091A \u0932\u0917\u0928\u093E (45-75 \u0926\u093F\u0928)", mr: "\u092B\u0941\u0932\u094B\u0930\u093E \u0935 \u092B\u0933\u0927\u093E\u0930\u0923\u093E (\u096A\u096B-\u096D\u096B \u0926\u093F\u0935\u0938)" },
      { en: "Fruit Maturity & Plucking (75-150 days)", hi: "\u092E\u093F\u0930\u094D\u091A \u0924\u0941\u0921\u093C\u093E\u0908 (75-150 \u0926\u093F\u0928)", mr: "\u0924\u094B\u0921\u0923\u0940 (\u096D\u096B-\u0967\u096B\u0966 \u0926\u093F\u0935\u0938)" }
    ],
    soilTypes: ["Well-drained Loam", "Black Cotton Soil"],
    waterNeeds: "Sensitive to both drought and waterlogging; drip irrigation highly recommended.",
    commonDiseases: ["chilli_leaf_curl", "anthracnose", "powdery_mildew", "thrips_mite"]
  },
  soybean: {
    id: "soybean",
    name: { en: "Soybean", hi: "\u0938\u094B\u092F\u093E\u092C\u0940\u0928", mr: "\u0938\u094B\u092F\u093E\u092C\u0940\u0928" },
    seasons: ["Kharif"],
    stages: [
      { en: "Emergence (0-15 days)", hi: "\u0905\u0902\u0915\u0941\u0930\u0923 (0-15 \u0926\u093F\u0928)", mr: "\u0909\u0917\u0935\u0923 (\u0966-\u0967\u096B \u0926\u093F\u0935\u0938)" },
      { en: "Vegetative (15-35 days)", hi: "\u0935\u093E\u0928\u0938\u094D\u092A\u0924\u093F\u0915 \u0905\u0935\u0938\u094D\u0925\u093E (15-35 \u0926\u093F\u0928)", mr: "\u0936\u093E\u0915\u0940\u092F \u0935\u093E\u0922 (\u0967\u096B-\u0969\u096B \u0926\u093F\u0935\u0938)" },
      { en: "Flowering & Pod Filling (35-75 days)", hi: "\u092B\u0942\u0932 \u0935 \u092B\u0932\u0940 \u092D\u0930\u0928\u093E (35-75 \u0926\u093F\u0928)", mr: "\u092B\u0941\u0932\u094B\u0930\u093E \u0935 \u0936\u0947\u0902\u0917\u093E \u092D\u0930\u0923\u0947 (\u0969\u096B-\u096D\u096B \u0926\u093F\u0935\u0938)" },
      { en: "Maturity (75-100 days)", hi: "\u092A\u0930\u093F\u092A\u0915\u094D\u0935\u0924\u093E (75-100 \u0926\u093F\u0928)", mr: "\u092A\u0915\u094D\u0935\u0924\u093E (\u096D\u096B-\u0967\u0966\u0966 \u0926\u093F\u0935\u0938)" }
    ],
    soilTypes: ["Black Soil", "Clay Loam"],
    waterNeeds: "Critical at flowering and pod development; vulnerable to moisture stress.",
    commonDiseases: ["soybean_rust", "yellow_mosaic", "charcoal_rot"]
  },
  onion: {
    id: "onion",
    name: { en: "Onion", hi: "\u092A\u094D\u092F\u093E\u091C", mr: "\u0915\u093E\u0902\u0926\u093E" },
    seasons: ["Kharif", "Late Kharif", "Rabi"],
    stages: [
      { en: "Nursery & Transplanting (0-30 days)", hi: "\u0928\u0930\u094D\u0938\u0930\u0940 \u0935 \u0930\u094B\u092A\u093E\u0908 (0-30 \u0926\u093F\u0928)", mr: "\u0930\u094B\u092A\u0935\u093E\u091F\u093F\u0915\u093E \u0935 \u092A\u0941\u0928\u0930\u094D\u0932\u093E\u0917\u0935\u0921 (\u0966-\u0969\u0966 \u0926\u093F\u0935\u0938)" },
      { en: "Vegetative Growth (30-60 days)", hi: "\u0935\u093E\u0928\u0938\u094D\u092A\u0924\u093F\u0915 \u0935\u093F\u0915\u093E\u0938 (30-60 \u0926\u093F\u0928)", mr: "\u092A\u093E\u0924\u0940\u091A\u0940 \u0935\u093E\u0922 (\u0969\u0966-\u096C\u0966 \u0926\u093F\u0935\u0938)" },
      { en: "Bulb Development (60-95 days)", hi: "\u0915\u0902\u0926 \u092C\u0928\u0928\u093E (60-95 \u0926\u093F\u0928)", mr: "\u0915\u093E\u0902\u0926\u093E \u092A\u094B\u0938\u0923\u0947 (\u096C\u0966-\u096F\u096B \u0926\u093F\u0935\u0938)" },
      { en: "Maturity & Harvest (95-120 days)", hi: "\u0915\u091F\u093E\u0908 \u092A\u0942\u0930\u094D\u0935 \u092A\u0930\u093F\u092A\u0915\u094D\u0935\u0924\u093E (95-120 \u0926\u093F\u0928)", mr: "\u0915\u093E\u0922\u0923\u0940 \u092A\u0942\u0930\u094D\u0935 \u0905\u0935\u0938\u094D\u0925\u093E (\u096F\u096B-\u0967\u0968\u0966 \u0926\u093F\u0935\u0938)" }
    ],
    soilTypes: ["Sandy Loam", "Clay Loam"],
    waterNeeds: "Regular light watering; stop irrigation 10-15 days before harvest.",
    commonDiseases: ["purple_blotch", "stemphylium_blight", "downy_mildew", "thrips"]
  },
  wheat: {
    id: "wheat",
    name: { en: "Wheat", hi: "\u0917\u0947\u0939\u0942\u0902", mr: "\u0917\u0939\u0942" },
    seasons: ["Rabi"],
    stages: [
      { en: "Crown Root Initiation (20-25 days)", hi: "\u0938\u0940\u0906\u0930\u0906\u0908 \u0905\u0935\u0938\u094D\u0925\u093E (20-25 \u0926\u093F\u0928)", mr: "\u092E\u0941\u0915\u0941\u091F \u092E\u0941\u0933\u0947 \u092B\u0941\u091F\u0923\u0947 (\u0968\u0966-\u0968\u096B \u0926\u093F\u0935\u0938)" },
      { en: "Tillering (40-45 days)", hi: "\u0915\u0932\u094D\u0932\u0947 \u092B\u0942\u091F\u0928\u093E (40-45 \u0926\u093F\u0928)", mr: "\u092B\u0941\u091F\u0935\u0947 \u092B\u0941\u091F\u0923\u0947 (\u096A\u0966-\u096A\u096B \u0926\u093F\u0935\u0938)" },
      { en: "Booting & Heading (65-70 days)", hi: "\u0917\u093E\u092D\u093E \u0935 \u092C\u093E\u0932\u0940 \u0928\u093F\u0915\u0932\u0928\u093E (65-70 \u0926\u093F\u0928)", mr: "\u092A\u094B\u091F\u0930\u0940 \u0935 \u0932\u094B\u0902\u092C\u094D\u092F\u093E \u092C\u093E\u0939\u0947\u0930 \u092A\u0921\u0923\u0947 (\u096C\u096B-\u096D\u0966 \u0926\u093F\u0935\u0938)" },
      { en: "Grain Filling (85-90 days)", hi: "\u0926\u0942\u0927\u093F\u092F\u093E \u0935 \u0926\u093E\u0928\u093E \u092D\u0930\u0928\u093E (85-90 \u0926\u093F\u0928)", mr: "\u0926\u093E\u0923\u0947 \u092D\u0930\u0923\u0947 (\u096E\u096B-\u096F\u0966 \u0926\u093F\u0935\u0938)" }
    ],
    soilTypes: ["Clay Loam", "Alluvial Soil"],
    waterNeeds: "Critical irrigation at CRI (21 days), tillering, flowering, and grain-filling.",
    commonDiseases: ["yellow_rust", "brown_rust", "powdery_mildew", "loose_smut"]
  }
};
var DISEASE_DATABASE = {
  early_blight: {
    id: "early_blight",
    name: {
      en: "Early Blight (Alternaria solani)",
      hi: "\u0905\u0917\u0947\u0924\u0940 \u091D\u0941\u0932\u0938\u093E (\u0905\u0930\u094D\u0932\u0940 \u092C\u094D\u0932\u093E\u0907\u091F)",
      mr: "\u0915\u0930\u092A\u093E / \u0905\u0930\u094D\u0932\u0940 \u092C\u094D\u0932\u093E\u0907\u091F"
    },
    crop: { en: "Tomato / Potato", hi: "\u091F\u092E\u093E\u091F\u0930 / \u0906\u0932\u0942", mr: "\u091F\u094B\u092E\u0945\u091F\u094B / \u092C\u091F\u093E\u091F\u093E" },
    symptoms: {
      en: [
        "Concentric dark brown to black rings (target-board appearance) on older lower leaves",
        "Yellow halo surrounding necrotic spots",
        "Premature defoliation starting from the base of the plant",
        "Sunken dark lesions on stems near soil line"
      ],
      hi: [
        "\u0928\u093F\u091A\u0932\u0940 \u092A\u0924\u094D\u0924\u093F\u092F\u094B\u0902 \u092A\u0930 \u0917\u094B\u0932 \u091B\u0932\u094D\u0932\u0947\u0926\u093E\u0930 \u0917\u0939\u0930\u0947 \u092D\u0942\u0930\u0947 \u092F\u093E \u0915\u093E\u0932\u0947 \u0927\u092C\u094D\u092C\u0947 (\u091F\u093E\u0930\u0917\u0947\u091F \u092C\u094B\u0930\u094D\u0921 \u091C\u0948\u0938\u0947)",
        "\u0927\u092C\u094D\u092C\u094B\u0902 \u0915\u0947 \u091A\u093E\u0930\u094B\u0902 \u0913\u0930 \u092A\u0940\u0932\u093E \u0918\u0947\u0930\u093E",
        "\u092A\u094C\u0927\u0947 \u0915\u0947 \u0928\u093F\u091A\u0932\u0947 \u0939\u093F\u0938\u094D\u0938\u0947 \u0938\u0947 \u092A\u0924\u094D\u0924\u093F\u092F\u094B\u0902 \u0915\u093E \u0938\u0942\u0916\u0915\u0930 \u0917\u093F\u0930\u0928\u093E",
        "\u0924\u0928\u0947 \u092A\u0930 \u0917\u0939\u0930\u0947 \u0927\u092C\u094D\u092C\u0947"
      ],
      mr: [
        "\u0916\u093E\u0932\u091A\u094D\u092F\u093E \u091C\u0941\u0928\u094D\u092F\u093E \u092A\u093E\u0928\u093E\u0902\u0935\u0930 \u0915\u093E\u0933\u0947-\u0924\u092A\u0915\u093F\u0930\u0940 \u0917\u094B\u0932\u093E\u0915\u093E\u0930 \u091A\u0915\u094D\u0930\u093E\u0915\u093E\u0930 \u0921\u093E\u0917 (\u091F\u093E\u0930\u094D\u0917\u0947\u091F \u092C\u094B\u0930\u094D\u0921\u0938\u093E\u0930\u0916\u0947)",
        "\u0921\u093E\u0917\u093E\u0902\u092D\u094B\u0935\u0924\u0940 \u092A\u093F\u0935\u0933\u0938\u0930 \u0915\u0921\u093E",
        "\u091D\u093E\u0921\u093E\u091A\u0940 \u0916\u093E\u0932\u091A\u0940 \u092A\u093E\u0928\u0947 \u092A\u093F\u0935\u0933\u0940 \u092A\u0921\u0942\u0928 \u0917\u0933\u0923\u0947",
        "\u0916\u094B\u0921\u093E\u0935\u0930 \u0915\u093E\u0933\u092A\u091F \u091A\u091F\u094D\u091F\u0947 \u092A\u0921\u0923\u0947"
      ]
    },
    organicSolutions: {
      en: [
        "Prune and safely dispose of affected lower leaves to improve air circulation",
        "Spray certified Neem oil (3-5 ml per liter of water) mixed with mild soap",
        "Apply fermented buttermilk spray (5% sour butter milk in water) in early morning",
        "Avoid overhead sprinkler irrigation; keep foliage dry by using drip irrigation",
        "Apply Jeevamrut or Dashparni Ark every 12-14 days to boost soil and plant immunity"
      ],
      hi: [
        "\u092A\u094D\u0930\u092D\u093E\u0935\u093F\u0924 \u0928\u093F\u091A\u0932\u0940 \u092A\u0924\u094D\u0924\u093F\u092F\u094B\u0902 \u0915\u094B \u0924\u094B\u0921\u093C\u0915\u0930 \u0916\u0947\u0924 \u0938\u0947 \u0926\u0942\u0930 \u0928\u0937\u094D\u091F \u0915\u0930\u0947\u0902 \u0924\u093E\u0915\u093F \u0939\u0935\u093E \u0915\u093E \u0938\u0902\u091A\u093E\u0930 \u092C\u0922\u093C\u0947",
        "\u092A\u094D\u0930\u092E\u093E\u0923\u093F\u0924 \u0928\u0940\u092E \u0915\u093E \u0924\u0947\u0932 (3-5 \u092E\u093F\u0932\u0940 \u092A\u094D\u0930\u0924\u093F \u0932\u0940\u091F\u0930 \u092A\u093E\u0928\u0940) \u0939\u0932\u094D\u0915\u0947 \u0938\u093E\u092C\u0941\u0928 \u0915\u0947 \u0938\u093E\u0925 \u092E\u093F\u0932\u093E\u0915\u0930 \u091B\u093F\u0921\u093C\u0915\u0947\u0902",
        "5% \u0916\u091F\u094D\u091F\u0940 \u091B\u093E\u091B \u0915\u093E \u092A\u093E\u0928\u0940 \u092E\u0947\u0902 \u0918\u094B\u0932 \u092C\u0928\u093E\u0915\u0930 \u0938\u0941\u092C\u0939 \u0915\u0947 \u0938\u092E\u092F \u091B\u093F\u0921\u093C\u0915\u093E\u0935 \u0915\u0930\u0947\u0902",
        "\u092B\u0935\u094D\u0935\u093E\u0930\u093E \u0938\u093F\u0902\u091A\u093E\u0908 \u0938\u0947 \u092C\u091A\u0947\u0902; \u0921\u094D\u0930\u093F\u092A \u0938\u093F\u0902\u091A\u093E\u0908 \u0938\u0947 \u092A\u093E\u0928\u0940 \u0926\u0947\u0902 \u0924\u093E\u0915\u093F \u092A\u0924\u094D\u0924\u093F\u092F\u093E\u0902 \u0938\u0942\u0916\u0940 \u0930\u0939\u0947\u0902",
        "\u092A\u094C\u0927\u094B\u0902 \u0915\u0940 \u0930\u094B\u0917 \u092A\u094D\u0930\u0924\u093F\u0930\u094B\u0927\u0915 \u0915\u094D\u0937\u092E\u0924\u093E \u092C\u0922\u093C\u093E\u0928\u0947 \u0939\u0947\u0924\u0941 \u091C\u0940\u0935\u093E\u092E\u0943\u0924 \u092F\u093E \u0926\u0936\u092A\u0930\u094D\u0923\u0940 \u0905\u0930\u094D\u0915 \u0915\u093E \u091B\u093F\u0921\u093C\u0915\u093E\u0935 \u0915\u0930\u0947\u0902"
      ],
      mr: [
        "\u0930\u094B\u0917\u091F \u091D\u093E\u0932\u0947\u0932\u0940 \u0916\u093E\u0932\u091A\u0940 \u092A\u093E\u0928\u0947 \u0916\u0941\u0921\u0942\u0928 \u0936\u0947\u0924\u093E\u092C\u093E\u0939\u0947\u0930 \u0928\u0937\u094D\u091F \u0915\u0930\u093E, \u091C\u094D\u092F\u093E\u092E\u0941\u0933\u0947 \u0939\u0935\u093E \u0916\u0947\u0933\u0924\u0940 \u0930\u093E\u0939\u0940\u0932",
        "\u092A\u094D\u0930\u092E\u093E\u0923\u093F\u0924 \u0915\u0921\u0941\u0928\u093F\u0902\u092C \u0924\u0947\u0932 (\u0969-\u096B \u092E\u093F\u0932\u0940 \u092A\u094D\u0930\u0924\u093F \u0932\u093F\u091F\u0930 \u092A\u093E\u0923\u0940) \u0938\u094C\u092E\u094D\u092F \u0938\u093E\u092C\u0923\u093E\u0938\u0939 \u092B\u0935\u093E\u0930\u093E",
        "\u096B% \u0906\u0902\u092C\u091F \u0924\u093E\u0915\u093E\u091A\u0947 \u0926\u094D\u0930\u093E\u0935\u0923 \u0938\u0915\u093E\u0933\u0940 \u092A\u093E\u0928\u093E\u0902\u0935\u0930 \u092B\u0935\u093E\u0930\u093E",
        "\u092A\u093E\u0928\u093E\u0902\u0935\u0930 \u092A\u093E\u0923\u0940 \u092A\u0921\u0942 \u0926\u0947\u090A \u0928\u0915\u093E; \u0920\u093F\u092C\u0915 \u0938\u093F\u0902\u091A\u0928\u093E\u091A\u093E \u0935\u093E\u092A\u0930 \u0915\u0930\u093E \u091C\u0947\u0923\u0947\u0915\u0930\u0942\u0928 \u0913\u0932\u093E\u0935\u093E \u0938\u093E\u091A\u0923\u093E\u0930 \u0928\u093E\u0939\u0940",
        "\u0926\u0930 \u0967\u0968-\u0967\u096A \u0926\u093F\u0935\u0938\u093E\u0902\u0928\u0940 \u091C\u093F\u0935\u093E\u092E\u0943\u0924 \u0915\u093F\u0902\u0935\u093E \u0926\u0936\u092A\u0930\u094D\u0923\u0940 \u0905\u0930\u094D\u0915\u093E\u091A\u093E \u092B\u0935\u093E\u0930\u093E \u0926\u0947\u090A\u0928 \u0930\u094B\u0917\u092A\u094D\u0930\u0924\u093F\u0915\u093E\u0930\u0936\u0915\u094D\u0924\u0940 \u0935\u093E\u0922\u0935\u093E"
      ]
    },
    biologicalSolutions: {
      en: [
        "Foliar spray of Trichoderma harzianum or Trichoderma viride (5g/liter of water)",
        "Pseudomonas fluorescens (10g/liter) applied to soil and foliage"
      ],
      hi: [
        "\u091F\u094D\u0930\u093E\u0907\u0915\u094B\u0921\u0930\u094D\u092E\u093E \u0935\u093F\u0930\u093F\u0921\u0940 \u092F\u093E \u091F\u094D\u0930\u093E\u0907\u0915\u094B\u0921\u0930\u094D\u092E\u093E \u0939\u0930\u094D\u091C\u093F\u090F\u0928\u092E (5 \u0917\u094D\u0930\u093E\u092E \u092A\u094D\u0930\u0924\u093F \u0932\u0940\u091F\u0930) \u0915\u093E \u092A\u0924\u094D\u0924\u093F\u092F\u094B\u0902 \u092A\u0930 \u091B\u093F\u0921\u093C\u0915\u093E\u0935",
        "\u0938\u094D\u092F\u0942\u0921\u094B\u092E\u094B\u0928\u093E\u0938 \u092B\u094D\u0932\u094B\u0930\u094B\u0938\u0947\u0902\u0938 (10 \u0917\u094D\u0930\u093E\u092E \u092A\u094D\u0930\u0924\u093F \u0932\u0940\u091F\u0930) \u0915\u093E \u092E\u093F\u091F\u094D\u091F\u0940 \u0935 \u092A\u0924\u094D\u0924\u093F\u092F\u094B\u0902 \u092A\u0930 \u0909\u092A\u092F\u094B\u0917"
      ],
      mr: [
        "\u091F\u094D\u0930\u093E\u092F\u0915\u094B\u0921\u0930\u094D\u092E\u093E \u0935\u094D\u0939\u093F\u0930\u0940\u0921\u0940 \u0915\u093F\u0902\u0935\u093E \u091F\u094D\u0930\u093E\u092F\u0915\u094B\u0921\u0930\u094D\u092E\u093E \u0939\u0930\u091D\u093F\u092F\u093E\u0928\u092E (\u096B \u0917\u094D\u0930\u0945\u092E \u092A\u094D\u0930\u0924\u093F \u0932\u093F\u091F\u0930 \u092A\u093E\u0923\u0940) \u092A\u093E\u0928\u093E\u0902\u0935\u0930 \u092B\u0935\u093E\u0930\u093E",
        "\u0938\u0941\u0921\u094B\u092E\u094B\u0928\u093E\u0938 \u092B\u094D\u0932\u094B\u0930\u094B\u0938\u0928\u094D\u0938 (\u0967\u0966 \u0917\u094D\u0930\u0945\u092E \u092A\u094D\u0930\u0924\u093F \u0932\u093F\u091F\u0930) \u091C\u092E\u093F\u0928\u0940\u0924\u0942\u0928 \u0935 \u092A\u093E\u0928\u093E\u0902\u0935\u0930 \u0926\u094D\u092F\u093E\u0935\u0947"
      ]
    },
    verifiedTreatments: {
      en: [
        "If infection crosses economic threshold, consult your local Krishi Vigyan Kendra (KVK) officer",
        "Registered contact protectants like Copper Oxychloride or Mancozeb as per verified university package of practices",
        "Always wear protective gloves, mask, and follow statutory waiting period (PHI) mentioned on label"
      ],
      hi: [
        "\u092F\u0926\u093F \u092A\u094D\u0930\u0915\u094B\u092A \u0905\u0927\u093F\u0915 \u0939\u094B, \u0924\u094B \u0928\u091C\u0926\u0940\u0915\u0940 \u0915\u0943\u0937\u093F \u0935\u093F\u091C\u094D\u091E\u093E\u0928 \u0915\u0947\u0902\u0926\u094D\u0930 (KVK) \u0935\u093F\u0936\u0947\u0937\u091C\u094D\u091E \u0938\u0947 \u0938\u0932\u093E\u0939 \u0932\u0947\u0902",
        "\u0915\u0943\u0937\u093F \u0935\u093F\u0936\u094D\u0935\u0935\u093F\u0926\u094D\u092F\u093E\u0932\u092F \u0926\u094D\u0935\u093E\u0930\u093E \u0905\u0928\u0941\u0936\u0902\u0938\u093F\u0924 \u0915\u0949\u092A\u0930 \u0911\u0915\u094D\u0938\u0940\u0915\u094D\u0932\u094B\u0930\u093E\u0907\u0921 \u092F\u093E \u092E\u0948\u0902\u0915\u094B\u091C\u093C\u0947\u092C \u0915\u093E \u0932\u0947\u092C\u0932 \u0928\u093F\u0930\u094D\u0926\u0947\u0936\u093E\u0928\u0941\u0938\u093E\u0930 \u0938\u0940\u092E\u093F\u0924 \u0909\u092A\u092F\u094B\u0917 \u0915\u0930\u0947\u0902",
        "\u0926\u0935\u093E \u091B\u093F\u0921\u093C\u0915\u0924\u0947 \u0938\u092E\u092F \u092E\u093E\u0938\u094D\u0915, \u0926\u0938\u094D\u0924\u093E\u0928\u0947 \u092A\u0939\u0928\u0947\u0902 \u0914\u0930 \u0932\u0947\u092C\u0932 \u092A\u0930 \u0926\u0940 \u0917\u0908 \u0924\u0941\u0921\u093C\u093E\u0908 \u092A\u0942\u0930\u094D\u0935 \u092A\u094D\u0930\u0924\u0940\u0915\u094D\u0937\u093E \u0905\u0935\u0927\u093F (PHI) \u0915\u093E \u0905\u0928\u093F\u0935\u093E\u0930\u094D\u092F \u092A\u093E\u0932\u0928 \u0915\u0930\u0947\u0902"
      ],
      mr: [
        "\u092A\u094D\u0930\u093E\u0926\u0941\u0930\u094D\u092D\u093E\u0935 \u0906\u0930\u094D\u0925\u093F\u0915 \u0928\u0941\u0915\u0938\u093E\u0928 \u092A\u093E\u0924\u0933\u0940 \u0913\u0932\u093E\u0902\u0921\u0932\u094D\u092F\u093E\u0938 \u091C\u0935\u0933\u091A\u094D\u092F\u093E \u0915\u0943\u0937\u0940 \u0935\u093F\u091C\u094D\u091E\u093E\u0928 \u0915\u0947\u0902\u0926\u094D\u0930\u093E\u0924\u0940\u0932 (KVK) \u0924\u091C\u094D\u091C\u094D\u091E\u093E\u0902\u091A\u093E \u0938\u0932\u094D\u0932\u093E \u0918\u094D\u092F\u093E",
        "\u0915\u0943\u0937\u0940 \u0935\u093F\u0926\u094D\u092F\u093E\u092A\u0940\u0920\u093E\u0928\u0947 \u0936\u093F\u092B\u093E\u0930\u0938 \u0915\u0947\u0932\u0947\u0932\u0947 \u0915\u0949\u092A\u0930 \u0911\u0915\u094D\u0938\u093F\u0915\u094D\u0932\u094B\u0930\u093E\u0908\u0921 \u0915\u093F\u0902\u0935\u093E \u092E\u0901\u0915\u094B\u091D\u0947\u092C \u0932\u0947\u092C\u0932 \u0928\u093F\u0930\u094D\u0926\u0947\u0936\u093E\u0902\u0928\u0941\u0938\u093E\u0930 \u0935\u093E\u092A\u0930\u093E",
        "\u0914\u0937\u0927 \u092B\u0935\u093E\u0930\u0924\u093E\u0928\u093E \u092E\u093E\u0938\u094D\u0915, \u0939\u093E\u0924\u092E\u094B\u091C\u0947 \u0935\u093E\u092A\u0930\u093E \u0906\u0923\u093F \u0932\u0947\u092C\u0932\u0935\u0930 \u0926\u093F\u0932\u0947\u0932\u093E \u0915\u093E\u0922\u0923\u0940\u092A\u0942\u0930\u094D\u0935 \u092A\u094D\u0930\u0924\u0940\u0915\u094D\u0937\u093E \u0915\u093E\u0932\u093E\u0935\u0927\u0940 (PHI) \u092A\u093E\u0933\u093E"
      ]
    },
    prevention: {
      en: [
        "Follow 3-year crop rotation avoiding Solanaceous crops (tomato, potato, eggplant)",
        "Ensure wide plant spacing (60 x 45 cm) for excellent airflow",
        "Apply organic mulch to prevent rain splashing soil microbes onto lower leaves",
        "Use certified disease-resistant hybrid seed varieties"
      ],
      hi: [
        "\u091F\u092E\u093E\u091F\u0930 \u0915\u0947 \u092C\u093E\u0926 \u0938\u094B\u0932\u0947\u0928\u0947\u0938\u0940 \u0915\u0941\u0932 (\u0906\u0932\u0942, \u092C\u0948\u0902\u0917\u0928) \u0915\u0940 \u092B\u0938\u0932 \u0928 \u0932\u0917\u093E\u090F\u0902; 3 \u0935\u0930\u094D\u0937\u0940\u092F \u092B\u0938\u0932 \u091A\u0915\u094D\u0930 \u0905\u092A\u0928\u093E\u090F\u0902",
        "\u092A\u094C\u0927\u094B\u0902 \u0915\u0947 \u092C\u0940\u091A \u0909\u091A\u093F\u0924 \u0926\u0942\u0930\u0940 (60 x 45 \u0938\u0947\u092E\u0940) \u0930\u0916\u0947\u0902 \u0924\u093E\u0915\u093F \u092A\u0930\u094D\u092F\u093E\u092A\u094D\u0924 \u0927\u0942\u092A \u0914\u0930 \u0939\u0935\u093E \u092E\u093F\u0932\u0947",
        "\u092E\u093F\u091F\u094D\u091F\u0940 \u0938\u0947 \u092B\u092B\u0942\u0902\u0926 \u0915\u0947 \u091B\u0940\u0902\u091F\u0947 \u0930\u094B\u0915\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u091C\u0948\u0935\u093F\u0915 \u092E\u0932\u094D\u091A\u093F\u0902\u0917 \u0915\u0930\u0947\u0902",
        "\u0930\u094B\u0917 \u092A\u094D\u0930\u0924\u093F\u0930\u094B\u0927\u0940 \u092A\u094D\u0930\u092E\u093E\u0923\u093F\u0924 \u092C\u0940\u091C\u094B\u0902 \u0915\u093E \u0939\u0940 \u091A\u092F\u0928 \u0915\u0930\u0947\u0902"
      ],
      mr: [
        "\u091F\u094B\u092E\u0945\u091F\u094B\u0928\u0902\u0924\u0930 \u0935\u093E\u0902\u0917\u0940 \u0915\u093F\u0902\u0935\u093E \u092C\u091F\u093E\u091F\u093E \u0932\u093E\u0935\u0942 \u0928\u0915\u093E; \u092F\u094B\u0917\u094D\u092F \u092A\u0940\u0915\u092A\u093E\u0932\u091F \u0915\u0930\u093E",
        "\u0930\u094B\u092A\u093E\u0902\u092E\u0927\u094D\u092F\u0947 \u092F\u094B\u0917\u094D\u092F \u0905\u0902\u0924\u0930 (\u096C\u0966 x \u096A\u096B \u0938\u0947\u0902\u092E\u0940) \u0920\u0947\u0935\u093E \u091C\u0947\u0923\u0947\u0915\u0930\u0942\u0928 \u0939\u0935\u093E \u0906\u0923\u093F \u090A\u0928 \u092F\u094B\u0917\u094D\u092F \u092E\u093F\u0933\u0947\u0932",
        "\u092E\u093E\u0924\u0940\u0924\u0940\u0932 \u092C\u0941\u0930\u0936\u0940 \u092A\u093E\u0928\u093E\u0902\u0935\u0930 \u0909\u0921\u0942 \u0928\u092F\u0947 \u092E\u094D\u0939\u0923\u0942\u0928 \u0906\u091A\u094D\u091B\u093E\u0926\u0928 (\u092E\u0932\u094D\u091A\u093F\u0902\u0917) \u0915\u0930\u093E",
        "\u092A\u094D\u0930\u092E\u093E\u0923\u093F\u0924 \u0906\u0923\u093F \u0930\u094B\u0917\u092A\u094D\u0930\u0924\u093F\u0915\u093E\u0930\u0915 \u091C\u093E\u0924\u0940\u0902\u091A\u094D\u092F\u093E \u0930\u094B\u092A\u093E\u0902\u091A\u0940 \u0928\u093F\u0935\u0921 \u0915\u0930\u093E"
      ]
    },
    riskFactors: {
      tempRange: [22, 30],
      humidityMin: 75,
      rainFavorable: true
    }
  },
  late_blight: {
    id: "late_blight",
    name: {
      en: "Late Blight (Phytophthora infestans)",
      hi: "\u092A\u091B\u0947\u0924\u0940 \u091D\u0941\u0932\u0938\u093E (\u0932\u0947\u091F \u092C\u094D\u0932\u093E\u0907\u091F)",
      mr: "\u0932\u0947\u091F \u092C\u094D\u0932\u093E\u0907\u091F / \u0915\u0930\u092A\u093E (\u092B\u093E\u092F\u091F\u094B\u092A\u094D\u0925\u094B\u0930\u093E)"
    },
    crop: { en: "Tomato / Potato", hi: "\u091F\u092E\u093E\u091F\u0930 / \u0906\u0932\u0942", mr: "\u091F\u094B\u092E\u0945\u091F\u094B / \u092C\u091F\u093E\u091F\u093E" },
    symptoms: {
      en: [
        "Water-soaked pale green or dark lesions on leaf tips and margins",
        "White fungal/cottony downy growth on leaf undersides in high humidity",
        "Rapid blackening and rotting of foliage and brown firm rot on fruit"
      ],
      hi: [
        "\u092A\u0924\u094D\u0924\u093F\u092F\u094B\u0902 \u0915\u0947 \u0938\u093F\u0930\u094B\u0902 \u092A\u0930 \u092A\u093E\u0928\u0940 \u0938\u0947 \u092D\u0940\u0917\u0947 \u092D\u0942\u0930\u0947 \u092F\u093E \u0915\u093E\u0932\u0947 \u0927\u092C\u094D\u092C\u0947",
        "\u0905\u0927\u093F\u0915 \u0928\u092E\u0940 \u092E\u0947\u0902 \u092A\u0924\u094D\u0924\u0940 \u0915\u0940 \u0928\u093F\u091A\u0932\u0940 \u0938\u0924\u0939 \u092A\u0930 \u0938\u092B\u0947\u0926 \u0930\u0941\u0908 \u091C\u0948\u0938\u0940 \u092B\u092B\u0942\u0902\u0926",
        "\u092A\u0924\u094D\u0924\u093F\u092F\u094B\u0902 \u0935 \u092B\u0932\u094B\u0902 \u0915\u093E \u0924\u0947\u091C\u0940 \u0938\u0947 \u0915\u093E\u0932\u093E \u092A\u0921\u093C\u0915\u0930 \u0938\u0921\u093C\u0928\u093E"
      ],
      mr: [
        "\u092A\u093E\u0928\u093E\u0902\u091A\u094D\u092F\u093E \u091F\u094B\u0915\u093E\u0902\u0935\u0930 \u092A\u093E\u0923\u0940 \u0936\u094B\u0937\u0932\u094D\u092F\u093E\u0938\u093E\u0930\u0916\u0947 \u0915\u093E\u0933\u092A\u091F \u0921\u093E\u0917",
        "\u091C\u093E\u0938\u094D\u0924 \u0906\u0930\u094D\u0926\u094D\u0930\u0924\u0947\u092E\u0927\u094D\u092F\u0947 \u092A\u093E\u0928\u093E\u0902\u091A\u094D\u092F\u093E \u0916\u093E\u0932\u0940 \u092A\u093E\u0902\u0922\u0931\u094D\u092F\u093E \u092C\u0941\u0930\u0936\u0940\u091A\u0940 \u0935\u093E\u0922",
        "\u092A\u093E\u0928\u0947 \u0906\u0923\u093F \u092B\u0933\u0947 \u0935\u0947\u0917\u093E\u0928\u0947 \u0915\u093E\u0933\u0940 \u092A\u0921\u0942\u0928 \u0915\u0941\u091C\u0923\u0947"
      ]
    },
    organicSolutions: {
      en: [
        "Immediately remove and burn/bury severely blighted branches; never compost diseased tissue",
        "Bordeaux mixture (1%) spray preventive application before continuous cool rains",
        "Neem cake soil amendment to strengthen root zone biodiversity",
        "Keep field thoroughly weed-free to eliminate wild alternate hosts"
      ],
      hi: [
        "\u0917\u0902\u092D\u0940\u0930 \u0930\u0942\u092A \u0938\u0947 \u0917\u094D\u0930\u0938\u093F\u0924 \u0936\u093E\u0916\u093E\u0913\u0902 \u0915\u094B \u0924\u0941\u0930\u0902\u0924 \u0915\u093E\u091F\u0915\u0930 \u092E\u093F\u091F\u094D\u091F\u0940 \u092E\u0947\u0902 \u0917\u0939\u0930\u093E \u0926\u092C\u093E\u090F\u0902 \u092F\u093E \u091C\u0932\u093E\u090F\u0902; \u0915\u092E\u094D\u092A\u094B\u0938\u094D\u091F \u092E\u0947\u0902 \u0928 \u0921\u093E\u0932\u0947\u0902",
        "\u0920\u0902\u0921\u0947 \u0935 \u092C\u093E\u0930\u093F\u0936 \u0915\u0947 \u092E\u094C\u0938\u092E \u0938\u0947 \u092A\u0939\u0932\u0947 1% \u092C\u094B\u0930\u094D\u0921\u094B \u092E\u093F\u0936\u094D\u0930\u0923 \u0915\u093E \u092C\u091A\u093E\u0935 \u0915\u0947 \u0924\u094C\u0930 \u092A\u0930 \u091B\u093F\u0921\u093C\u0915\u093E\u0935 \u0915\u0930\u0947\u0902",
        "\u091C\u0921\u093C \u0915\u094D\u0937\u0947\u0924\u094D\u0930 \u0915\u094B \u092E\u091C\u092C\u0942\u0924 \u0915\u0930\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0928\u0940\u092E \u0915\u0940 \u0916\u0932\u0940 \u0915\u093E \u092A\u094D\u0930\u092F\u094B\u0917 \u0915\u0930\u0947\u0902",
        "\u0916\u0947\u0924 \u0915\u094B \u0916\u0930\u092A\u0924\u0935\u093E\u0930 \u092E\u0941\u0915\u094D\u0924 \u0930\u0916\u0947\u0902"
      ],
      mr: [
        "\u0930\u094B\u0917\u091F \u092B\u093E\u0902\u0926\u094D\u092F\u093E \u0924\u094D\u0935\u0930\u093F\u0924 \u0915\u093E\u0922\u0942\u0928 \u091C\u093E\u0933\u0942\u0928 \u091F\u093E\u0915\u093E \u0915\u093F\u0902\u0935\u093E \u091C\u092E\u093F\u0928\u0940\u0924 \u0917\u093E\u0921\u093E; \u0915\u0902\u092A\u094B\u0938\u094D\u091F \u0916\u0924\u093E\u0924 \u091F\u093E\u0915\u0942 \u0928\u0915\u093E",
        "\u0938\u0924\u0924 \u0922\u0917\u093E\u0933 \u0935 \u092A\u093E\u0935\u0938\u093E\u0933\u0940 \u0939\u0935\u093E\u092E\u093E\u0928\u093E\u092A\u0942\u0930\u094D\u0935\u0940 \u0967% \u092C\u094B\u0930\u094D\u0921\u094B \u092E\u093F\u0936\u094D\u0930\u0923\u093E\u091A\u0940 \u092A\u094D\u0930\u0924\u093F\u092C\u0902\u0927\u093E\u0924\u094D\u092E\u0915 \u092B\u0935\u093E\u0930\u0923\u0940 \u0915\u0930\u093E",
        "\u091C\u092E\u093F\u0928\u0940\u0924 \u0915\u0921\u0941\u0932\u093F\u0902\u092C \u092A\u0947\u0902\u0921 \u0918\u093E\u0932\u0942\u0928 \u092E\u0941\u0933\u093E\u0902\u091A\u0947 \u0906\u0930\u094B\u0917\u094D\u092F \u0938\u0941\u0927\u093E\u0930\u093E",
        "\u0936\u0947\u0924\u093E\u0924\u0940\u0932 \u0924\u0923 \u092A\u0942\u0930\u094D\u0923\u092A\u0923\u0947 \u0915\u093E\u0922\u0942\u0928 \u091F\u093E\u0915\u093E"
      ]
    },
    biologicalSolutions: {
      en: [
        "Bacillus subtilis bio-fungicide formulation (5-10 ml/liter)",
        "Trichoderma viride preventative soil application enriched with well-decomposed FYM"
      ],
      hi: [
        "\u092C\u0948\u0938\u093F\u0932\u0938 \u0938\u092C\u091F\u093F\u0932\u093F\u0938 \u091C\u0948\u0935\u093F\u0915 \u0915\u0935\u0915\u0928\u093E\u0936\u0940 (5-10 \u092E\u093F\u0932\u0940/\u0932\u0940\u091F\u0930)",
        "\u091F\u094D\u0930\u093E\u0907\u0915\u094B\u0921\u0930\u094D\u092E\u093E \u0935\u093F\u0930\u093F\u0921\u0940 \u0915\u094B \u0938\u0921\u093C\u0940 \u0917\u094B\u092C\u0930 \u0916\u093E\u0926 \u092E\u0947\u0902 \u092E\u093F\u0932\u093E\u0915\u0930 \u0916\u0947\u0924 \u092E\u0947\u0902 \u092A\u094D\u0930\u092F\u094B\u0917 \u0915\u0930\u0947\u0902"
      ],
      mr: [
        "\u092C\u0945\u0938\u093F\u0932\u0938 \u0938\u092C\u091F\u093F\u0932\u093F\u0938 \u091C\u0948\u0935\u093F\u0915 \u092C\u0941\u0930\u0936\u0940\u0928\u093E\u0936\u0915 (\u096B-\u0967\u0966 \u092E\u093F\u0932\u0940/\u0932\u093F\u091F\u0930)",
        "\u091F\u094D\u0930\u093E\u092F\u0915\u094B\u0921\u0930\u094D\u092E\u093E \u0935\u094D\u0939\u093F\u0930\u0940\u0921\u0940 \u0936\u0947\u0923\u0916\u0924\u093E\u0924 \u092E\u093F\u0938\u0933\u0942\u0928 \u091C\u092E\u093F\u0928\u0940\u0924 \u0926\u0947\u0923\u0947"
      ]
    },
    verifiedTreatments: {
      en: [
        "Under severe epidemic risk, consult regional state agricultural university guidelines",
        "Targeted systemic protectants like Cymoxanil + Mancozeb or Metalaxyl combinations used only strictly according to statutory label guidelines"
      ],
      hi: [
        "\u0917\u0902\u092D\u0940\u0930 \u0916\u0924\u0930\u0947 \u0915\u0940 \u0938\u094D\u0925\u093F\u0924\u093F \u092E\u0947\u0902 \u0938\u094D\u0925\u093E\u0928\u0940\u092F \u0915\u0943\u0937\u093F \u0905\u0927\u093F\u0915\u093E\u0930\u0940 \u092F\u093E \u0935\u093F\u0936\u094D\u0935\u0935\u093F\u0926\u094D\u092F\u093E\u0932\u092F \u0938\u0947 \u0938\u0902\u092A\u0930\u094D\u0915 \u0915\u0930\u0947\u0902",
        "\u0932\u0947\u092C\u0932 \u0928\u093F\u0930\u094D\u0926\u0947\u0936\u094B\u0902 \u0914\u0930 \u0938\u0941\u0930\u0915\u094D\u0937\u093E \u0928\u093F\u092F\u092E\u094B\u0902 \u0915\u093E \u092A\u093E\u0932\u0928 \u0915\u0930\u0924\u0947 \u0939\u0941\u090F \u0939\u0940 \u0905\u0928\u0941\u0936\u0902\u0938\u093F\u0924 \u092A\u094D\u0930\u0923\u093E\u0932\u0940\u0917\u0924 \u0915\u0935\u0915\u0928\u093E\u0936\u0940 \u0915\u093E \u092A\u094D\u0930\u092F\u094B\u0917 \u0915\u0930\u0947\u0902"
      ],
      mr: [
        "\u0924\u0940\u0935\u094D\u0930 \u092A\u094D\u0930\u093E\u0926\u0941\u0930\u094D\u092D\u093E\u0935 \u0905\u0938\u0932\u094D\u092F\u093E\u0938 \u0938\u094D\u0925\u093E\u0928\u093F\u0915 \u0915\u0943\u0937\u0940 \u0905\u0927\u093F\u0915\u093E\u0930\u0940 \u0915\u093F\u0902\u0935\u093E \u0915\u0943\u0937\u0940 \u0915\u0947\u0902\u0926\u094D\u0930\u093E\u091A\u093E \u0924\u094D\u0935\u0930\u093F\u0924 \u0938\u0932\u094D\u0932\u093E \u0918\u094D\u092F\u093E\u0935\u093E",
        "\u0936\u093F\u092B\u093E\u0930\u0938 \u0915\u0947\u0932\u0947\u0932\u094D\u092F\u093E \u092C\u0941\u0930\u0936\u0940\u0928\u093E\u0936\u0915\u093E\u0902\u091A\u093E \u0932\u0947\u092C\u0932\u0935\u0930\u0940\u0932 \u0938\u0942\u091A\u0928\u093E\u0902\u0928\u0941\u0938\u093E\u0930\u091A \u0915\u093E\u091F\u0947\u0915\u094B\u0930 \u0935\u093E\u092A\u0930 \u0915\u0930\u093E\u0935\u093E"
      ]
    },
    prevention: {
      en: [
        "Plant only certified healthy tubers or certified seedlings",
        "Avoid cool moist valley areas with poor morning sunlight",
        "Cease overhead sprinkling during cloudy foggy spells"
      ],
      hi: [
        "\u0939\u092E\u0947\u0936\u093E \u092A\u094D\u0930\u092E\u093E\u0923\u093F\u0924 \u0935 \u0938\u094D\u0935\u0938\u094D\u0925 \u092C\u0940\u091C\u094B\u0902/\u092A\u094C\u0927\u094B\u0902 \u0915\u093E \u0939\u0940 \u0930\u094B\u092A\u0923 \u0915\u0930\u0947\u0902",
        "\u0915\u094B\u0939\u0930\u0947 \u0914\u0930 \u092C\u093E\u0926\u0932\u094B\u0902 \u0935\u093E\u0932\u0947 \u0926\u093F\u0928\u094B\u0902 \u092E\u0947\u0902 \u092A\u0924\u094D\u0924\u093F\u092F\u094B\u0902 \u092A\u0930 \u092A\u093E\u0928\u0940 \u091B\u093F\u0921\u093C\u0915\u0928\u0947 \u0938\u0947 \u092C\u091A\u0947\u0902"
      ],
      mr: [
        "\u092A\u094D\u0930\u092E\u093E\u0923\u093F\u0924 \u0928\u093F\u0930\u094B\u0917\u0940 \u0930\u094B\u092A\u0947 \u0915\u093F\u0902\u0935\u093E \u092C\u093F\u092F\u093E\u0923\u0947 \u0935\u093E\u092A\u0930\u093E",
        "\u0927\u0941\u0915\u0947 \u0915\u093F\u0902\u0935\u093E \u0922\u0917\u093E\u0933 \u0935\u093E\u0924\u093E\u0935\u0930\u0923\u093E\u0924 \u092A\u093E\u0928\u093E\u0902\u0935\u0930 \u092A\u093E\u0923\u0940 \u092A\u0921\u0942 \u0926\u0947\u090A \u0928\u0915\u093E"
      ]
    },
    riskFactors: {
      tempRange: [12, 22],
      humidityMin: 85,
      rainFavorable: true
    }
  },
  pink_bollworm: {
    id: "pink_bollworm",
    name: {
      en: "Pink Bollworm (Pectinophora gossypiella)",
      hi: "\u0917\u0941\u0932\u093E\u092C\u0940 \u0938\u0941\u0902\u0921\u0940 (\u092A\u093F\u0902\u0915 \u092C\u0949\u0932\u0935\u0949\u0930\u094D\u092E)",
      mr: "\u0917\u0941\u0932\u093E\u092C\u0940 \u092C\u094B\u0902\u0921\u0905\u0933\u0940"
    },
    crop: { en: "Cotton", hi: "\u0915\u092A\u093E\u0938", mr: "\u0915\u093E\u092A\u0942\u0938" },
    symptoms: {
      en: [
        "Rosetted flowers that fail to open naturally",
        "Small entry holes on developing cotton bolls plugged with excreta",
        "Premature boll dropping and stained, discolored lint inside opened bolls"
      ],
      hi: [
        "\u0917\u0941\u0932\u093E\u092C \u091C\u0948\u0938\u0940 \u0938\u093F\u0915\u0941\u0921\u093C\u0940 \u0939\u0941\u0908 \u092B\u0942\u0932 \u0915\u0932\u093F\u092F\u093E\u0902 (\u0930\u094B\u0938\u0947\u091F\u0947\u0921 \u092B\u0942\u0932) \u091C\u094B \u092A\u0942\u0930\u0940 \u0928\u0939\u0940\u0902 \u0916\u093F\u0932\u0924\u0940\u0902",
        "\u0915\u092A\u093E\u0938 \u0915\u0947 \u091F\u093F\u0902\u0921\u094B\u0902 \u092A\u0930 \u091B\u094B\u091F\u0947 \u091B\u093F\u0926\u094D\u0930 \u0914\u0930 \u092E\u0932 \u0915\u093E \u091C\u092E\u093E\u0935",
        "\u091F\u093F\u0902\u0921\u094B\u0902 \u0915\u093E \u0938\u092E\u092F \u0938\u0947 \u092A\u0939\u0932\u0947 \u0917\u093F\u0930\u0928\u093E \u0914\u0930 \u0916\u0930\u093E\u092C \u0930\u0941\u0908"
      ],
      mr: [
        "\u0917\u0941\u0932\u093E\u092C\u093E\u0938\u093E\u0930\u0916\u0940 \u092C\u0902\u0926 \u0930\u093E\u0939\u093F\u0932\u0947\u0932\u0940 \u092B\u0941\u0932\u0947 (\u0930\u094B\u091D\u0947\u091F \u092B\u0941\u0932\u0947) \u091C\u0940 \u0909\u0918\u0921\u0924 \u0928\u093E\u0939\u0940\u0924",
        "\u092C\u094B\u0902\u0921\u093E\u0902\u0935\u0930 \u092C\u093E\u0930\u0940\u0915 \u091B\u093F\u0926\u094D\u0930 \u0906\u0923\u093F \u0935\u093F\u0937\u094D\u0920\u0947\u091A\u0947 \u0921\u093E\u0917",
        "\u092C\u094B\u0902\u0921\u0947 \u0905\u0915\u093E\u0932\u0940 \u0917\u0933\u0923\u0947 \u0906\u0923\u093F \u0906\u0924\u0940\u0932 \u0915\u093E\u092A\u0942\u0938 \u0921\u093E\u0917\u093E\u0933\u0932\u0947\u0932\u093E \u0928\u093F\u0918\u0923\u0947"
      ]
    },
    organicSolutions: {
      en: [
        "Install Pheromone traps (Pectino-lure) @ 8-10 traps per acre for continuous monitoring",
        "Collect and destroy rosetted flowers and dropped infested bolls daily",
        "Spray certified Neem Seed Kernel Extract (NSKE 5%) or 1500 ppm Neem oil at initiation of flowering",
        "Avoid extending the crop season into ratoon cotton"
      ],
      hi: [
        "\u0928\u093F\u0917\u0930\u093E\u0928\u0940 \u0939\u0947\u0924\u0941 8-10 \u092B\u0947\u0930\u094B\u092E\u094B\u0928 \u091F\u094D\u0930\u0948\u092A (\u092A\u0947\u0915\u094D\u091F\u093F\u0928\u094B\u0932\u094D\u092F\u094B\u0930) \u092A\u094D\u0930\u0924\u093F \u090F\u0915\u0921\u093C \u0932\u0917\u093E\u090F\u0902",
        "\u0938\u093F\u0915\u0941\u0921\u093C\u0947 \u0939\u0941\u090F \u0930\u094B\u0938\u0947\u091F\u0947\u0921 \u092B\u0942\u0932\u094B\u0902 \u0914\u0930 \u0917\u093F\u0930\u0947 \u0939\u0941\u090F \u092A\u094D\u0930\u092D\u093E\u0935\u093F\u0924 \u091F\u093F\u0902\u0921\u094B\u0902 \u0915\u094B \u0907\u0915\u091F\u094D\u0920\u093E \u0915\u0930 \u0928\u0937\u094D\u091F \u0915\u0930\u0947\u0902",
        "\u092B\u0942\u0932 \u0906\u0924\u0947 \u0938\u092E\u092F 5% \u0928\u0940\u092E \u092C\u0940\u091C \u0905\u0930\u094D\u0915 (NSKE) \u092F\u093E \u0928\u0940\u092E \u0924\u0947\u0932 (1500 ppm) \u0915\u093E \u091B\u093F\u0921\u093C\u0915\u093E\u0935 \u0915\u0930\u0947\u0902",
        "\u0915\u092A\u093E\u0938 \u0915\u0940 \u092B\u0938\u0932 \u0915\u094B \u0905\u0928\u093E\u0935\u0936\u094D\u092F\u0915 \u0905\u0927\u093F\u0915 \u0938\u092E\u092F \u0924\u0915 \u0928 \u0916\u0940\u0902\u091A\u0947\u0902"
      ],
      mr: [
        "\u0928\u093F\u0930\u0940\u0915\u094D\u0937\u0923\u093E\u0938\u093E\u0920\u0940 \u090F\u0915\u0930\u0940 \u096E-\u0967\u0966 \u0915\u093E\u092E\u0917\u0902\u0927 \u0938\u093E\u092A\u0933\u0947 (\u092B\u0947\u0930\u094B\u092E\u094B\u0928 \u091F\u094D\u0930\u0945\u092A) \u0932\u093E\u0935\u093E",
        "\u0930\u094B\u091D\u0947\u091F \u092B\u0941\u0932\u0947 \u0935 \u0917\u0933\u093E\u0932\u0947\u0932\u0940 \u0915\u0940\u0921\u0917\u094D\u0930\u0938\u094D\u0924 \u092C\u094B\u0902\u0921\u0947 \u0917\u094B\u0933\u093E \u0915\u0930\u0942\u0928 \u091C\u092E\u093F\u0928\u0940\u0924 \u0917\u093E\u0921\u0942\u0928 \u0928\u0937\u094D\u091F \u0915\u0930\u093E",
        "\u096B% \u0928\u093F\u0902\u092C\u094B\u0933\u0940 \u0905\u0930\u094D\u0915 (NSKE) \u0915\u093F\u0902\u0935\u093E \u0915\u0921\u0941\u0928\u093F\u0902\u092C \u0924\u0947\u0932 (\u0967\u096B\u0966\u0966 \u092A\u0940\u092A\u0940\u090F\u092E) \u092B\u0941\u0932\u094B\u0931\u094D\u092F\u093E\u091A\u094D\u092F\u093E \u0938\u0941\u0930\u0941\u0935\u093E\u0924\u0940\u0932\u093E \u092B\u0935\u093E\u0930\u093E",
        "\u0915\u092A\u093E\u0936\u0940\u091A\u0947 \u092A\u0940\u0915 \u091C\u093E\u0938\u094D\u0924 \u092E\u0939\u093F\u0928\u0947 \u0924\u093E\u0923\u0942\u0928 \u0920\u0947\u0935\u0942 \u0928\u0915\u093E"
      ]
    },
    biologicalSolutions: {
      en: [
        "Release egg parasitoid Trichogramma bactrae @ 60,000 to 1,00,000 parasites/acre at weekly intervals",
        "Foliar application of Beauveria bassiana (10g/liter) during humid evening hours"
      ],
      hi: [
        "\u091F\u094D\u0930\u093E\u0907\u0915\u094B\u0917\u094D\u0930\u093E\u092E\u093E \u092C\u0948\u0915\u094D\u091F\u094D\u0930\u0947 \u092A\u0930\u091C\u0940\u0935\u0940 \u0905\u0902\u0921\u094B\u0902 (Trichogramma bactrae) \u0915\u093E \u0916\u0947\u0924 \u092E\u0947\u0902 \u0938\u093E\u092A\u094D\u0924\u093E\u0939\u093F\u0915 \u092A\u094D\u0930\u092F\u094B\u0917",
        "\u092C\u094D\u092F\u0941\u0935\u0947\u0930\u093F\u092F\u093E \u092C\u093E\u0938\u093F\u092F\u093E\u0928\u093E (10 \u0917\u094D\u0930\u093E\u092E/\u0932\u0940\u091F\u0930) \u0915\u093E \u0936\u093E\u092E \u0915\u0947 \u0938\u092E\u092F \u091B\u093F\u0921\u093C\u0915\u093E\u0935"
      ],
      mr: [
        "\u091F\u094D\u0930\u093E\u092F\u0915\u094B\u0917\u094D\u0930\u093E\u092E\u093E \u092C\u0945\u0915\u094D\u091F\u094D\u0930\u0940 \u092F\u093E \u092A\u0930\u094B\u092A\u091C\u0940\u0935\u0940 \u0915\u0940\u091F\u0915\u093E\u0902\u091A\u0947 \u0915\u093E\u0930\u094D\u0921 \u090F\u0915\u0930\u0940 \u096C\u0966,\u0966\u0966\u0966 \u0924\u0947 \u0967 \u0932\u093E\u0916 \u092A\u094D\u0930\u092E\u093E\u0923\u093E\u0924 \u0932\u093E\u0935\u093E",
        "\u092C\u094D\u092F\u0941\u0935\u094D\u0939\u0947\u0930\u093F\u092F\u093E \u092C\u0945\u0938\u093F\u092F\u093E\u0928\u093E \u091C\u0948\u0935\u093F\u0915 \u092C\u0941\u0930\u0936\u0940 (\u0967\u0966 \u0917\u094D\u0930\u0945\u092E \u092A\u094D\u0930\u0924\u093F \u0932\u093F\u091F\u0930) \u0938\u0902\u0927\u094D\u092F\u093E\u0915\u093E\u0933\u091A\u094D\u092F\u093E \u0935\u0947\u0933\u0940 \u092B\u0935\u093E\u0930\u093E"
      ]
    },
    verifiedTreatments: {
      en: [
        "Apply treatments only when moth trap catch crosses ETL (8 moths/trap/night for 3 consecutive days)",
        "Consult government agricultural department advisories for approved green-label insect growth regulators",
        "Follow complete safety protocol and avoid mixing chemicals arbitrarily"
      ],
      hi: [
        "\u091C\u092C \u0915\u0940\u091F \u0906\u0930\u094D\u0925\u093F\u0915 \u0928\u0941\u0915\u0938\u093E\u0928 \u0938\u094D\u0924\u0930 (ETL - \u0932\u0917\u093E\u0924\u093E\u0930 3 \u0926\u093F\u0928 8 \u092A\u0924\u0902\u0917\u0947/\u091F\u094D\u0930\u0948\u092A) \u092A\u093E\u0930 \u0915\u0930\u0947 \u0924\u092D\u0940 \u0935\u093F\u0936\u0947\u0937\u091C\u094D\u091E \u0915\u0940 \u0930\u093E\u092F \u0932\u0947\u0902",
        "\u0938\u0930\u0915\u093E\u0930\u0940 \u0915\u0943\u0937\u093F \u0935\u093F\u092D\u093E\u0917 \u0926\u094D\u0935\u093E\u0930\u093E \u0938\u094D\u0935\u0940\u0915\u0943\u0924 \u0915\u0940\u091F\u0928\u093E\u0936\u0915 \u0939\u0940 \u0905\u0928\u0941\u0936\u0902\u0938\u093F\u0924 \u092E\u093E\u0924\u094D\u0930\u093E \u092E\u0947\u0902 \u0909\u092A\u092F\u094B\u0917 \u0915\u0930\u0947\u0902"
      ],
      mr: [
        "\u0906\u0930\u094D\u0925\u093F\u0915 \u0928\u0941\u0915\u0938\u093E\u0928 \u092A\u093E\u0924\u0933\u0940 (\u0938\u0932\u0917 \u0969 \u0926\u093F\u0935\u0938 \u092A\u094D\u0930\u0924\u093F \u0938\u093E\u092A\u0933\u093E \u096E \u092A\u0924\u0902\u0917) \u0913\u0932\u093E\u0902\u0921\u0932\u094D\u092F\u093E\u0938\u091A \u0915\u0943\u0937\u0940 \u0905\u0927\u093F\u0915\u093E\u0931\u094D\u092F\u093E\u0902\u091A\u094D\u092F\u093E \u0938\u0932\u094D\u0932\u094D\u092F\u093E\u0928\u0947 \u0909\u092A\u093E\u092F \u0915\u0930\u093E",
        "\u0915\u0947\u0902\u0926\u094D\u0930\u0940\u092F \u0915\u0940\u091F\u0915\u0928\u093E\u0936\u0915 \u092E\u0902\u0921\u0933\u093E\u0928\u0947 \u0936\u093F\u092B\u093E\u0930\u0938 \u0915\u0947\u0932\u0947\u0932\u0947 \u0905\u0927\u093F\u0915\u0943\u0924 \u0914\u0937\u0927\u091A \u0935\u093E\u092A\u0930\u093E"
      ]
    },
    prevention: {
      en: [
        "Deep summer ploughing to expose hibernating pupae to natural sunlight and predators",
        "Timely termination of crop by December to break pest life cycle",
        "Destruction of cotton crop residues after final picking"
      ],
      hi: [
        "\u092E\u0908-\u091C\u0942\u0928 \u092E\u0947\u0902 \u0917\u0939\u0930\u0940 \u0917\u0930\u094D\u092E\u0940 \u0915\u0940 \u091C\u0941\u0924\u093E\u0908 \u0915\u0930\u0947\u0902 \u0924\u093E\u0915\u093F \u0938\u0941\u0902\u0921\u0940 \u0915\u0940 \u092A\u094D\u092F\u0942\u092A\u093E \u0927\u0942\u092A \u0938\u0947 \u0928\u0937\u094D\u091F \u0939\u094B \u091C\u093E\u090F\u0902",
        "\u0926\u093F\u0938\u0902\u092C\u0930 \u0924\u0915 \u092B\u0938\u0932 \u0915\u0940 \u0915\u091F\u093E\u0908 \u092A\u0942\u0930\u094D\u0923 \u0915\u0930 \u091C\u0940\u0935\u0928 \u091A\u0915\u094D\u0930 \u0915\u094B \u0924\u094B\u0921\u093C\u0947\u0902",
        "\u0905\u0902\u0924\u093F\u092E \u091A\u0941\u0928\u093E\u0908 \u0915\u0947 \u092C\u093E\u0926 \u0905\u0935\u0936\u0947\u0937\u094B\u0902 \u0915\u094B \u0928\u0937\u094D\u091F \u0915\u0930\u0947\u0902"
      ],
      mr: [
        "\u0909\u0928\u094D\u0939\u093E\u0933\u094D\u092F\u093E\u0924 \u0936\u0947\u0924\u093E\u091A\u0940 \u0916\u094B\u0932 \u0928\u093E\u0902\u0917\u0930\u091F \u0915\u0930\u093E \u091C\u0947\u0923\u0947\u0915\u0930\u0942\u0928 \u0915\u094B\u0936\u093E\u0935\u0938\u094D\u0925\u0947\u0924\u0940\u0932 \u0905\u0933\u094D\u092F\u093E \u0909\u0928\u094D\u0939\u093E\u0928\u0947 \u0928\u0937\u094D\u091F \u0939\u094B\u0924\u0940\u0932",
        "\u0921\u093F\u0938\u0947\u0902\u092C\u0930 \u0905\u0916\u0947\u0930\u092A\u0930\u094D\u092F\u0902\u0924 \u092A\u0940\u0915 \u0915\u093E\u0922\u0942\u0928 \u091C\u0940\u0935\u0928\u091A\u0915\u094D\u0930 \u0916\u0902\u0921\u093F\u0924 \u0915\u0930\u093E",
        "\u0936\u0947\u0935\u091F\u091A\u094D\u092F\u093E \u0935\u0947\u091A\u0923\u0940\u0928\u0902\u0924\u0930 \u092A\u0930\u093E\u0920\u094D\u092F\u093E \u0936\u0947\u0924\u093E\u0924 \u0928 \u0920\u0947\u0935\u0924\u093E \u0928\u0937\u094D\u091F \u0915\u0930\u093E"
      ]
    },
    riskFactors: {
      tempRange: [25, 34],
      humidityMin: 60,
      rainFavorable: false
    }
  },
  chilli_leaf_curl: {
    id: "chilli_leaf_curl",
    name: {
      en: "Chilli Leaf Curl Virus & Thrips Complex",
      hi: "\u092E\u093F\u0930\u094D\u091A \u0915\u093E \u092A\u0930\u094D\u0923 \u0915\u0941\u0902\u091A\u0928 \u0930\u094B\u0917 (\u092E\u0941\u0930\u094D\u0930\u093E\u0939 / \u0932\u0940\u092B \u0915\u0930\u094D\u0932)",
      mr: "\u092E\u093F\u0930\u091A\u0940\u0935\u0930\u0940\u0932 \u091A\u0941\u0930\u0921\u093E-\u092E\u0941\u0930\u0921\u093E (\u0932\u0940\u092B \u0915\u0930\u094D\u0932 \u0935 \u092B\u0941\u0932\u0915\u093F\u0921\u0947)"
    },
    crop: { en: "Chilli", hi: "\u092E\u093F\u0930\u094D\u091A", mr: "\u092E\u093F\u0930\u091A\u0940" },
    symptoms: {
      en: [
        "Upward curling of leaves (boat shaped) accompanied by crinkling and puckering",
        "Stunted bush-like plant appearance with severely reduced leaf size",
        "Flower drop and poor fruit formation with deformed small peppers"
      ],
      hi: [
        "\u092A\u0924\u094D\u0924\u093F\u092F\u094B\u0902 \u0915\u093E \u090A\u092A\u0930 \u0915\u0940 \u0913\u0930 \u0928\u093E\u0935 \u0915\u0940 \u0924\u0930\u0939 \u092E\u0941\u0921\u093C\u0928\u093E \u0935 \u0938\u093F\u0915\u0941\u0921\u093C\u0928\u093E",
        "\u092A\u094C\u0927\u0947 \u0915\u093E \u092C\u094C\u0928\u093E \u0939\u094B \u091C\u093E\u0928\u093E \u0914\u0930 \u092A\u0924\u094D\u0924\u093F\u092F\u094B\u0902 \u0915\u093E \u091B\u094B\u091F\u093E \u0930\u0939 \u091C\u093E\u0928\u093E",
        "\u092B\u0942\u0932\u094B\u0902 \u0915\u093E \u0917\u093F\u0930\u0928\u093E \u0914\u0930 \u091F\u0947\u0922\u093C\u0940-\u092E\u0947\u0922\u093C\u0940 \u092E\u093F\u0930\u094D\u091A \u092C\u0928\u0928\u093E"
      ],
      mr: [
        "\u092A\u093E\u0928\u0947 \u0935\u0930\u091A\u094D\u092F\u093E \u092C\u093E\u091C\u0942\u0932\u093E \u0935\u093E\u091F\u0940\u0938\u093E\u0930\u0916\u0940 \u0915\u093F\u0902\u0935\u093E \u092C\u094B\u091F\u0940\u0938\u093E\u0930\u0916\u0940 \u0926\u0941\u092E\u0921\u0923\u0947",
        "\u091D\u093E\u0921\u093E\u091A\u0940 \u0935\u093E\u0922 \u0916\u0941\u0902\u091F\u0942\u0928 \u091D\u093E\u0921 \u091D\u0941\u0921\u092A\u093E\u0938\u093E\u0930\u0916\u0947 \u0926\u093F\u0938\u0923\u0947 \u0906\u0923\u093F \u092A\u093E\u0928\u0947 \u0932\u0939\u093E\u0928 \u0939\u094B\u0923\u0947",
        "\u092B\u0941\u0932\u093E\u0902\u091A\u0940 \u0917\u0933 \u0939\u094B\u0923\u0947 \u0906\u0923\u093F \u092B\u0933\u0947 \u0932\u0939\u093E\u0928 \u0915\u093F\u0902\u0935\u093E \u0935\u093E\u0915\u0921\u0940\u0924\u093F\u0915\u0921\u0940 \u092F\u0947\u0923\u0947"
      ]
    },
    organicSolutions: {
      en: [
        "Install yellow and blue sticky traps (20 traps/acre) to capture vector whiteflies and thrips",
        "Spray Agniastra or Dashparni Ark (25-30 ml/liter) every 10 days as natural repellent",
        "Spray 5% Neem Seed Kernel Extract (NSKE) or 10,000 ppm Neem oil at early stage",
        "Eradicate and bury weed hosts and severely infected vector-bearing plants immediately"
      ],
      hi: [
        "\u0930\u0938 \u091A\u0942\u0938\u0915 \u0915\u0940\u091F\u094B\u0902 (\u0925\u094D\u0930\u093F\u092A\u094D\u0938 \u0935 \u0938\u092B\u0947\u0926 \u092E\u0915\u094D\u0916\u0940) \u0915\u094B \u092A\u0915\u0921\u093C\u0928\u0947 \u0939\u0947\u0924\u0941 20 \u0928\u0940\u0932\u0947 \u0935 \u092A\u0940\u0932\u0947 \u091A\u093F\u092A\u091A\u093F\u092A\u0947 \u091F\u094D\u0930\u0948\u092A \u092A\u094D\u0930\u0924\u093F \u090F\u0915\u0921\u093C \u0932\u0917\u093E\u090F\u0902",
        "\u0905\u0917\u094D\u0928\u093F\u092F\u093E\u0938\u094D\u0924\u094D\u0930 \u092F\u093E \u0926\u0936\u092A\u0930\u094D\u0923\u0940 \u0905\u0930\u094D\u0915 \u0915\u093E 10 \u0926\u093F\u0928\u094B\u0902 \u0915\u0947 \u0905\u0902\u0924\u0930\u093E\u0932 \u092A\u0930 \u091B\u093F\u0921\u093C\u0915\u093E\u0935 \u0915\u0930\u0947\u0902",
        "5% \u0928\u0940\u092E \u092C\u0940\u091C \u0905\u0930\u094D\u0915 (NSKE) \u092F\u093E \u0928\u0940\u092E \u0924\u0947\u0932 \u0915\u093E \u091B\u093F\u0921\u093C\u0915\u093E\u0935 \u0915\u0930\u0947\u0902",
        "\u0930\u094B\u0917 \u0938\u0947 \u092C\u0941\u0930\u0940 \u0924\u0930\u0939 \u0917\u094D\u0930\u0938\u094D\u0924 \u092A\u094C\u0927\u094B\u0902 \u0915\u094B \u0909\u0916\u093E\u0921\u093C\u0915\u0930 \u0928\u0937\u094D\u091F \u0915\u0930\u0947\u0902"
      ],
      mr: [
        "\u092B\u0941\u0932\u0915\u093F\u0921\u0947 \u0935 \u092A\u093E\u0902\u0922\u0930\u0940 \u092E\u093E\u0936\u0940 \u092A\u0915\u0921\u0923\u094D\u092F\u093E\u0938\u093E\u0920\u0940 \u090F\u0915\u0930\u0940 \u0968\u0966 \u0928\u093F\u0933\u0947 \u0935 \u092A\u093F\u0935\u0933\u0947 \u091A\u093F\u0915\u091F \u0938\u093E\u092A\u0933\u0947 \u0932\u093E\u0935\u093E",
        "\u0926\u0936\u092A\u0930\u094D\u0923\u0940 \u0905\u0930\u094D\u0915 \u0915\u093F\u0902\u0935\u093E \u0905\u0917\u094D\u0928\u094D\u092F\u093E\u0938\u094D\u0924\u094D\u0930 (\u0968\u096B-\u0969\u0966 \u092E\u093F\u0932\u0940/\u0932\u093F\u091F\u0930) \u0926\u0930 \u0967\u0966 \u0926\u093F\u0935\u0938\u093E\u0902\u0928\u0940 \u092B\u0935\u093E\u0930\u093E",
        "\u096B% \u0928\u093F\u0902\u092C\u094B\u0933\u0940 \u0905\u0930\u094D\u0915 \u0915\u093F\u0902\u0935\u093E \u0915\u0921\u0941\u0932\u093F\u0902\u092C \u0924\u0947\u0932 \u092B\u0935\u093E\u0930\u093E",
        "\u0924\u0940\u0935\u094D\u0930 \u092A\u094D\u0930\u093E\u0926\u0941\u0930\u094D\u092D\u093E\u0935 \u091D\u093E\u0932\u0947\u0932\u0940 \u0930\u094B\u092A\u0947 \u0909\u092A\u091F\u0942\u0928 \u091C\u093E\u0933\u0942\u0928 \u0928\u0937\u094D\u091F \u0915\u0930\u093E"
      ]
    },
    biologicalSolutions: {
      en: [
        "Verticillium lecanii (Lecanicillium lecanii) or Beauveria bassiana @ 5g/liter for vector suppression",
        "Conserve natural predators like ladybird beetles and hoverflies"
      ],
      hi: [
        "\u0935\u0930\u094D\u091F\u093F\u0938\u093F\u0932\u093F\u092F\u092E \u0932\u0947\u0915\u093E\u0928\u0940 \u092F\u093E \u092C\u094D\u092F\u0941\u0935\u0947\u0930\u093F\u092F\u093E \u092C\u093E\u0938\u093F\u092F\u093E\u0928\u093E (5 \u0917\u094D\u0930\u093E\u092E/\u0932\u0940\u091F\u0930) \u0915\u093E \u091B\u093F\u0921\u093C\u0915\u093E\u0935",
        "\u092E\u093F\u0924\u094D\u0930 \u0915\u0940\u091F \u091C\u0948\u0938\u0947 \u0932\u0947\u0921\u0940\u092C\u0930\u094D\u0921 \u092C\u0940\u091F\u0932 \u0915\u093E \u0938\u0902\u0930\u0915\u094D\u0937\u0923 \u0915\u0930\u0947\u0902"
      ],
      mr: [
        "\u0935\u094D\u0939\u0930\u094D\u091F\u093F\u0938\u093F\u0932\u093F\u092F\u092E \u0932\u0947\u0915\u093E\u0928\u0940 \u0915\u093F\u0902\u0935\u093E \u092C\u094D\u092F\u0941\u0935\u094D\u0939\u0947\u0930\u093F\u092F\u093E \u092C\u0945\u0938\u093F\u092F\u093E\u0928\u093E (\u096B \u0917\u094D\u0930\u0945\u092E \u092A\u094D\u0930\u0924\u093F \u0932\u093F\u091F\u0930) \u092B\u0935\u093E\u0930\u093E",
        "\u0922\u093E\u0932\u0915\u093F\u0921\u093E \u092F\u093E\u0902\u0938\u093E\u0930\u0916\u094D\u092F\u093E \u092E\u093F\u0924\u094D\u0930\u0915\u093F\u091F\u0915\u093E\u0902\u091A\u0947 \u0930\u0915\u094D\u0937\u0923 \u0915\u0930\u093E"
      ]
    },
    verifiedTreatments: {
      en: [
        "Virus itself has no chemical cure; management focuses entirely on controlling sucking pest vectors",
        "Consult state agricultural university recommendations for registered sucking pest control agents",
        "Follow rotation of chemical classes to prevent vector resistance buildup"
      ],
      hi: [
        "\u0935\u093E\u092F\u0930\u0938 \u0915\u093E \u0915\u094B\u0908 \u0938\u0940\u0927\u093E \u0930\u093E\u0938\u093E\u092F\u0928\u093F\u0915 \u0909\u092A\u091A\u093E\u0930 \u0928\u0939\u0940\u0902 \u0939\u0948; \u0915\u0947\u0935\u0932 \u0935\u093E\u0939\u0915 \u0915\u0940\u091F\u094B\u0902 (\u0938\u092B\u0947\u0926 \u092E\u0915\u094D\u0916\u0940, \u0925\u094D\u0930\u093F\u092A\u094D\u0938) \u0915\u093E \u0939\u0940 \u0928\u093F\u092F\u0902\u0924\u094D\u0930\u0923 \u0938\u0902\u092D\u0935 \u0939\u0948",
        "\u0915\u0943\u0937\u093F \u0935\u093F\u0936\u0947\u0937\u091C\u094D\u091E \u0915\u0940 \u0938\u0932\u093E\u0939 \u0938\u0947 \u0905\u0928\u0941\u0936\u0902\u0938\u093F\u0924 \u0915\u0940\u091F\u0928\u093E\u0936\u0915\u094B\u0902 \u0915\u093E \u0938\u093E\u0935\u0927\u093E\u0928\u0940\u092A\u0942\u0930\u094D\u0935\u0915 \u092A\u094D\u0930\u092F\u094B\u0917 \u0915\u0930\u0947\u0902"
      ],
      mr: [
        "\u0935\u094D\u0939\u093E\u092F\u0930\u0938\u0935\u0930 \u0925\u0947\u091F \u0930\u093E\u0938\u093E\u092F\u0928\u093F\u0915 \u0914\u0937\u0927 \u0928\u0938\u0924\u0947; \u0915\u0947\u0935\u0933 \u0930\u0938\u0936\u094B\u0937\u0915 \u0915\u0940\u091F\u0915\u093E\u0902\u091A\u0947 \u0928\u093F\u092F\u0902\u0924\u094D\u0930\u0923 \u0915\u0930\u093E\u0935\u0947 \u0932\u093E\u0917\u0924\u0947",
        "\u0915\u0943\u0937\u0940 \u0935\u093F\u0926\u094D\u092F\u093E\u092A\u0940\u0920\u093E\u091A\u094D\u092F\u093E \u0936\u093F\u092B\u093E\u0930\u0936\u0940\u0928\u0941\u0938\u093E\u0930 \u0905\u0927\u093F\u0915\u0943\u0924 \u0914\u0937\u0927 \u0916\u092C\u0930\u0926\u093E\u0930\u0940 \u0918\u0947\u090A\u0928\u091A \u0935\u093E\u092A\u0930\u093E"
      ]
    },
    prevention: {
      en: [
        "Raise chilli nursery under 40-mesh insect-proof nylon net",
        "Grow barrier crops of 2-3 rows of maize, sorghum, or pearl millet around chilli field",
        "Apply silver-on-black reflective plastic mulch to deter sucking insects"
      ],
      hi: [
        "\u0928\u0930\u094D\u0938\u0930\u0940 \u0915\u094B 40-\u092E\u0947\u0936 \u0928\u093E\u092F\u0932\u0949\u0928 \u091C\u093E\u0932\u0940 \u092E\u0947\u0902 \u0939\u0940 \u0924\u0948\u092F\u093E\u0930 \u0915\u0930\u0947\u0902",
        "\u0916\u0947\u0924 \u0915\u0947 \u091A\u093E\u0930\u094B\u0902 \u0913\u0930 \u092E\u0915\u094D\u0915\u093E \u092F\u093E \u091C\u094D\u0935\u093E\u0930 \u0915\u0940 2-3 \u092A\u0902\u0915\u094D\u0924\u093F\u092F\u094B\u0902 \u0915\u0940 \u0905\u0935\u0930\u094B\u0927\u0915 \u092B\u0938\u0932 (\u092C\u0949\u0930\u094D\u0921\u0930 \u0915\u094D\u0930\u0949\u092A) \u0932\u0917\u093E\u090F\u0902",
        "\u0938\u093F\u0932\u094D\u0935\u0930-\u092C\u094D\u0932\u0948\u0915 \u092E\u0932\u094D\u091A\u093F\u0902\u0917 \u0915\u093E \u0909\u092A\u092F\u094B\u0917 \u0915\u0930\u0947\u0902"
      ],
      mr: [
        "\u0930\u094B\u092A\u0935\u093E\u091F\u093F\u0915\u093E \u096A\u0966 \u092E\u0947\u0936 \u0928\u093E\u092F\u0932\u0949\u0928 \u091C\u093E\u0933\u0940\u092E\u0927\u094D\u092F\u0947 \u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924 \u0924\u092F\u093E\u0930 \u0915\u0930\u093E",
        "\u0936\u0947\u0924\u093E\u091A\u094D\u092F\u093E \u091A\u093E\u0930\u0939\u0940 \u092C\u093E\u091C\u0942\u0902\u0928\u0940 \u092E\u0915\u093E \u0915\u093F\u0902\u0935\u093E \u091C\u094D\u0935\u093E\u0930\u0940\u091A\u094D\u092F\u093E \u0968-\u0969 \u0913\u0933\u0940\u0902\u091A\u0947 \u0938\u0902\u0930\u0915\u094D\u0937\u0915 \u0915\u0941\u0902\u092A\u0923 \u0932\u093E\u0935\u093E",
        "\u0938\u093F\u0932\u094D\u0935\u094D\u0939\u0930-\u092C\u094D\u0932\u0945\u0915 \u092A\u094D\u0932\u093E\u0938\u094D\u091F\u093F\u0915 \u092E\u0932\u094D\u091A\u093F\u0902\u0917\u091A\u093E \u0935\u093E\u092A\u0930 \u0915\u0930\u093E"
      ]
    },
    riskFactors: {
      tempRange: [28, 38],
      humidityMin: 40,
      rainFavorable: false
    }
  }
};
var AgriculturalKnowledgeService = class {
  static getCrop(cropIdOrName) {
    const key = cropIdOrName.toLowerCase().trim();
    return CROP_PROFILES[key] || Object.values(CROP_PROFILES).find(
      (p) => p.name.en.toLowerCase() === key || p.name.hi === key || p.name.mr === key
    );
  }
  static getDisease(diseaseIdOrName) {
    const key = diseaseIdOrName.toLowerCase().trim().replace(/[\s-]/g, "_");
    return DISEASE_DATABASE[key] || Object.values(DISEASE_DATABASE).find(
      (d) => d.id.includes(key) || d.name.en.toLowerCase().includes(key)
    );
  }
  static findDiseasesForCrop(cropName) {
    const crop = this.getCrop(cropName);
    if (!crop) return [];
    return crop.commonDiseases.map((id) => DISEASE_DATABASE[id]).filter((d) => Boolean(d));
  }
  static assessWeatherRisk(diseaseId, currentTemp, currentHumidity, isRaining) {
    const disease = DISEASE_DATABASE[diseaseId];
    if (!disease) return null;
    const { tempRange, humidityMin, rainFavorable } = disease.riskFactors;
    const tempRisk = currentTemp >= tempRange[0] && currentTemp <= tempRange[1];
    const humidityRisk = currentHumidity >= humidityMin;
    const rainRisk = !disease.riskFactors.rainFavorable || isRaining;
    let score = 0;
    if (tempRisk) score += 35;
    if (humidityRisk) score += 45;
    if (rainRisk && isRaining) score += 20;
    let level = "low";
    if (score >= 70) level = "high";
    else if (score >= 40) level = "medium";
    return {
      diseaseId,
      diseaseName: disease.name,
      riskLevel: level,
      score,
      tempRisk,
      humidityRisk
    };
  }
};

// src/routes/crops.ts
var cropsRouter = (0, import_express3.Router)();
cropsRouter.get("/", optionalAuth, (req, res) => {
  const userId = req.user?.id;
  let userCrops = [];
  if (userId) {
    userCrops = db.crops.findByUserId(userId);
  }
  if (userCrops.length === 0) {
    const demoCrops = [
      {
        id: "demo-tomato",
        userId: userId || "demo-user",
        cropName: "Tomato (\u091F\u094B\u092E\u0945\u091F\u094B)",
        variety: "Abhinav Hybrid",
        growthStage: "Flowering & Fruit Set",
        plantingDate: new Date(Date.now() - 40 * 864e5).toISOString().split("T")[0],
        soilType: "Medium Black Soil",
        irrigationMethod: "Drip Irrigation",
        notes: "Healthy crop canopy, regular organic compost applied.",
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      },
      {
        id: "demo-cotton",
        userId: userId || "demo-user",
        cropName: "Cotton (\u0915\u093E\u092A\u0942\u0938)",
        variety: "Bt Cotton RCH-2",
        growthStage: "Square Formation",
        plantingDate: new Date(Date.now() - 50 * 864e5).toISOString().split("T")[0],
        soilType: "Deep Black Soil",
        irrigationMethod: "Furrow Irrigation",
        notes: "Installed pheromone traps for pink bollworm monitoring.",
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
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
cropsRouter.post("/", requireAuth, (req, res) => {
  try {
    const { cropName, variety, plantingDate, growthStage, farmLocation, soilType, irrigationMethod, notes } = req.body;
    if (!cropName) {
      res.status(400).json({ success: false, message: "Crop name is required." });
      return;
    }
    const newCrop = {
      id: (0, import_uuid2.v4)(),
      userId: req.user.id,
      cropName: cropName.trim(),
      variety: variety?.trim() || "",
      plantingDate: plantingDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      growthStage: growthStage?.trim() || "Vegetative",
      farmLocation: farmLocation?.trim() || req.user.district,
      soilType: soilType?.trim() || "Medium Black Soil",
      irrigationMethod: irrigationMethod?.trim() || "Drip Irrigation",
      notes: notes?.trim() || "",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const saved = db.crops.create(newCrop);
    res.status(201).json({ success: true, message: "Crop added to farm successfully!", crop: saved });
  } catch (err) {
    console.error("Add crop error:", err);
    res.status(500).json({ success: false, message: "Failed to add crop." });
  }
});
cropsRouter.get("/:id", optionalAuth, (req, res) => {
  const { id } = req.params;
  const crop = db.crops.findById(id);
  if (!crop) {
    res.status(404).json({ success: false, message: "Crop not found." });
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
cropsRouter.put("/:id", requireAuth, (req, res) => {
  const { id } = req.params;
  const crop = db.crops.findById(id);
  if (!crop || crop.userId !== req.user.id) {
    res.status(404).json({ success: false, message: "Crop not found or permission denied." });
    return;
  }
  const updated = db.crops.update(id, req.body);
  res.json({ success: true, message: "Crop details updated.", crop: updated });
});
cropsRouter.delete("/:id", requireAuth, (req, res) => {
  const { id } = req.params;
  const success = db.crops.delete(id, req.user.id);
  if (!success) {
    res.status(404).json({ success: false, message: "Crop not found or could not be removed." });
    return;
  }
  res.json({ success: true, message: "Crop removed successfully." });
});
cropsRouter.get("/meta/supported", (_req, res) => {
  res.json({
    success: true,
    supportedCrops: Object.values(CROP_PROFILES)
  });
});

// src/routes/disease.ts
var import_express4 = require("express");
var import_multer = __toESM(require("multer"), 1);
var import_path3 = __toESM(require("path"), 1);
var import_fs3 = __toESM(require("fs"), 1);
var import_uuid3 = require("uuid");

// src/services/ai/geminiService.ts
var import_generative_ai = require("@google/generative-ai");
var GeminiService = class {
  static getClient() {
    if (!config.geminiApiKey) return null;
    return new import_generative_ai.GoogleGenerativeAI(config.geminiApiKey);
  }
  static async analyzeCropImage(imageBuffer, mimeType, cropHint, lang = "en", context) {
    const ai = this.getClient();
    if (!ai) {
      throw new Error("Gemini API key is not configured.");
    }
    const configuredModel = config.geminiModel ? [config.geminiModel] : [];
    const modelsToTry = [
      ...configuredModel,
      "gemini-3.8-flash",
      "gemini-2.5-flash",
      "gemini-3.5-flash",
      "gemini-2.0-flash",
      "gemini-1.5-flash",
      "gemini-3.5-flash-lite",
      "gemini-3.1-flash-lite",
      "gemini-flash-lite-latest"
    ].filter((m, i, arr) => arr.indexOf(m) === i);
    let lastError = null;
    const langInstructions = {
      en: "Respond in English. Use simple, clear language suitable for an Indian farmer.",
      hi: "\u0939\u093F\u0902\u0926\u0940 \u092E\u0947\u0902 \u0909\u0924\u094D\u0924\u0930 \u0926\u0947\u0902\u0964 \u092D\u093E\u0930\u0924\u0940\u092F \u0915\u093F\u0938\u093E\u0928 \u0915\u0947 \u0932\u093F\u090F \u0938\u0930\u0932, \u0935\u094D\u092F\u093E\u0935\u0939\u093E\u0930\u093F\u0915 \u0935 \u0938\u0941\u092C\u094B\u0927 \u092D\u093E\u0937\u093E \u0915\u093E \u092A\u094D\u0930\u092F\u094B\u0917 \u0915\u0930\u0947\u0902\u0964",
      mr: "\u092E\u0930\u093E\u0920\u0940\u092E\u0927\u094D\u092F\u0947 \u0909\u0924\u094D\u0924\u0930 \u0926\u094D\u092F\u093E. \u0936\u0947\u0924\u0915\u0930\u0940 \u092C\u093E\u0902\u0927\u0935\u093E\u0902\u0928\u093E \u0938\u0939\u091C \u0938\u092E\u091C\u0947\u0932 \u0905\u0936\u0940 \u0938\u093E\u0927\u0940, \u0938\u094B\u092A\u0940 \u0935 \u0935\u094D\u092F\u093E\u0935\u0939\u093E\u0930\u093F\u0915 \u092D\u093E\u0937\u093E \u0935\u093E\u092A\u0930\u093E."
    };
    const prompt = `
You are an expert Agricultural Plant Pathologist and Sustainable Farming Advisor.
Analyze this ACTUAL uploaded plant/crop image with precision.
${cropHint ? `Farmer provided note/suspected crop: "${cropHint}".` : ""}
${context?.location ? `Farm Location: "${context.location}".` : ""}
${context?.weather ? `Current Farm Weather Context: "${context.weather}". Take humidity and temperature into consideration when evaluating fungal, bacterial, or stress symptoms.` : ""}

INSPECTION GUIDELINES:
1. ${langInstructions[lang]}
2. Carefully inspect the leaf, stem, fruit, or foliage in the image.
3. Classify the issue_type into one of:
   - "disease" (fungal, bacterial, viral infection)
   - "pest" (insect damage, sucking pests, larvae, mites)
   - "nutrient_deficiency" (chlorosis, nitrogen/potassium/calcium deficit)
   - "environmental_stress" (sunburn, waterlogging, drought)
   - "healthy" (plant appears normal with no visible pathology)
   - "unknown" (unclear symptoms or image does not show identifiable crop)
   - "analysis_unavailable" (image is unreadable, blurry, dark, or not a plant)

4. If healthy, state that the plant appears healthy in "possible_issue".
5. Give realistic AI confidence (0-100%) based strictly on image clarity and typicality of visual symptoms. DO NOT invent arbitrary fixed numbers.
6. Prioritize ORGANIC, BIOLOGICAL, AND CULTURAL solutions FIRST.
7. For chemical treatments, recommend verified university packages of practices only with strict PPE safety gear and label instructions. Never invent chemical dosages.
8. State clearly that this is an AI assessment and not an absolute laboratory diagnosis.

Return ONLY strict valid JSON matching this schema exactly (no markdown formatting, no code block backticks):
{
  "crop": "Specific crop name in ${lang}",
  "issue_type": "disease" | "pest" | "nutrient_deficiency" | "environmental_stress" | "healthy" | "unknown" | "analysis_unavailable",
  "possible_issue": "Specific identified problem or 'Healthy Crop' in ${lang}",
  "confidence": 82,
  "symptoms": ["Visible symptom 1", "Visible symptom 2"],
  "severity": "low" | "medium" | "high" | "unknown",
  "organic_solutions": ["Organic cultural solution 1", "Organic solution 2"],
  "biological_solutions": ["Biocontrol agent 1", "Biocontrol agent 2"],
  "additional_treatment": ["Verified cautious practice"],
  "prevention": ["Preventative tip 1", "Preventative tip 2"],
  "needs_better_image": false,
  "warning": "Safety disclaimer clarifying AI estimate and KVK consultation",
  "language": "${lang}"
}
`;
    const imagePart = {
      inlineData: {
        data: imageBuffer.toString("base64"),
        mimeType: mimeType || "image/jpeg"
      }
    };
    for (const modelName of modelsToTry) {
      try {
        console.log(`[DISEASE DEBUG] provider = Google Gemini`);
        console.log(`[DISEASE DEBUG] model = ${modelName}`);
        console.log(`[DISEASE DEBUG] aiRequestStarted = true`);
        const model = ai.getGenerativeModel({ model: modelName }, { timeout: 15e3 });
        const result = await model.generateContent([prompt, imagePart]);
        const text = result.response.text();
        console.log(`[DISEASE DEBUG] aiResponseReceived = true`);
        const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        const confidenceVal = typeof parsed.confidence === "number" ? Math.min(Math.max(parsed.confidence, 0), 100) : 75;
        return {
          crop: parsed.crop || "Identified Crop",
          issue_type: parsed.issue_type || "disease",
          possible_issue: parsed.possible_issue || "Plant Health Inspection",
          confidence: confidenceVal,
          symptoms: Array.isArray(parsed.symptoms) ? parsed.symptoms : [],
          severity: ["low", "medium", "high", "unknown"].includes(parsed.severity) ? parsed.severity : "medium",
          organic_solutions: Array.isArray(parsed.organic_solutions) ? parsed.organic_solutions : [],
          biological_solutions: Array.isArray(parsed.biological_solutions) ? parsed.biological_solutions : [],
          additional_treatment: Array.isArray(parsed.additional_treatment) ? parsed.additional_treatment : [],
          prevention: Array.isArray(parsed.prevention) ? parsed.prevention : [],
          warning: parsed.warning || "AI assessment for advisory only. Consult your local agricultural officer.",
          language: lang,
          providerUsed: `Google Gemini (${modelName})`
        };
      } catch (err) {
        console.warn(`[DISEASE DEBUG] Gemini model ${modelName} failed:`, err.message);
        lastError = err;
      }
    }
    throw lastError || new Error("Gemini vision analysis failed on all models.");
  }
  static async chat(message, history, context, lang = "en") {
    const ai = this.getClient();
    if (!ai) throw new Error("Gemini API key is not configured.");
    const configuredModel = config.geminiModel ? [config.geminiModel] : [];
    const modelsToTry = [
      ...configuredModel,
      "gemini-3.8-flash",
      "gemini-2.5-flash",
      "gemini-3.5-flash",
      "gemini-2.0-flash",
      "gemini-1.5-flash",
      "gemini-3.5-flash-lite",
      "gemini-3.1-flash-lite",
      "gemini-flash-lite-latest"
    ].filter((m, i, arr) => arr.indexOf(m) === i);
    const langDirectives = {
      en: "Respond in English. Farmer-friendly, practical, short, step-by-step.",
      hi: "\u0939\u093F\u0902\u0926\u0940 \u092E\u0947\u0902 \u0909\u0924\u094D\u0924\u0930 \u0926\u0947\u0902\u0964 \u092D\u093E\u0930\u0924\u0940\u092F \u0915\u093F\u0938\u093E\u0928 \u0915\u0947 \u0932\u093F\u090F \u0938\u0930\u0932, \u0935\u094D\u092F\u093E\u0935\u0939\u093E\u0930\u093F\u0915, \u091A\u0930\u0923\u092C\u0926\u094D\u0927 \u090F\u0935\u0902 \u0938\u094D\u092A\u0937\u094D\u091F \u092D\u093E\u0937\u093E \u0915\u093E \u092A\u094D\u0930\u092F\u094B\u0917 \u0915\u0930\u0947\u0902\u0964",
      mr: "\u092E\u0930\u093E\u0920\u0940\u092E\u0927\u094D\u092F\u0947 \u0909\u0924\u094D\u0924\u0930 \u0926\u094D\u092F\u093E. \u0936\u0947\u0924\u0915\u0931\u094D\u092F\u093E\u0902\u0938\u093E\u0920\u0940 \u0938\u094B\u092A\u0940, \u0935\u094D\u092F\u093E\u0935\u0939\u093E\u0930\u093F\u0915, \u092E\u0941\u0926\u094D\u092F\u093E\u0902\u0928\u0941\u0938\u093E\u0930 \u0906\u0923\u093F \u0905\u0924\u094D\u092F\u0902\u0924 \u0909\u092A\u092F\u0941\u0915\u094D\u0924 \u092E\u093E\u0939\u093F\u0924\u0940 \u0926\u094D\u092F\u093E."
    };
    const systemPrompt = `You are KrishiMitra, an empathetic, highly knowledgeable agricultural companion for Indian farmers.
${langDirectives[lang]}
Active farm context:
- Crops: ${context.crop || "General agriculture"}
- Location: ${context.location || "India"}
- Current Weather: ${context.weather || "Normal"}

Guidance:
- Give biological and organic practices preference.
- Provide simple actionable steps.
- Avoid technical jargon.
- Never invent unverified chemical mixtures.
`;
    let lastError = null;
    for (const modelName of modelsToTry) {
      try {
        const model = ai.getGenerativeModel({ model: modelName }, { timeout: 15e3 });
        const chat = model.startChat({
          history: history.slice(-6).map((h) => ({
            role: h.role === "user" ? "user" : "model",
            parts: [{ text: h.content }]
          })),
          generationConfig: {
            maxOutputTokens: 800,
            temperature: 0.6
          }
        });
        const response = await chat.sendMessage(`${systemPrompt}

Farmer Query: ${message}`);
        return response.response.text();
      } catch (err) {
        lastError = err;
        console.warn(`[GEMINI CHAT] Model ${modelName} failed:`, err.message);
      }
    }
    throw lastError || new Error("All Gemini chat models failed.");
  }
};

// src/services/ai/openAiService.ts
var import_openai = __toESM(require("openai"), 1);
var OpenAiService = class {
  static getClient() {
    if (!config.openaiApiKey) return null;
    return new import_openai.default({ apiKey: config.openaiApiKey });
  }
  static async analyzeCropImage(imageBuffer, mimeType, cropHint, lang = "en") {
    const openai = this.getClient();
    if (!openai) {
      throw new Error("OpenAI API key is not configured.");
    }
    const base64Image = imageBuffer.toString("base64");
    const dataUrl = `data:${mimeType || "image/jpeg"};base64,${base64Image}`;
    const langInstructions = {
      en: "Respond in English. Simple, practical wording for farmers.",
      hi: "\u0939\u093F\u0902\u0926\u0940 \u092E\u0947\u0902 \u0909\u0924\u094D\u0924\u0930 \u0926\u0947\u0902\u0964 \u092D\u093E\u0930\u0924\u0940\u092F \u0915\u093F\u0938\u093E\u0928 \u0915\u0947 \u0905\u0928\u0941\u0915\u0942\u0932 \u0938\u0930\u0932 \u092D\u093E\u0937\u093E \u0915\u093E \u092A\u094D\u0930\u092F\u094B\u0917 \u0915\u0930\u0947\u0902\u0964",
      mr: "\u092E\u0930\u093E\u0920\u0940\u0924 \u0909\u0924\u094D\u0924\u0930 \u0926\u094D\u092F\u093E. \u0936\u0947\u0924\u0915\u0930\u0940 \u092C\u093E\u0902\u0927\u0935\u093E\u0902\u0928\u093E \u0938\u092E\u091C\u0947\u0932 \u0905\u0936\u0940 \u0938\u0941\u0932\u092D \u092D\u093E\u0937\u093E \u0935\u093E\u092A\u0930\u093E."
    };
    const systemPrompt = `You are KrishiMitra, an expert AI agricultural plant pathologist.
${langInstructions[lang]}
Inspect the uploaded crop image carefully.
Allowed issue types: "disease", "pest", "nutrient_deficiency", "environmental_stress", "healthy", "unknown", "analysis_unavailable".
If healthy, note plant appears healthy.
Priority: Organic and biological treatments FIRST.
Safety: No invented pesticide dosages. Cautionary language only.
Return ONLY valid JSON matching this schema:
{
  "crop": "Crop name in ${lang}",
  "issue_type": "disease" | "pest" | "nutrient_deficiency" | "environmental_stress" | "healthy" | "unknown" | "analysis_unavailable",
  "possible_issue": "Identified disease/pest or 'Healthy Crop' in ${lang}",
  "confidence": 80,
  "symptoms": ["Symptom 1", "Symptom 2"],
  "severity": "low" | "medium" | "high" | "unknown",
  "organic_solutions": ["Organic solution 1"],
  "biological_solutions": ["Biocontrol 1"],
  "additional_treatment": ["Precautionary verified practice"],
  "prevention": ["Preventative cultural tip"],
  "warning": "Safety disclaimer regarding AI estimate and agricultural officer consultation",
  "language": "${lang}"
}`;
    console.log(`[DISEASE DEBUG] provider = OpenAI`);
    console.log(`[DISEASE DEBUG] model = gpt-4o-mini`);
    console.log(`[DISEASE DEBUG] aiRequestStarted = true`);
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: [
            { type: "text", text: `Identify crop and condition from this photo. Notes: ${cropHint || "None"}` },
            { type: "image_url", image_url: { url: dataUrl } }
          ]
        }
      ],
      max_tokens: 1e3
    });
    console.log(`[DISEASE DEBUG] aiResponseReceived = true`);
    const content = response.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(content);
    const confidenceVal = typeof parsed.confidence === "number" ? Math.min(Math.max(parsed.confidence, 0), 100) : 75;
    return {
      crop: parsed.crop || "Crop",
      possible_issue: parsed.possible_issue || "Plant Health Inspection",
      confidence: confidenceVal,
      symptoms: Array.isArray(parsed.symptoms) ? parsed.symptoms : [],
      severity: ["low", "medium", "high", "unknown"].includes(parsed.severity) ? parsed.severity : "medium",
      organic_solutions: Array.isArray(parsed.organic_solutions) ? parsed.organic_solutions : [],
      biological_solutions: Array.isArray(parsed.biological_solutions) ? parsed.biological_solutions : [],
      additional_treatment: Array.isArray(parsed.additional_treatment) ? parsed.additional_treatment : [],
      prevention: Array.isArray(parsed.prevention) ? parsed.prevention : [],
      warning: parsed.warning || "AI assessment for guidance. Consult your nearest agricultural extension worker.",
      language: lang,
      providerUsed: "OpenAI (GPT-4o Vision)"
    };
  }
  static async chat(message, history, context, lang = "en") {
    const openai = this.getClient();
    if (!openai) throw new Error("OpenAI API key is not configured.");
    const langDirectives = {
      en: "Respond in English. Simple, practical, concise, step-by-step.",
      hi: "\u0939\u093F\u0902\u0926\u0940 \u092E\u0947\u0902 \u0909\u0924\u094D\u0924\u0930 \u0926\u0947\u0902\u0964 \u092D\u093E\u0930\u0924\u0940\u092F \u0915\u093F\u0938\u093E\u0928 \u0915\u0947 \u0932\u093F\u090F \u0938\u0930\u0932 \u0935 \u0938\u0941\u092C\u094B\u0927 \u092D\u093E\u0937\u093E \u0930\u0916\u0947\u0902\u0964",
      mr: "\u092E\u0930\u093E\u0920\u0940\u0924 \u0909\u0924\u094D\u0924\u0930 \u0926\u094D\u092F\u093E. \u0938\u094B\u092A\u094D\u092F\u093E \u092E\u0941\u0926\u094D\u0926\u094D\u092F\u093E\u0902\u092E\u0927\u094D\u092F\u0947 \u0938\u094D\u092A\u0937\u094D\u091F \u0938\u0932\u094D\u0932\u093E \u0926\u094D\u092F\u093E."
    };
    const systemPrompt = `You are KrishiMitra, an empathetic Indian AI farmer assistant.
${langDirectives[lang]}
Farmer Context:
- Active Crops: ${context.crop || "General agriculture"}
- Location: ${context.location || "India"}
- Weather: ${context.weather || "Normal"}
Rules:
- Promote organic/biological treatments first.
- Clear, bulleted, actionable steps.
- No invented chemical dosages.`;
    const messages = [
      { role: "system", content: systemPrompt },
      ...history.slice(-6).map((h) => ({
        role: h.role,
        content: h.content
      })),
      { role: "user", content: message }
    ];
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 600,
      temperature: 0.6
    });
    return response.choices[0]?.message?.content || "No response available.";
  }
};

// src/services/ai/mockAiService.ts
var MockAiService = class {
  static analyzeImage(filenameOrHint, selectedCrop, lang = "en") {
    const hint = (filenameOrHint + " " + (selectedCrop || "")).toLowerCase();
    let diseaseKey = "early_blight";
    let sampleConfidence = 76;
    let sampleSeverity = "low";
    if (hint.includes("cotton") || hint.includes("boll") || hint.includes("\u0915\u093E\u092A\u0942\u0938") || hint.includes("\u0915\u092A\u093E\u0938")) {
      diseaseKey = "pink_bollworm";
      sampleConfidence = 84;
      sampleSeverity = "medium";
    } else if (hint.includes("chilli") || hint.includes("mirch") || hint.includes("curl") || hint.includes("\u092E\u093F\u0930\u091A\u0940")) {
      diseaseKey = "chilli_leaf_curl";
      sampleConfidence = 79;
      sampleSeverity = "medium";
    } else if (hint.includes("late") || hint.includes("rot") || hint.includes("\u092C\u091F\u093E\u091F\u093E")) {
      diseaseKey = "late_blight";
      sampleConfidence = 81;
      sampleSeverity = "high";
    } else if (hint.includes("healthy") || hint.includes("\u0928\u093F\u0930\u094B\u0917\u0940") || hint.includes("\u0938\u094D\u0935\u0938\u094D\u0925")) {
      return {
        crop: selectedCrop || (lang === "mr" ? "\u092A\u0940\u0915" : lang === "hi" ? "\u092B\u0938\u0932" : "Crop"),
        issue_type: "healthy",
        possible_issue: lang === "mr" ? "\u0928\u093F\u0930\u094B\u0917\u0940 \u092A\u0940\u0915 (\u0915\u094B\u0923\u0924\u0940\u0939\u0940 \u0917\u0902\u092D\u0940\u0930 \u0915\u0940\u0921/\u0930\u094B\u0917 \u0928\u093E\u0939\u0940)" : lang === "hi" ? "\u0938\u094D\u0935\u0938\u094D\u0925 \u092A\u094C\u0927\u093E (\u0915\u094B\u0908 \u0917\u0902\u092D\u0940\u0930 \u0930\u094B\u0917 \u0928\u0939\u0940\u0902)" : "Healthy Plant (No visible pathogen)",
        confidence: 90,
        symptoms: [
          lang === "mr" ? "\u092A\u093E\u0928\u0947 \u0924\u093E\u091C\u0940 \u0935 \u0939\u093F\u0930\u0935\u0940\u0917\u093E\u0930 \u0926\u093F\u0938\u0924 \u0906\u0939\u0947\u0924" : lang === "hi" ? "\u092A\u0924\u094D\u0924\u093F\u092F\u093E\u0902 \u0939\u0930\u0940 \u0935 \u0938\u094D\u0935\u0938\u094D\u0925 \u0939\u0948\u0902" : "Vibrant green foliage with regular cell structure"
        ],
        severity: "low",
        organic_solutions: [
          lang === "mr" ? "\u0928\u093F\u092F\u092E\u093F\u0924 \u091C\u0940\u0935\u093E\u092E\u0943\u0924 \u0915\u093F\u0902\u0935\u093E \u0938\u0947\u0902\u0926\u094D\u0930\u093F\u092F \u0916\u0924\u093E\u0902\u091A\u093E \u0935\u093E\u092A\u0930 \u0938\u0941\u0930\u0942 \u0920\u0947\u0935\u093E" : lang === "hi" ? "\u091C\u0940\u0935\u093E\u092E\u0943\u0924 \u0935 \u091C\u0948\u0935\u093F\u0915 \u092A\u094B\u0937\u0923 \u091C\u093E\u0930\u0940 \u0930\u0916\u0947\u0902" : "Continue routine application of Jeevamrut and organic compost"
        ],
        biological_solutions: [],
        additional_treatment: [],
        prevention: [
          lang === "mr" ? "\u092F\u094B\u0917\u094D\u092F \u0938\u093F\u0902\u091A\u0928 \u0935 \u0939\u0935\u093E \u0916\u0947\u0933\u0924\u0940 \u0920\u0947\u0935\u093E" : lang === "hi" ? "\u0909\u091A\u093F\u0924 \u0938\u093F\u0902\u091A\u093E\u0908 \u0935 \u0939\u0935\u093E \u0915\u093E \u0938\u0902\u091A\u093E\u0930 \u092C\u0928\u093E\u090F \u0930\u0916\u0947\u0902" : "Maintain balanced watering and crop spacing"
        ],
        warning: "SIMULATED DEMO RESULT: This is a synthetic mock response generated for local development.",
        language: lang,
        providerUsed: "SIMULATED DEMO RESULT"
      };
    }
    const disease = AgriculturalKnowledgeService.getDisease(diseaseKey);
    const warnings = {
      en: "SIMULATED DEMO RESULT: This is a synthetic mock response for testing. In production, configure GEMINI_API_KEY or OPENAI_API_KEY with active credits.",
      hi: "\u0905\u0928\u0941\u0915\u0930\u0923\u093F\u0924 \u0921\u0947\u092E\u094B \u092A\u0930\u093F\u0923\u093E\u092E (SIMULATED DEMO RESULT): \u092F\u0939 \u0915\u0947\u0935\u0932 \u0935\u093F\u0915\u093E\u0938 \u092A\u0930\u0940\u0915\u094D\u0937\u0923 \u0939\u0947\u0924\u0941 \u0939\u0948\u0964 \u0935\u093E\u0938\u094D\u0924\u0935\u093F\u0915 \u090F\u0906\u0908 \u0915\u0947 \u0932\u093F\u090F \u0905\u092A\u0928\u0940 \u0938\u0915\u094D\u0930\u093F\u092F \u090F\u092A\u0940\u0906\u0908 \u0915\u0941\u0902\u091C\u0940 \u0915\u0949\u0928\u094D\u092B\u093C\u093F\u0917\u0930 \u0915\u0930\u0947\u0902\u0964",
      mr: "\u092A\u094D\u0930\u093E\u0924\u094D\u092F\u0915\u094D\u0937\u093F\u0915 \u0921\u0947\u092E\u094B \u0928\u093F\u0915\u093E\u0932 (SIMULATED DEMO RESULT): \u0939\u093E \u0915\u0947\u0935\u0933 \u091A\u093E\u091A\u0923\u0940\u0938\u093E\u0920\u0940 \u0924\u092F\u093E\u0930 \u0915\u0947\u0932\u0947\u0932\u093E \u0905\u0902\u0926\u093E\u091C \u0906\u0939\u0947. \u092A\u094D\u0930\u0924\u094D\u092F\u0915\u094D\u0937 \u0935\u093E\u092A\u0930\u093E\u0938\u093E\u0920\u0940 \u0938\u0915\u094D\u0930\u093F\u092F API \u0915\u0940 \u0915\u0949\u0928\u094D\u092B\u093F\u0917\u0930 \u0915\u0930\u093E."
    };
    return {
      crop: disease.crop[lang] || disease.crop.en,
      issue_type: "disease",
      possible_issue: `[DEMO] ${disease.name[lang] || disease.name.en}`,
      confidence: sampleConfidence,
      symptoms: disease.symptoms[lang] || disease.symptoms.en,
      severity: sampleSeverity,
      organic_solutions: disease.organicSolutions[lang] || disease.organicSolutions.en,
      biological_solutions: disease.biologicalSolutions[lang] || disease.biologicalSolutions.en,
      additional_treatment: disease.verifiedTreatments[lang] || disease.verifiedTreatments.en,
      prevention: disease.prevention[lang] || disease.prevention.en,
      warning: warnings[lang] || warnings.en,
      language: lang,
      providerUsed: "SIMULATED DEMO RESULT"
    };
  }
  static generateChatResponse(message, context, lang = "en") {
    const query = message.toLowerCase();
    if (lang === "mr") {
      if (query.includes("\u092A\u093E\u0923\u0940") || query.includes("\u0938\u093F\u0902\u091A\u0928") || query.includes("water") || query.includes("irrigation")) {
        return `\u{1F4A7} **\u092A\u093E\u0923\u0940 \u0935\u094D\u092F\u0935\u0938\u094D\u0925\u093E\u092A\u0928 \u0938\u0932\u094D\u0932\u093E:**

1. \u0938\u0927\u094D\u092F\u093E\u091A\u094D\u092F\u093E \u0939\u0935\u093E\u092E\u093E\u0928\u093E\u0928\u0941\u0938\u093E\u0930 \u0906\u0923\u093F \u091C\u092E\u093F\u0928\u0940\u0924 \u0913\u0932\u093E\u0935\u093E \u0924\u092A\u093E\u0938\u0942\u0928\u091A \u092A\u093E\u0923\u0940 \u0926\u094D\u092F\u093E\u0935\u0947.
2. \u091C\u092E\u093F\u0928\u0940\u0924\u0940\u0932 \u096A \u0907\u0902\u091A \u0916\u094B\u0932\u0940\u0935\u0930\u0940\u0932 \u092E\u093E\u0924\u0940\u091A\u0940 \u092E\u0942\u0920 \u0935\u0933\u0942\u0928 \u092A\u0939\u093E. \u092E\u093E\u0924\u0940\u091A\u093E \u0932\u093E\u0921\u0942 \u092C\u0928\u0932\u094D\u092F\u093E\u0938 \u0913\u0932\u093E\u0935\u093E \u092A\u0941\u0930\u0947\u0938\u093E \u0906\u0939\u0947.
3. \u092A\u093E\u0923\u0940 \u0926\u0947\u0923\u094D\u092F\u093E\u0938\u093E\u0920\u0940 \u0938\u0915\u093E\u0933\u0940 \u0932\u0935\u0915\u0930 (\u096C \u0924\u0947 \u096F) \u0915\u093F\u0902\u0935\u093E \u0938\u0902\u0927\u094D\u092F\u093E\u0915\u093E\u0933\u0940 \u096B \u0928\u0902\u0924\u0930\u091A\u0940 \u0935\u0947\u0933 \u0928\u093F\u0935\u0921\u093E, \u091C\u0947\u0923\u0947\u0915\u0930\u0942\u0928 \u092C\u093E\u0937\u094D\u092A\u0940\u092D\u0935\u0928 \u0915\u092E\u0940 \u0939\u094B\u0908\u0932.
4. \u0920\u093F\u092C\u0915 \u0938\u093F\u0902\u091A\u0928\u093E\u091A\u093E \u0935\u093E\u092A\u0930 \u0915\u0947\u0932\u094D\u092F\u093E\u0938 \u092E\u0941\u0933\u093E\u0902\u0928\u093E \u0906\u0935\u0936\u094D\u092F\u0915 \u0924\u0947\u0935\u0922\u0947\u091A \u092A\u093E\u0923\u0940 \u092E\u093F\u0933\u0924\u0947.`;
      }
      if (query.includes("\u092A\u093E\u090A\u0938") || query.includes("\u0939\u0935\u093E\u092E\u093E\u0928") || query.includes("rain") || query.includes("weather")) {
        return `\u{1F326}\uFE0F **\u0939\u0935\u093E\u092E\u093E\u0928 \u0906\u0923\u093F \u0936\u0947\u0924\u0940 \u0938\u0932\u094D\u0932\u093E:**

1. \u0924\u0941\u092E\u091A\u094D\u092F\u093E \u092D\u093E\u0917\u093E\u0924\u0940\u0932 \u0939\u0935\u093E\u092E\u093E\u0928\u093E\u091A\u093E \u0905\u0902\u0926\u093E\u091C \u0924\u092A\u093E\u0938\u0942\u0928\u091A \u092B\u0935\u093E\u0930\u0923\u0940 \u0915\u093F\u0902\u0935\u093E \u0916\u0924 \u0926\u0947\u0923\u0947 \u0928\u093F\u0936\u094D\u091A\u093F\u0924 \u0915\u0930\u093E.
2. \u0922\u0917\u093E\u0933 \u0915\u093F\u0902\u0935\u093E \u092A\u093E\u0935\u0938\u093E\u0933\u0940 \u0939\u0935\u093E\u092E\u093E\u0928 \u0905\u0938\u0932\u094D\u092F\u093E\u0938 \u0915\u094B\u0923\u0924\u0940\u0939\u0940 \u0930\u093E\u0938\u093E\u092F\u0928\u093F\u0915 \u0915\u093F\u0902\u0935\u093E \u091C\u0948\u0935\u093F\u0915 \u092B\u0935\u093E\u0930\u0923\u0940 \u0915\u0930\u0942 \u0928\u0915\u093E, \u0915\u093E\u0930\u0923 \u0924\u0940 \u092A\u093E\u0935\u0938\u093E\u0928\u0947 \u0927\u0941\u0924\u0932\u0940 \u091C\u093E\u090A \u0936\u0915\u0924\u0947.
3. \u0936\u0947\u0924\u093E\u0924\u0940\u0932 \u092A\u093E\u0923\u094D\u092F\u093E\u091A\u093E \u0928\u093F\u091A\u0930\u093E \u092F\u094B\u0917\u094D\u092F \u0930\u093E\u0939\u0940\u0932 \u092F\u093E\u091A\u0940 \u0916\u092C\u0930\u0926\u093E\u0930\u0940 \u0918\u094D\u092F\u093E.`;
      }
      if (query.includes("\u0938\u0947\u0902\u0926\u094D\u0930\u093F\u092F") || query.includes("\u0930\u094B\u0917") || query.includes("\u0915\u0940\u0921") || query.includes("organic")) {
        return `\u{1F33F} **\u0938\u0947\u0902\u0926\u094D\u0930\u093F\u092F \u092A\u0940\u0915 \u0938\u0902\u0930\u0915\u094D\u0937\u0923 \u0938\u0932\u094D\u0932\u093E:**

1. \u0915\u093F\u0921\u0940\u0902\u091A\u094D\u092F\u093E \u0928\u093F\u092F\u0902\u0924\u094D\u0930\u0923\u093E\u0938\u093E\u0920\u0940 \u0938\u0930\u094D\u0935\u092A\u094D\u0930\u0925\u092E \u090F\u0915\u0930\u0940 \u096E \u0924\u0947 \u0967\u0966 \u091A\u093F\u0915\u091F \u0938\u093E\u092A\u0933\u0947 (\u092A\u093F\u0935\u0933\u0947 \u0935 \u0928\u093F\u0933\u0947) \u0932\u093E\u0935\u093E.
2. \u096B% \u0928\u093F\u0902\u092C\u094B\u0933\u0940 \u0905\u0930\u094D\u0915 (NSKE) \u0915\u093F\u0902\u0935\u093E \u0915\u0921\u0941\u0928\u093F\u0902\u092C \u0924\u0947\u0932 (\u096B \u092E\u093F\u0932\u0940/\u0932\u093F\u091F\u0930) \u091A\u093E \u092A\u094D\u0930\u0924\u093F\u092C\u0902\u0927\u093E\u0924\u094D\u092E\u0915 \u092B\u0935\u093E\u0930\u093E \u0926\u094D\u092F\u093E.
3. \u092C\u0941\u0930\u0936\u0940\u091C\u0928\u094D\u092F \u0930\u094B\u0917\u093E\u0902\u0938\u093E\u0920\u0940 \u091F\u094D\u0930\u093E\u092F\u0915\u094B\u0921\u0930\u094D\u092E\u093E \u0935\u094D\u0939\u093F\u0930\u0940\u0921\u0940 (\u096B \u0917\u094D\u0930\u0945\u092E \u092A\u094D\u0930\u0924\u093F \u0932\u093F\u091F\u0930) \u091A\u093E \u0935\u093E\u092A\u0930 \u0915\u0930\u093E.
4. \u091C\u092E\u093F\u0928\u0940\u091A\u0940 \u0938\u0941\u092A\u0940\u0915\u0924\u093E \u091F\u093F\u0915\u0935\u0923\u094D\u092F\u093E\u0938\u093E\u0920\u0940 \u091C\u093F\u0935\u093E\u092E\u0943\u0924\u093E\u091A\u093E \u0928\u093F\u092F\u092E\u093F\u0924 \u0935\u093E\u092A\u0930 \u0915\u0930\u093E.`;
      }
      return `\u0928\u092E\u0938\u094D\u0924\u0947 \u0936\u0947\u0924\u0915\u0930\u0940 \u092C\u0902\u0927\u0942! \u{1F64F}

\u092E\u0940 \u0906\u092A\u0932\u093E \u0921\u093F\u091C\u093F\u091F\u0932 \u0915\u0943\u0937\u093F\u092E\u093F\u0924\u094D\u0930 \u0906\u0939\u0947. \u0924\u0941\u092E\u094D\u0939\u0940 \u092E\u0932\u093E \u0935\u093F\u091A\u093E\u0930\u0942 \u0936\u0915\u0924\u093E:
- \u092A\u093F\u0915\u093E\u0935\u0930\u0940\u0932 \u0930\u094B\u0917 \u0935 \u0915\u0940\u0921 \u0928\u093F\u092F\u0902\u0924\u094D\u0930\u0923 (\u0938\u0947\u0902\u0926\u094D\u0930\u093F\u092F \u0909\u092A\u093E\u092F)
- \u0906\u091C \u092A\u093E\u0923\u0940 \u0926\u094D\u092F\u093E\u0935\u0947 \u0915\u093E?
- \u0906\u091C \u092B\u0935\u093E\u0930\u0923\u0940 \u0915\u0930\u0923\u0947 \u092F\u094B\u0917\u094D\u092F \u0906\u0939\u0947 \u0915\u093E?
- \u0916\u0924 \u0935 \u092A\u0940\u0915 \u0915\u093E\u0933\u091C\u0940.

\u0924\u0941\u092E\u094D\u0939\u093E\u0932\u093E \u0915\u094B\u0923\u0924\u094D\u092F\u093E \u092A\u093F\u0915\u093E\u092C\u0926\u094D\u0926\u0932 \u092E\u093E\u0939\u093F\u0924\u0940 \u0939\u0935\u0940 \u0906\u0939\u0947?`;
    }
    if (lang === "hi") {
      if (query.includes("\u092A\u093E\u0928\u0940") || query.includes("\u0938\u093F\u0902\u091A\u093E\u0908") || query.includes("water") || query.includes("irrigation")) {
        return `\u{1F4A7} **\u0938\u093F\u0902\u091A\u093E\u0908 \u092A\u094D\u0930\u092C\u0902\u0927\u0928 \u0938\u0932\u093E\u0939:**

1. \u092E\u093F\u091F\u094D\u091F\u0940 \u092E\u0947\u0902 \u0928\u092E\u0940 \u0915\u093E \u092A\u0930\u0940\u0915\u094D\u0937\u0923 \u0915\u0930\u0928\u0947 \u0915\u0947 \u092C\u093E\u0926 \u0939\u0940 \u0938\u093F\u0902\u091A\u093E\u0908 \u0915\u0930\u0947\u0902\u0964
2. 4 \u0907\u0902\u091A \u0917\u0939\u0930\u093E\u0908 \u0938\u0947 \u092E\u093F\u091F\u094D\u091F\u0940 \u0932\u0947\u0915\u0930 \u092E\u0941\u091F\u094D\u0920\u0940 \u092C\u0928\u093E\u090F\u0902; \u092F\u0926\u093F \u0932\u0921\u094D\u0921\u0942 \u092C\u0928\u0924\u093E \u0939\u0948 \u0924\u094B \u0905\u092D\u0940 \u092A\u093E\u0928\u0940 \u0928 \u0926\u0947\u0902\u0964
3. \u0938\u093F\u0902\u091A\u093E\u0908 \u0938\u0941\u092C\u0939 \u091C\u0932\u094D\u0926\u0940 \u092F\u093E \u0936\u093E\u092E \u0915\u0947 \u0938\u092E\u092F \u0915\u0930\u0947\u0902 \u0924\u093E\u0915\u093F \u092A\u093E\u0928\u0940 \u0915\u093E \u0935\u093E\u0937\u094D\u092A\u0940\u0915\u0930\u0923 \u0928 \u0939\u094B\u0964
4. \u0921\u094D\u0930\u093F\u092A \u0938\u093F\u0902\u091A\u093E\u0908 \u0915\u093E \u092A\u094D\u0930\u092F\u094B\u0917 \u0915\u0930\u0928\u0947 \u0938\u0947 40-50% \u092A\u093E\u0928\u0940 \u0915\u0940 \u092C\u091A\u0924 \u0939\u094B\u0924\u0940 \u0939\u0948\u0964`;
      }
      if (query.includes("\u092C\u093E\u0930\u093F\u0936") || query.includes("\u092E\u094C\u0938\u092E") || query.includes("rain") || query.includes("weather")) {
        return `\u{1F326}\uFE0F **\u092E\u094C\u0938\u092E \u090F\u0935\u0902 \u0915\u0943\u0937\u093F \u0938\u0932\u093E\u0939:**

1. \u092E\u094C\u0938\u092E \u092A\u0942\u0930\u094D\u0935\u093E\u0928\u0941\u092E\u093E\u0928 \u0926\u0947\u0916\u0915\u0930 \u0939\u0940 \u0915\u0940\u091F\u0928\u093E\u0936\u0915 \u092F\u093E \u0916\u093E\u0926 \u0915\u093E \u092A\u094D\u0930\u092F\u094B\u0917 \u0915\u0930\u0947\u0902\u0964
2. \u092F\u0926\u093F \u092C\u093E\u0930\u093F\u0936 \u092F\u093E \u0924\u0947\u091C \u0939\u0935\u093E \u0915\u0940 \u0938\u0902\u092D\u093E\u0935\u0928\u093E \u0939\u094B \u0924\u094B \u091B\u093F\u0921\u093C\u0915\u093E\u0935 \u091F\u093E\u0932 \u0926\u0947\u0902\u0964
3. \u0916\u0947\u0924 \u092E\u0947\u0902 \u092A\u093E\u0928\u0940 \u0915\u093E \u0909\u091A\u093F\u0924 \u0928\u093F\u0915\u093E\u0938 \u0938\u0941\u0928\u093F\u0936\u094D\u091A\u093F\u0924 \u0915\u0930\u0947\u0902\u0964`;
      }
      if (query.includes("\u091C\u0948\u0935\u093F\u0915") || query.includes("\u0930\u094B\u0917") || query.includes("\u0915\u0940\u091F") || query.includes("organic")) {
        return `\u{1F33F} **\u091C\u0948\u0935\u093F\u0915 \u092B\u0938\u0932 \u0938\u0941\u0930\u0915\u094D\u0937\u093E \u0909\u092A\u093E\u092F:**

1. \u0930\u0938 \u091A\u0942\u0938\u0915 \u0915\u0940\u091F\u094B\u0902 \u0915\u0947 \u0932\u093F\u090F \u092A\u0940\u0932\u0947 \u0914\u0930 \u0928\u0940\u0932\u0947 \u091A\u093F\u092A\u091A\u093F\u092A\u0947 \u091F\u094D\u0930\u0948\u092A \u0932\u0917\u093E\u090F\u0902\u0964
2. \u0928\u0940\u092E \u0915\u093E \u0924\u0947\u0932 (3-5 \u092E\u093F\u0932\u0940 \u092A\u094D\u0930\u0924\u093F \u0932\u0940\u091F\u0930) \u0915\u093E \u091B\u093F\u0921\u093C\u0915\u093E\u0935 \u0915\u0930\u0947\u0902\u0964
3. \u092B\u092B\u0942\u0902\u0926 \u091C\u0928\u093F\u0924 \u0930\u094B\u0917\u094B\u0902 \u0915\u0940 \u0930\u094B\u0915\u0925\u093E\u092E \u0939\u0947\u0924\u0941 \u091F\u094D\u0930\u093E\u0907\u0915\u094B\u0921\u0930\u094D\u092E\u093E \u0935\u093F\u0930\u093F\u0921\u0940 \u0915\u093E \u092A\u094D\u0930\u092F\u094B\u0917 \u0915\u0930\u0947\u0902\u0964
4. \u092B\u0938\u0932 \u0915\u0940 \u0930\u094B\u0917 \u092A\u094D\u0930\u0924\u093F\u0930\u094B\u0927\u0915 \u0915\u094D\u0937\u092E\u0924\u093E \u092C\u0922\u093C\u093E\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u091C\u0940\u0935\u093E\u092E\u0943\u0924 \u0915\u093E \u091B\u093F\u0921\u093C\u0915\u093E\u0935 \u0915\u0930\u0947\u0902\u0964`;
      }
      return `\u0928\u092E\u0938\u094D\u0924\u0947 \u0915\u093F\u0938\u093E\u0928 \u092D\u093E\u0908! \u{1F64F}

\u092E\u0948\u0902 \u0906\u092A\u0915\u093E \u0915\u0943\u0937\u093F\u092E\u093F\u0924\u094D\u0930 \u0938\u0939\u093E\u092F\u0915 \u0939\u0942\u0901\u0964 \u0906\u092A \u092E\u0941\u091D\u0938\u0947 \u092A\u0942\u091B \u0938\u0915\u0924\u0947 \u0939\u0948\u0902:
- \u092B\u0938\u0932 \u0915\u0947 \u0930\u094B\u0917\u094B\u0902 \u0935 \u0915\u0940\u091F\u094B\u0902 \u0915\u0947 \u091C\u0948\u0935\u093F\u0915 \u0909\u092A\u093E\u092F
- \u092E\u094C\u0938\u092E \u0906\u0927\u093E\u0930\u093F\u0924 \u0938\u093F\u0902\u091A\u093E\u0908 \u0915\u0940 \u091C\u093E\u0928\u0915\u093E\u0930\u0940
- \u0916\u093E\u0926 \u0935 \u092A\u094B\u0937\u0923 \u092A\u094D\u0930\u092C\u0902\u0927\u0928
- \u0906\u091C \u091B\u093F\u0921\u093C\u0915\u093E\u0935 \u0915\u0930\u0947\u0902 \u092F\u093E \u0928\u0939\u0940\u0902?

\u0906\u092A \u0905\u092A\u0928\u0940 \u0915\u093F\u0938 \u092B\u0938\u0932 \u0915\u0947 \u092C\u093E\u0930\u0947 \u092E\u0947\u0902 \u091C\u093E\u0928\u0928\u093E \u091A\u093E\u0939\u0924\u0947 \u0939\u0948\u0902?`;
    }
    if (query.includes("water") || query.includes("irrigation")) {
      return `\u{1F4A7} **Irrigation Management Advisory:**

1. Check root-zone moisture before turning on water. Perform the hand-ball test at 4-inch depth.
2. Schedule irrigation in the early morning or evening to minimize evaporative losses.
3. For heavy black/clay soils, avoid excess ponding which causes root rot.
4. Drip irrigation delivers water directly to root zones and cuts water consumption by up to 50%.`;
    }
    if (query.includes("rain") || query.includes("weather")) {
      return `\u{1F326}\uFE0F **Weather & Farm Advisory:**

1. Always verify the rainfall forecast before scheduling chemical or biological sprays.
2. Do not spray during wind speeds above 15 km/h or when rain is expected within 6-12 hours.
3. Ensure field drainage channels are clear of debris to prevent water stagnation.`;
    }
    if (query.includes("organic") || query.includes("disease") || query.includes("pest")) {
      return `\u{1F33F} **Organic Crop Protection Guide:**

1. Always start with preventive biological solutions: install 8-10 sticky/pheromone traps per acre.
2. Spray cold-pressed Neem oil (3-5 ml/L with mild surfactant) at the earliest sign of sucking pests.
3. For soil and foliage fungal protection, apply *Trichoderma viride* or *Pseudomonas fluorescens*.
4. Prune lower infected leaves and sanitize tools between rows to break disease spread.`;
    }
    return `Hello Farmer! \u{1F64F}

I am KrishiMitra, your AI Farming Assistant. You can ask me about:
- Crop disease diagnosis and organic treatments
- Weather-based irrigation guidance
- Sowing, fertilizer, and crop management tips
- Spraying weather conditions

Which crop would you like advice on today?`;
  }
};

// src/services/ai/aiService.ts
var AIService = class {
  static async analyzeDisease(imageBuffer, mimeType, filename, cropHint, lang = "en", context) {
    console.log(`[DISEASE DEBUG] mode = ${config.aiMode}`);
    console.log(`[DISEASE DEBUG] imageReceived = ${Boolean(imageBuffer && imageBuffer.length > 0)}`);
    console.log(`[DISEASE DEBUG] mimeType = ${mimeType}`);
    console.log(`[DISEASE DEBUG] imageSize = ${imageBuffer?.length || 0} bytes`);
    console.log(`[DISEASE DEBUG] imageEncodedLength = ${imageBuffer ? imageBuffer.toString("base64").length : 0}`);
    if (config.aiMode === "mock") {
      console.log(`[DISEASE DEBUG] provider = Mock AI (Demo Mode)`);
      return MockAiService.analyzeImage(filename, cropHint, lang);
    }
    let providerAttempted = "none";
    if (config.geminiApiKey) {
      providerAttempted = "Google Gemini";
      try {
        const result = await GeminiService.analyzeCropImage(imageBuffer, mimeType, cropHint, lang, context);
        return this.enrichWithKnowledgeBase(result, lang);
      } catch (geminiError) {
        console.warn("[DISEASE DEBUG] Gemini analysis failed:", geminiError.message);
      }
    }
    if (config.openaiApiKey) {
      providerAttempted = "OpenAI";
      try {
        const result = await OpenAiService.analyzeCropImage(imageBuffer, mimeType, cropHint, lang);
        return this.enrichWithKnowledgeBase(result, lang);
      } catch (openAiError) {
        console.warn("[DISEASE DEBUG] OpenAI fallback analysis failed:", openAiError.message);
      }
    }
    console.warn(`[DISEASE DEBUG] Production AI processing failed with provider: ${providerAttempted}. Returning analysis_unavailable.`);
    const unavailableTitles = {
      en: "AI Analysis Unavailable",
      hi: "\u090F\u0906\u0908 \u0935\u093F\u0936\u094D\u0932\u0947\u0937\u0923 \u0909\u092A\u0932\u092C\u094D\u0927 \u0928\u0939\u0940\u0902 \u0939\u094B \u0938\u0915\u093E",
      mr: "\u090F\u0906\u092F \u0935\u093F\u0936\u094D\u0932\u0947\u0937\u0923 \u0909\u092A\u0932\u092C\u094D\u0927 \u0939\u094B\u090A \u0936\u0915\u0932\u0947 \u0928\u093E\u0939\u0940"
    };
    const unavailableCrop = {
      en: cropHint || "Unknown Plant",
      hi: cropHint || "\u0905\u091C\u094D\u091E\u093E\u0924 \u092A\u094C\u0927\u093E",
      mr: cropHint || "\u0905\u0928\u094B\u0933\u0916\u0940 \u0935\u0928\u0938\u094D\u092A\u0924\u0940"
    };
    const unavailableWarnings = {
      en: "AI analysis could not be completed. Please ensure the leaf or plant is clearly visible in good lighting and try again.",
      hi: "\u090F\u0906\u0908 \u0935\u093F\u0936\u094D\u0932\u0947\u0937\u0923 \u092A\u0942\u0930\u094D\u0923 \u0928\u0939\u0940\u0902 \u0915\u093F\u092F\u093E \u091C\u093E \u0938\u0915\u093E\u0964 \u0915\u0943\u092A\u092F\u093E \u092A\u094C\u0927\u0947 \u0915\u0940 \u092A\u0924\u094D\u0924\u0940 \u0915\u093E \u0938\u094D\u092A\u0937\u094D\u091F \u092B\u094B\u091F\u094B \u0905\u091A\u094D\u091B\u0940 \u0930\u094B\u0936\u0928\u0940 \u092E\u0947\u0902 \u0932\u0947\u0915\u0930 \u092A\u0941\u0928\u0903 \u092A\u094D\u0930\u092F\u093E\u0938 \u0915\u0930\u0947\u0902\u0964",
      mr: "\u090F\u0906\u092F \u0935\u093F\u0936\u094D\u0932\u0947\u0937\u0923 \u092A\u0942\u0930\u094D\u0923 \u0939\u094B\u090A \u0936\u0915\u0932\u0947 \u0928\u093E\u0939\u0940. \u0915\u0943\u092A\u092F\u093E \u091A\u093E\u0902\u0917\u0932\u094D\u092F\u093E \u092A\u094D\u0930\u0915\u093E\u0936\u093E\u0924 \u092A\u093E\u0928\u093E\u091A\u093E \u0938\u094D\u092A\u0937\u094D\u091F \u0935 \u091C\u0935\u0933\u0942\u0928 \u092B\u094B\u091F\u094B \u0915\u093E\u0922\u0942\u0928 \u092A\u0941\u0928\u094D\u0939\u093E \u092A\u094D\u0930\u092F\u0924\u094D\u0928 \u0915\u0930\u093E."
    };
    const practicalTips = {
      en: [
        "Take a clear, close-up photo of the affected leaf or plant part.",
        "Ensure the camera is focused and the lighting is bright and even.",
        "Avoid blurry, shaky, or shadowy photos."
      ],
      hi: [
        "\u092A\u094D\u0930\u092D\u093E\u0935\u093F\u0924 \u092A\u0924\u094D\u0924\u0940 \u092F\u093E \u092B\u0932 \u0915\u093E \u092A\u093E\u0938 \u0938\u0947 \u0938\u094D\u092A\u0937\u094D\u091F \u092B\u094B\u091F\u094B \u0932\u0947\u0902\u0964",
        "\u0915\u0948\u092E\u0930\u093E \u092B\u094B\u0915\u0938 \u0938\u0939\u0940 \u0930\u0916\u0947\u0902 \u0914\u0930 \u092A\u0930\u094D\u092F\u093E\u092A\u094D\u0924 \u0930\u094B\u0936\u0928\u0940 \u092E\u0947\u0902 \u092B\u094B\u091F\u094B \u0916\u0940\u0902\u091A\u0947\u0902\u0964",
        "\u0927\u0941\u0902\u0927\u0932\u0947 \u092F\u093E \u0905\u0902\u0927\u0947\u0930\u0947 \u0935\u093E\u0932\u0947 \u092B\u094B\u091F\u094B \u0938\u0947 \u092C\u091A\u0947\u0902\u0964"
      ],
      mr: [
        "\u092C\u093E\u0927\u093F\u0924 \u092A\u093E\u0928\u093E\u091A\u093E \u0915\u093F\u0902\u0935\u093E \u092B\u0933\u093E\u091A\u093E \u091C\u0935\u0933\u0942\u0928 \u0938\u094D\u0935\u091A\u094D\u091B \u092B\u094B\u091F\u094B \u0918\u094D\u092F\u093E.",
        "\u0915\u0945\u092E\u0947\u0931\u094D\u092F\u093E\u091A\u093E \u092B\u094B\u0915\u0938 \u0935\u094D\u092F\u0935\u0938\u094D\u0925\u093F\u0924 \u0920\u0947\u0935\u0942\u0928 \u091A\u093E\u0902\u0917\u0932\u094D\u092F\u093E \u092A\u094D\u0930\u0915\u093E\u0936\u093E\u0924 \u092B\u094B\u091F\u094B \u0915\u093E\u0922\u093E.",
        "\u0905\u0938\u094D\u092A\u0937\u094D\u091F \u0915\u093F\u0902\u0935\u093E \u0905\u0902\u0927\u093E\u0930\u093E\u0924\u0940\u0932 \u092B\u094B\u091F\u094B \u0915\u093E\u0922\u0923\u0947 \u091F\u093E\u0933\u093E."
      ]
    };
    return {
      crop: unavailableCrop[lang] || unavailableCrop.en,
      issue_type: "analysis_unavailable",
      possible_issue: unavailableTitles[lang] || unavailableTitles.en,
      confidence: 0,
      severity: "unknown",
      symptoms: [],
      organic_solutions: [],
      biological_solutions: [],
      additional_treatment: [],
      prevention: practicalTips[lang] || practicalTips.en,
      warning: unavailableWarnings[lang] || unavailableWarnings.en,
      language: lang,
      providerUsed: "None (Analysis Unavailable)",
      needs_better_image: true
    };
  }
  static async chat(message, history, context, lang = "en") {
    if (config.aiMode === "mock") {
      return {
        response: MockAiService.generateChatResponse(message, context, lang),
        providerUsed: "Mock AI Engine"
      };
    }
    if (config.geminiApiKey) {
      try {
        const response = await GeminiService.chat(message, history, context, lang);
        return { response, providerUsed: "Google Gemini" };
      } catch (err) {
        console.warn("[AI DEBUG] Gemini chat failed:", err.message);
      }
    }
    if (config.openaiApiKey) {
      try {
        const response = await OpenAiService.chat(message, history, context, lang);
        return { response, providerUsed: "OpenAI GPT-4o-mini" };
      } catch (err) {
        console.warn("[AI DEBUG] OpenAI chat failed:", err.message);
      }
    }
    if (config.aiMode === "production") {
      const unavailableResponses = {
        en: "The AI Agricultural Assistant is currently unavailable due to upstream provider rate limits or network issues. Please try again in a moment.",
        hi: "\u0905\u092A\u0938\u094D\u091F\u094D\u0930\u0940\u092E \u092A\u094D\u0930\u0926\u093E\u0924\u093E \u0938\u0940\u092E\u093E \u092F\u093E \u0928\u0947\u091F\u0935\u0930\u094D\u0915 \u0938\u092E\u0938\u094D\u092F\u093E \u0915\u0947 \u0915\u093E\u0930\u0923 \u090F\u0906\u0908 \u0915\u0943\u0937\u093F \u0938\u0939\u093E\u092F\u0915 \u0905\u092D\u0940 \u0909\u0924\u094D\u0924\u0930 \u0926\u0947\u0928\u0947 \u092E\u0947\u0902 \u0905\u0938\u092E\u0930\u094D\u0925 \u0939\u0948\u0964 \u0915\u0943\u092A\u092F\u093E \u0915\u0941\u091B \u0926\u0947\u0930 \u092C\u093E\u0926 \u092A\u0941\u0928\u0903 \u092A\u094D\u0930\u092F\u093E\u0938 \u0915\u0930\u0947\u0902\u0964",
        mr: "\u0938\u0930\u094D\u0935\u094D\u0939\u0930\u0935\u0930\u0940\u0932 \u092E\u0930\u094D\u092F\u093E\u0926\u093E \u0915\u093F\u0902\u0935\u093E \u0928\u0947\u091F\u0935\u0930\u094D\u0915 \u0938\u092E\u0938\u094D\u092F\u0947\u092E\u0941\u0933\u0947 \u090F\u0906\u092F \u0915\u0943\u0937\u0940 \u0938\u0939\u093E\u092F\u094D\u092F\u0915 \u0938\u0927\u094D\u092F\u093E \u0909\u092A\u0932\u092C\u094D\u0927 \u0928\u093E\u0939\u0940. \u0915\u0943\u092A\u092F\u093E \u0915\u093E\u0939\u0940 \u0935\u0947\u0933\u093E\u0924 \u092A\u0941\u0928\u094D\u0939\u093E \u092A\u094D\u0930\u092F\u0924\u094D\u0928 \u0915\u0930\u093E."
      };
      return {
        response: unavailableResponses[lang] || unavailableResponses.en,
        providerUsed: "None (Provider Unavailable)"
      };
    }
    return {
      response: MockAiService.generateChatResponse(message, context, lang),
      providerUsed: "Mock AI Engine"
    };
  }
  static enrichWithKnowledgeBase(result, lang) {
    if (["healthy", "unknown", "analysis_unavailable"].includes(result.issue_type || "")) {
      return result;
    }
    const matched = AgriculturalKnowledgeService.getDisease(result.possible_issue);
    if (matched) {
      const kbOrganic = matched.organicSolutions[lang] || matched.organicSolutions.en;
      if (result.organic_solutions.length === 0 && kbOrganic.length > 0) {
        result.organic_solutions = kbOrganic;
      }
      const kbBio = matched.biologicalSolutions[lang] || matched.biologicalSolutions.en;
      if (result.biological_solutions.length === 0 && kbBio.length > 0) {
        result.biological_solutions = kbBio;
      }
    }
    return result;
  }
};

// src/services/weather/weatherService.ts
var DISTRICT_COORDINATES = {
  pune: { lat: 18.5204, lon: 73.8567, name: { en: "Pune", hi: "\u092A\u0941\u0923\u0947", mr: "\u092A\u0941\u0923\u0947" } },
  nashik: { lat: 19.9975, lon: 73.7898, name: { en: "Nashik", hi: "\u0928\u093E\u0938\u093F\u0915", mr: "\u0928\u093E\u0936\u093F\u0915" } },
  ahmednagar: { lat: 19.0948, lon: 74.748, name: { en: "Ahmednagar", hi: "\u0905\u0939\u092E\u0926\u0928\u0917\u0930", mr: "\u0905\u0939\u093F\u0932\u094D\u092F\u093E\u0928\u0917\u0930" } },
  nagpur: { lat: 21.1458, lon: 79.0882, name: { en: "Nagpur", hi: "\u0928\u093E\u0917\u092A\u0941\u0930", mr: "\u0928\u093E\u0917\u092A\u0942\u0930" } },
  aurangabad: { lat: 19.8762, lon: 75.3433, name: { en: "Chhatrapati Sambhajinagar", hi: "\u091B\u0924\u094D\u0930\u092A\u0924\u093F \u0938\u0902\u092D\u093E\u091C\u0940\u0928\u0917\u0930", mr: "\u091B\u0924\u094D\u0930\u092A\u0924\u0940 \u0938\u0902\u092D\u093E\u091C\u0940\u0928\u0917\u0930" } },
  solapur: { lat: 17.6599, lon: 75.9064, name: { en: "Solapur", hi: "\u0938\u094B\u0932\u093E\u092A\u0941\u0930", mr: "\u0938\u094B\u0932\u093E\u092A\u0942\u0930" } },
  kolhapur: { lat: 16.705, lon: 74.2433, name: { en: "Kolhapur", hi: "\u0915\u094B\u0932\u094D\u0939\u093E\u092A\u0941\u0930", mr: "\u0915\u094B\u0932\u094D\u0939\u093E\u092A\u0942\u0930" } },
  satara: { lat: 17.6805, lon: 74.0183, name: { en: "Satara", hi: "\u0938\u0924\u093E\u0930\u093E", mr: "\u0938\u093E\u0924\u093E\u0930\u093E" } },
  sangli: { lat: 16.8524, lon: 74.5815, name: { en: "Sangli", hi: "\u0938\u093E\u0902\u0917\u0932\u0940", mr: "\u0938\u093E\u0902\u0917\u0932\u0940" } },
  jalgaon: { lat: 21.0077, lon: 75.5626, name: { en: "Jalgaon", hi: "\u091C\u0932\u0917\u093E\u0902\u0935", mr: "\u091C\u0933\u0917\u093E\u0935" } },
  amravati: { lat: 20.9374, lon: 77.7796, name: { en: "Amravati", hi: "\u0905\u092E\u0930\u093E\u0935\u0924\u0940", mr: "\u0905\u092E\u0930\u093E\u0935\u0924\u0940" } },
  nanded: { lat: 19.1383, lon: 77.321, name: { en: "Nanded", hi: "\u0928\u093E\u0902\u0926\u0947\u0921\u093C", mr: "\u0928\u093E\u0902\u0926\u0947\u0921" } },
  latur: { lat: 18.4088, lon: 76.5604, name: { en: "Latur", hi: "\u0932\u093E\u0924\u0942\u0930", mr: "\u0932\u093E\u0924\u0942\u0930" } },
  akola: { lat: 20.7002, lon: 77.0082, name: { en: "Akola", hi: "\u0905\u0915\u094B\u0932\u093E", mr: "\u0905\u0915\u094B\u0932\u093E" } },
  buldhana: { lat: 20.5306, lon: 76.1822, name: { en: "Buldhana", hi: "\u092C\u0941\u0932\u0922\u093E\u0923\u093E", mr: "\u092C\u0941\u0932\u0922\u093E\u0923\u093E" } },
  beed: { lat: 18.9891, lon: 75.7601, name: { en: "Beed", hi: "\u092C\u0940\u0921", mr: "\u092C\u0940\u0921" } },
  dhule: { lat: 20.9042, lon: 74.7749, name: { en: "Dhule", hi: "\u0927\u0941\u0932\u0947", mr: "\u0927\u0941\u0933\u0947" } },
  jalna: { lat: 19.8347, lon: 75.8816, name: { en: "Jalna", hi: "\u091C\u093E\u0932\u0928\u093E", mr: "\u091C\u093E\u0932\u0928\u093E" } },
  osmanabad: { lat: 18.1861, lon: 76.0419, name: { en: "Dharashiv", hi: "\u0927\u093E\u0930\u093E\u0936\u093F\u0935", mr: "\u0927\u093E\u0930\u093E\u0936\u093F\u0935" } },
  parbhani: { lat: 19.2685, lon: 76.7719, name: { en: "Parbhani", hi: "\u092A\u0930\u092D\u0923\u0940", mr: "\u092A\u0930\u092D\u0923\u0940" } },
  yavatmal: { lat: 20.3888, lon: 78.1204, name: { en: "Yavatmal", hi: "\u092F\u0935\u0924\u092E\u093E\u0932", mr: "\u092F\u0935\u0924\u092E\u093E\u0933" } },
  wardha: { lat: 20.7453, lon: 78.6022, name: { en: "Wardha", hi: "\u0935\u0930\u094D\u0927\u093E", mr: "\u0935\u0930\u094D\u0927\u093E" } },
  chandrapur: { lat: 19.9615, lon: 79.2961, name: { en: "Chandrapur", hi: "\u091A\u0902\u0926\u094D\u0930\u092A\u0941\u0930", mr: "\u091A\u0902\u0926\u094D\u0930\u092A\u0942\u0930" } },
  mumbai: { lat: 19.076, lon: 72.8777, name: { en: "Mumbai", hi: "\u092E\u0941\u0902\u092C\u0908", mr: "\u092E\u0941\u0902\u092C\u0908" } },
  thane: { lat: 19.2183, lon: 72.9781, name: { en: "Thane", hi: "\u0920\u093E\u0923\u0947", mr: "\u0920\u093E\u0923\u0947" } },
  ratnagiri: { lat: 16.9902, lon: 73.312, name: { en: "Ratnagiri", hi: "\u0930\u0924\u094D\u0928\u093E\u0917\u093F\u0930\u0940", mr: "\u0930\u0924\u094D\u0928\u093E\u0917\u093F\u0930\u0940" } },
  delhi: { lat: 28.6139, lon: 77.209, name: { en: "New Delhi", hi: "\u0928\u0908 \u0926\u093F\u0932\u094D\u0932\u0940", mr: "\u0928\u0935\u0940 \u0926\u093F\u0932\u094D\u0932\u0940" } },
  bhopal: { lat: 23.2599, lon: 77.4126, name: { en: "Bhopal", hi: "\u092D\u094B\u092A\u093E\u0932", mr: "\u092D\u094B\u092A\u093E\u0933" } },
  lucknow: { lat: 26.8467, lon: 80.9462, name: { en: "Lucknow", hi: "\u0932\u0916\u0928\u090A", mr: "\u0932\u0916\u0928\u094C" } },
  hyderabad: { lat: 17.385, lon: 78.4867, name: { en: "Hyderabad", hi: "\u0939\u0948\u0926\u0930\u093E\u092C\u093E\u0926", mr: "\u0939\u0948\u0926\u0930\u093E\u092C\u093E\u0926" } },
  bengaluru: { lat: 12.9716, lon: 77.5946, name: { en: "Bengaluru", hi: "\u092C\u0947\u0902\u0917\u0932\u0941\u0930\u0941", mr: "\u092C\u0902\u0917\u0933\u0941\u0930\u0942" } }
};
function interpretWmoCode(code) {
  if (code === 0) return { text: "Clear Sky", icon: "Sun" };
  if (code === 1 || code === 2) return { text: "Partly Cloudy", icon: "CloudSun" };
  if (code === 3) return { text: "Overcast", icon: "Cloud" };
  if (code >= 45 && code <= 48) return { text: "Foggy", icon: "CloudFog" };
  if (code >= 51 && code <= 55) return { text: "Light Drizzle", icon: "CloudDrizzle" };
  if (code >= 61 && code <= 65) return { text: "Rainy", icon: "CloudRain" };
  if (code >= 80 && code <= 82) return { text: "Rain Showers", icon: "CloudRain" };
  if (code >= 95) return { text: "Thunderstorm", icon: "CloudLightning" };
  return { text: "Partly Cloudy", icon: "CloudSun" };
}
var WeatherService = class {
  static resolveCoordinates(locationOrDistrict, lat, lon) {
    if (lat && lon && !isNaN(lat) && !isNaN(lon)) {
      return { lat, lon, name: locationOrDistrict || "Current Location" };
    }
    if (locationOrDistrict) {
      const clean = locationOrDistrict.toLowerCase().trim().replace(/[^a-z]/g, "");
      const matchKey = Object.keys(DISTRICT_COORDINATES).find(
        (key) => clean.includes(key) || key.includes(clean)
      );
      if (matchKey) {
        const found = DISTRICT_COORDINATES[matchKey];
        return { lat: found.lat, lon: found.lon, name: found.name.en };
      }
    }
    const def = DISTRICT_COORDINATES.pune;
    return { lat: def.lat, lon: def.lon, name: "Pune, Maharashtra" };
  }
  static async resolveCoordinatesAsync(locationOrDistrict, lat, lon) {
    if (lat && lon && !isNaN(lat) && !isNaN(lon)) {
      return { lat, lon, name: locationOrDistrict || "Current Location" };
    }
    if (locationOrDistrict) {
      const clean = locationOrDistrict.toLowerCase().trim().replace(/[^a-z]/g, "");
      const matchKey = Object.keys(DISTRICT_COORDINATES).find(
        (key) => clean.includes(key) || key.includes(clean)
      );
      if (matchKey) {
        const found = DISTRICT_COORDINATES[matchKey];
        return { lat: found.lat, lon: found.lon, name: found.name.en };
      }
      try {
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(locationOrDistrict.trim())}&count=1&language=en&format=json`;
        const geoRes = await fetch(geoUrl, { signal: AbortSignal.timeout(4e3) });
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          if (geoData.results && geoData.results.length > 0) {
            const top = geoData.results[0];
            const nameWithRegion = top.admin1 ? `${top.name}, ${top.admin1}` : top.name;
            return {
              lat: top.latitude,
              lon: top.longitude,
              name: nameWithRegion
            };
          }
        }
      } catch (geoErr) {
        console.warn(`[WEATHER] Geocoding lookup for "${locationOrDistrict}" failed:`, geoErr);
      }
    }
    return this.resolveCoordinates(locationOrDistrict, lat, lon);
  }
  static async getLiveWeather(locationOrDistrict, lat, lon) {
    const coords = await this.resolveCoordinatesAsync(locationOrDistrict, lat, lon);
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum&timezone=Asia%2FKolkata&forecast_days=6`;
      const response = await fetch(url, { signal: AbortSignal.timeout(6e3) });
      if (!response.ok) {
        throw new Error(`Open-Meteo API returned status ${response.status}`);
      }
      const data = await response.json();
      const current = data.current;
      const daily = data.daily;
      const code = current.weather_code ?? 0;
      const cond = interpretWmoCode(code);
      const temp = Math.round(current.temperature_2m);
      const humidity = Math.round(current.relative_humidity_2m);
      const wind = Math.round(current.wind_speed_10m);
      const rainProb = daily.precipitation_probability_max?.[0] || 0;
      const rainMm = current.precipitation || 0;
      const spraySuitability = this.calculateSpraySuitability(wind, rainProb, humidity);
      const fungalDiseaseRisk = humidity > 80 && temp >= 20 && temp <= 30 ? "high" : humidity > 65 ? "medium" : "low";
      const heatStressLevel = temp >= 38 ? "severe" : temp >= 34 ? "moderate" : "normal";
      const irrigationAdvice = this.calculateIrrigationAdvice(rainProb, rainMm, temp, humidity);
      const forecastList = (daily.time || []).slice(0, 5).map((dateStr, idx) => {
        const d = new Date(dateStr);
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const dayCond = interpretWmoCode(daily.weather_code[idx]);
        return {
          date: dateStr,
          dayName: idx === 0 ? "Today" : dayNames[d.getDay()],
          maxTemp: Math.round(daily.temperature_2m_max[idx]),
          minTemp: Math.round(daily.temperature_2m_min[idx]),
          rainProbability: daily.precipitation_probability_max[idx] || 0,
          condition: dayCond.text,
          conditionIcon: dayCond.icon
        };
      });
      return {
        locationName: coords.name,
        latitude: coords.lat,
        longitude: coords.lon,
        temperature: temp,
        feelsLike: Math.round(current.apparent_temperature || temp),
        humidity,
        windSpeed: wind,
        rainProbability: rainProb,
        rainfallMm: rainMm,
        weatherCode: code,
        condition: cond.text,
        conditionIcon: cond.icon,
        isDay: current.is_day === 1,
        forecast: forecastList,
        agriculturalImpact: {
          spraySuitability,
          fungalDiseaseRisk,
          heatStressLevel,
          irrigationAdvice
        }
      };
    } catch (err) {
      console.warn("Live weather fetch failed, returning realistic agricultural fallback weather:", err);
      return this.getMockWeatherData(coords.name, coords.lat, coords.lon);
    }
  }
  static calculateSpraySuitability(windSpeed, rainProb, humidity) {
    if (rainProb > 50) {
      return {
        status: "poor",
        reason: {
          en: "Rain is likely. Chemical or bio-sprays will wash off leaves without effect.",
          hi: "\u092C\u093E\u0930\u093F\u0936 \u0915\u0940 \u0905\u0927\u093F\u0915 \u0938\u0902\u092D\u093E\u0935\u0928\u093E \u0939\u0948\u0964 \u0926\u0935\u093E \u092A\u0924\u094D\u0924\u093F\u092F\u094B\u0902 \u0938\u0947 \u0927\u0941\u0932 \u091C\u093E\u090F\u0917\u0940\u0964",
          mr: "\u092A\u093E\u0935\u0938\u093E\u091A\u0940 \u0936\u0915\u094D\u092F\u0924\u093E \u091C\u093E\u0938\u094D\u0924 \u0906\u0939\u0947. \u0914\u0937\u0927 \u092A\u093E\u0928\u093E\u0902\u0935\u0930\u0942\u0928 \u0935\u093E\u0939\u0942\u0928 \u091C\u093E\u0908\u0932."
        }
      };
    }
    if (windSpeed > 18) {
      return {
        status: "poor",
        reason: {
          en: "Wind speed is high (> 18 km/h). Spray drift can cause wastage and poor coverage.",
          hi: "\u0939\u0935\u093E \u0915\u0940 \u0917\u0924\u093F \u0924\u0947\u091C \u0939\u0948\u0964 \u0938\u094D\u092A\u094D\u0930\u0947 \u0915\u093E \u092C\u0939\u093E\u0935 \u0939\u094B\u0928\u0947 \u0938\u0947 \u0926\u0935\u093E \u092C\u0930\u094D\u092C\u093E\u0926 \u0939\u094B\u0917\u0940\u0964",
          mr: "\u0935\u093E\u0931\u094D\u092F\u093E\u091A\u093E \u0935\u0947\u0917 \u091C\u093E\u0938\u094D\u0924 \u0906\u0939\u0947 (> \u0967\u096E \u0915\u093F\u092E\u0940/\u0924\u093E\u0938). \u0914\u0937\u0927 \u0939\u0935\u0947\u0928\u0947 \u0907\u0924\u0930\u0924\u094D\u0930 \u0909\u0921\u0947\u0932."
        }
      };
    }
    if (windSpeed > 12 || humidity > 85) {
      return {
        status: "caution",
        reason: {
          en: "Moderate conditions. Spray during early morning (7-9 AM) or late afternoon.",
          hi: "\u092E\u0927\u094D\u092F\u092E \u0938\u094D\u0925\u093F\u0924\u093F\u0964 \u0938\u0941\u092C\u0939 \u091C\u0932\u094D\u0926\u0940 \u092F\u093E \u0936\u093E\u092E 4 \u092C\u091C\u0947 \u0915\u0947 \u092C\u093E\u0926 \u0939\u0940 \u091B\u093F\u0921\u093C\u0915\u093E\u0935 \u0915\u0930\u0947\u0902\u0964",
          mr: "\u092E\u0927\u094D\u092F\u092E \u092A\u0930\u093F\u0938\u094D\u0925\u093F\u0924\u0940. \u0938\u0915\u093E\u0933\u0940 \u0932\u0935\u0915\u0930 \u0915\u093F\u0902\u0935\u093E \u0926\u0941\u092A\u093E\u0930\u0940 \u096A \u0928\u0902\u0924\u0930\u091A \u092B\u0935\u093E\u0930\u0923\u0940 \u0915\u0930\u093E."
        }
      };
    }
    return {
      status: "good",
      reason: {
        en: "Favorable spray weather. Low wind and dry foliage.",
        hi: "\u091B\u093F\u0921\u093C\u0915\u093E\u0935 \u0915\u0947 \u0932\u093F\u090F \u0905\u0928\u0941\u0915\u0942\u0932 \u092E\u094C\u0938\u092E\u0964 \u0939\u0935\u093E \u0936\u093E\u0902\u0924 \u0914\u0930 \u092A\u0924\u094D\u0924\u093F\u092F\u093E\u0902 \u0938\u0942\u0916\u0940 \u0939\u0948\u0902\u0964",
        mr: "\u092B\u0935\u093E\u0930\u0923\u0940\u0938\u093E\u0920\u0940 \u0909\u0924\u094D\u0924\u092E \u0939\u0935\u093E\u092E\u093E\u0928. \u092E\u0902\u0926 \u0935\u093E\u0930\u093E \u0906\u0923\u093F \u0915\u094B\u0930\u0921\u0940 \u092A\u093E\u0928\u0947."
      }
    };
  }
  static calculateIrrigationAdvice(rainProb, rainMm, temp, humidity) {
    if (rainMm > 8 || rainProb >= 65) {
      return {
        en: "Rain is likely today/tomorrow. Postpone irrigation to avoid waterlogging and root asphyxiation.",
        hi: "\u0906\u091C/\u0915\u0932 \u092C\u093E\u0930\u093F\u0936 \u0915\u0940 \u0938\u0902\u092D\u093E\u0935\u0928\u093E \u0939\u0948\u0964 \u091C\u0932\u092D\u0930\u093E\u0935 \u0938\u0947 \u092C\u091A\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0938\u093F\u0902\u091A\u093E\u0908 \u091F\u093E\u0932\u0947\u0902\u0964",
        mr: "\u0906\u091C/\u0909\u0926\u094D\u092F\u093E \u092A\u093E\u0935\u0938\u093E\u091A\u0940 \u0936\u0915\u094D\u092F\u0924\u093E \u0906\u0939\u0947. \u092A\u093E\u0923\u0940 \u0938\u093E\u091A\u0942 \u0928\u092F\u0947 \u092E\u094D\u0939\u0923\u0942\u0928 \u092A\u093E\u0923\u0940 \u0926\u0947\u0923\u0947 \u092A\u0941\u0922\u0947 \u0922\u0915\u0932\u093E."
      };
    }
    if (temp > 35 && humidity < 40) {
      return {
        en: "High heat and low humidity. Irrigate in early morning or evening to replenish transpiration loss.",
        hi: "\u0905\u0927\u093F\u0915 \u0924\u093E\u092A\u092E\u093E\u0928 \u0935 \u0936\u0941\u0937\u094D\u0915 \u092E\u094C\u0938\u092E\u0964 \u0935\u093E\u0937\u094D\u092A\u0940\u0915\u0930\u0923 \u0915\u0940 \u092D\u0930\u092A\u093E\u0908 \u0915\u0947 \u0932\u093F\u090F \u0938\u0941\u092C\u0939 \u092F\u093E \u0936\u093E\u092E \u0915\u094B \u0938\u093F\u0902\u091A\u093E\u0908 \u0915\u0930\u0947\u0902\u0964",
        mr: "\u091C\u093E\u0938\u094D\u0924 \u0924\u093E\u092A\u092E\u093E\u0928 \u0935 \u0915\u094B\u0930\u0921\u0940 \u0939\u0935\u093E. \u0913\u0932\u093E\u0935\u093E \u091F\u093F\u0915\u0935\u0923\u094D\u092F\u093E\u0938\u093E\u0920\u0940 \u0938\u0915\u093E\u0933\u0940 \u0915\u093F\u0902\u0935\u093E \u0938\u0902\u0927\u094D\u092F\u093E\u0915\u093E\u0933\u0940 \u092A\u093E\u0923\u0940 \u0926\u094D\u092F\u093E."
      };
    }
    return {
      en: "Normal weather conditions. Maintain standard irrigation schedule based on soil moisture check.",
      hi: "\u0938\u093E\u092E\u093E\u0928\u094D\u092F \u092E\u094C\u0938\u092E \u0938\u094D\u0925\u093F\u0924\u093F\u0964 \u092E\u093F\u091F\u094D\u091F\u0940 \u092E\u0947\u0902 \u0928\u092E\u0940 \u091C\u093E\u0902\u091A\u0915\u0930 \u0938\u093E\u092E\u093E\u0928\u094D\u092F \u0938\u092E\u092F \u0938\u093E\u0930\u0923\u0940 \u0905\u0928\u0941\u0938\u093E\u0930 \u092A\u093E\u0928\u0940 \u0926\u0947\u0902\u0964",
      mr: "\u0939\u0935\u093E\u092E\u093E\u0928 \u0938\u093E\u092E\u093E\u0928\u094D\u092F \u0906\u0939\u0947. \u091C\u092E\u093F\u0928\u0940\u0924 \u0913\u0932\u093E\u0935\u093E \u0924\u092A\u093E\u0938\u0942\u0928 \u0928\u093F\u092F\u092E\u093F\u0924 \u0935\u0947\u0933\u0947\u0928\u0941\u0938\u093E\u0930 \u092A\u093E\u0923\u0940 \u0926\u094D\u092F\u093E."
    };
  }
  static getMockWeatherData(name, lat, lon) {
    return {
      locationName: name || "Nashik, Maharashtra",
      latitude: lat || 19.9975,
      longitude: lon || 73.7898,
      temperature: 29,
      feelsLike: 31,
      humidity: 68,
      windSpeed: 11,
      rainProbability: 25,
      rainfallMm: 0,
      weatherCode: 1,
      condition: "Partly Cloudy",
      conditionIcon: "CloudSun",
      isDay: true,
      forecast: [
        { date: "Today", dayName: "Today", maxTemp: 31, minTemp: 21, rainProbability: 20, condition: "Partly Cloudy", conditionIcon: "CloudSun" },
        { date: "Tomorrow", dayName: "Thu", maxTemp: 32, minTemp: 22, rainProbability: 15, condition: "Sunny", conditionIcon: "Sun" },
        { date: "Day 3", dayName: "Fri", maxTemp: 30, minTemp: 20, rainProbability: 40, condition: "Cloudy", conditionIcon: "Cloud" },
        { date: "Day 4", dayName: "Sat", maxTemp: 28, minTemp: 19, rainProbability: 60, condition: "Showers", conditionIcon: "CloudRain" },
        { date: "Day 5", dayName: "Sun", maxTemp: 29, minTemp: 20, rainProbability: 30, condition: "Partly Cloudy", conditionIcon: "CloudSun" }
      ],
      agriculturalImpact: {
        spraySuitability: {
          status: "good",
          reason: {
            en: "Favorable spray weather. Low wind and dry foliage.",
            hi: "\u091B\u093F\u0921\u093C\u0915\u093E\u0935 \u0915\u0947 \u0932\u093F\u090F \u0905\u0928\u0941\u0915\u0942\u0932 \u092E\u094C\u0938\u092E\u0964 \u0939\u0935\u093E \u0936\u093E\u0902\u0924 \u0914\u0930 \u092A\u0924\u094D\u0924\u093F\u092F\u093E\u0902 \u0938\u0942\u0916\u0940 \u0939\u0948\u0902\u0964",
            mr: "\u092B\u0935\u093E\u0930\u0923\u0940\u0938\u093E\u0920\u0940 \u0909\u0924\u094D\u0924\u092E \u0939\u0935\u093E\u092E\u093E\u0928. \u092E\u0902\u0926 \u0935\u093E\u0930\u093E \u0906\u0923\u093F \u0915\u094B\u0930\u0921\u0940 \u092A\u093E\u0928\u0947."
          }
        },
        fungalDiseaseRisk: "medium",
        heatStressLevel: "normal",
        irrigationAdvice: {
          en: "Normal weather conditions. Check soil moisture before scheduled watering.",
          hi: "\u0938\u093E\u092E\u093E\u0928\u094D\u092F \u092E\u094C\u0938\u092E\u0964 \u092A\u093E\u0928\u0940 \u0926\u0947\u0928\u0947 \u0938\u0947 \u092A\u0939\u0932\u0947 \u092E\u093F\u091F\u094D\u091F\u0940 \u0915\u0940 \u0928\u092E\u0940 \u091C\u093E\u0902\u091A \u0932\u0947\u0902\u0964",
          mr: "\u0939\u0935\u093E\u092E\u093E\u0928 \u0938\u093E\u092E\u093E\u0928\u094D\u092F \u0906\u0939\u0947. \u092A\u093E\u0923\u0940 \u0926\u0947\u0923\u094D\u092F\u093E\u092A\u0942\u0930\u094D\u0935\u0940 \u091C\u092E\u093F\u0928\u0940\u0924\u0940\u0932 \u0913\u0932\u093E\u0935\u093E \u0924\u092A\u093E\u0938\u093E."
        }
      }
    };
  }
};

// src/routes/disease.ts
var diseaseRouter = (0, import_express4.Router)();
try {
  if (!import_fs3.default.existsSync(config.uploadDir)) {
    import_fs3.default.mkdirSync(config.uploadDir, { recursive: true });
  }
} catch (err) {
  console.warn("[UPLOAD] Upload directory notice:", err);
}
var storage = import_multer.default.diskStorage({
  destination: (_req, _file, cb) => {
    try {
      if (!import_fs3.default.existsSync(config.uploadDir)) {
        import_fs3.default.mkdirSync(config.uploadDir, { recursive: true });
      }
    } catch {
    }
    cb(null, config.uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = import_path3.default.extname(file.originalname) || ".jpg";
    cb(null, `crop-${Date.now()}-${(0, import_uuid3.v4)().substring(0, 8)}${ext}`);
  }
});
var upload = (0, import_multer.default)({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  // 10MB max
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid image format. Please upload JPG, PNG, or WEBP image."));
    }
  }
});
diseaseRouter.post(
  "/analyze",
  optionalAuth,
  upload.single("image"),
  async (req, res) => {
    try {
      const { cropHint, language, imageBase64 } = req.body;
      const lang = ["en", "hi", "mr"].includes(language) ? language : req.user?.preferredLanguage || "en";
      let imageBuffer = null;
      let mimeType = "image/jpeg";
      let filename = "crop-capture.jpg";
      let imageUrl = "/uploads/sample-leaf.jpg";
      if (req.file) {
        imageBuffer = import_fs3.default.readFileSync(req.file.path);
        mimeType = req.file.mimetype;
        filename = req.file.filename;
        imageUrl = `/uploads/${req.file.filename}`;
      } else if (imageBase64) {
        const matches = imageBase64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          mimeType = matches[1];
          imageBuffer = Buffer.from(matches[2], "base64");
        } else {
          imageBuffer = Buffer.from(imageBase64, "base64");
        }
        filename = `capture-${Date.now()}.jpg`;
        const savePath = import_path3.default.join(config.uploadDir, filename);
        try {
          import_fs3.default.writeFileSync(savePath, imageBuffer);
          imageUrl = `/uploads/${filename}`;
        } catch {
          imageUrl = `data:${mimeType};base64,${imageBuffer.toString("base64")}`;
        }
      }
      if (!imageBuffer || imageBuffer.length === 0) {
        if (config.aiMode === "production") {
          res.status(400).json({
            success: false,
            message: "No image provided. Please select or capture a crop photo."
          });
          return;
        } else {
          imageBuffer = Buffer.from("mock-demo-placeholder");
          filename = "demo-leaf.jpg";
        }
      }
      console.log(`[DISEASE DEBUG] mode = ${config.aiMode}`);
      console.log(`[DISEASE DEBUG] imageReceived = true`);
      console.log(`[DISEASE DEBUG] mimeType = ${mimeType}`);
      console.log(`[DISEASE DEBUG] imageSize = ${imageBuffer.length} bytes`);
      console.log(`[DISEASE DEBUG] imageEncodedLength = ${imageBuffer.toString("base64").length}`);
      console.log(`[DISEASE DEBUG] aiRequestStarted = true`);
      const userLocation = req.user?.district || "Pune, Maharashtra";
      let weatherSummary = "";
      try {
        const liveWeather = await WeatherService.getLiveWeather(userLocation);
        weatherSummary = `${liveWeather.condition}, Temp: ${liveWeather.temperature}\xB0C, Humidity: ${liveWeather.humidity}%, Rain probability: ${liveWeather.rainProbability}%`;
      } catch (wErr) {
        console.warn("[DISEASE DEBUG] Weather context lookup skipped:", wErr);
      }
      const analysis = await AIService.analyzeDisease(
        imageBuffer,
        mimeType,
        filename,
        cropHint,
        lang,
        { location: userLocation, weather: weatherSummary }
      );
      console.log(`[DISEASE DEBUG] aiResponseReceived = true`);
      console.log(`[DISEASE DEBUG] providerUsed = ${analysis.providerUsed}`);
      const record = {
        id: (0, import_uuid3.v4)(),
        userId: req.user?.id,
        imageUrl,
        cropIdentified: analysis.crop,
        possibleIssue: analysis.possible_issue,
        confidence: analysis.confidence,
        symptoms: analysis.symptoms,
        severity: analysis.severity,
        organicSolutions: analysis.organic_solutions,
        biologicalSolutions: analysis.biological_solutions,
        additionalTreatment: analysis.additional_treatment,
        prevention: analysis.prevention,
        warning: analysis.warning,
        language: lang,
        issueType: analysis.issue_type,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      db.diseaseAnalyses.create(record);
      res.status(200).json({
        success: true,
        analysis: record,
        providerUsed: analysis.providerUsed,
        needs_better_image: analysis.needs_better_image || false,
        issue_type: analysis.issue_type || "unknown"
      });
    } catch (err) {
      console.error("[DISEASE DEBUG] Disease analysis route error:", err);
      res.status(500).json({
        success: false,
        message: "Could not complete image analysis at this time. Please ensure the image is clear and try again."
      });
    }
  }
);
diseaseRouter.get("/history", optionalAuth, (req, res) => {
  const userId = req.user?.id;
  const history = db.diseaseAnalyses.findByUserId(userId);
  res.json({ success: true, history });
});
diseaseRouter.get("/:id", (req, res) => {
  const { id } = req.params;
  const item = db.diseaseAnalyses.findById(id);
  if (!item) {
    res.status(404).json({ success: false, message: "Diagnosis record not found." });
    return;
  }
  res.json({ success: true, analysis: item });
});

// src/routes/weather.ts
var import_express5 = require("express");
var weatherRouter = (0, import_express5.Router)();
weatherRouter.get("/current", optionalAuth, async (req, res) => {
  try {
    const { location, lat, lon } = req.query;
    const targetLoc = location || req.user?.district || "Pune";
    const latitude = lat ? parseFloat(lat) : void 0;
    const longitude = lon ? parseFloat(lon) : void 0;
    const weather = await WeatherService.getLiveWeather(targetLoc, latitude, longitude);
    res.json({
      success: true,
      weather
    });
  } catch (err) {
    console.error("Weather route error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve weather data. Please try again."
    });
  }
});
weatherRouter.get("/locations", (_req, res) => {
  const list = Object.entries(DISTRICT_COORDINATES).map(([key, item]) => ({
    id: key,
    name: item.name,
    latitude: item.lat,
    longitude: item.lon
  }));
  res.json({ success: true, locations: list });
});

// src/routes/irrigation.ts
var import_express6 = require("express");

// src/services/irrigation/irrigationService.ts
var IrrigationService = class {
  static calculateRecommendation(input) {
    const lang = input.language || "en";
    const rainExpected = (input.upcomingRainProbability || 0) >= 60 || (input.recentRainfallMm || 0) > 10;
    const isSoilWet = input.soilMoistureLevel === "wet";
    const isSoilDry = input.soilMoistureLevel === "dry";
    const isHot = (input.temperature || 28) > 34;
    const soil = (input.soilType || "loam").toLowerCase();
    const isBlackSoil = soil.includes("black") || soil.includes("clay");
    const isSandy = soil.includes("sandy");
    let status = "irrigate_lightly";
    if (rainExpected || isSoilWet) {
      status = "delay_irrigation";
    } else if (isSoilDry || isHot && !rainExpected) {
      status = "irrigate_now";
    } else {
      status = "irrigate_lightly";
    }
    const messages = {
      en: {
        titles: {
          irrigate_now: "Irrigation Recommended Today",
          irrigate_lightly: "Light / Moderate Irrigation Needed",
          delay_irrigation: "Delay Irrigation \u2014 Sufficient Moisture / Rain Forecast",
          no_irrigation_needed: "No Irrigation Needed"
        },
        reasons: {
          delay_irrigation: rainExpected ? "High probability of upcoming rain or significant recent rainfall detected." : "Soil moisture is currently optimal. Excess watering can cause root rot.",
          irrigate_now: isSoilDry ? "Soil moisture is low and plants are at risk of moisture stress." : "High temperature accelerates plant evapotranspiration.",
          irrigate_lightly: "Crop is in steady growth phase; maintain consistent root-zone moisture."
        },
        weatherInfluence: `Forecast indicates ${input.upcomingRainProbability || 0}% chance of rain with current temperature around ${input.temperature || 28}\xB0C.`,
        soilConsiderations: isBlackSoil ? "Black/Clay soil has high water retention. Water slowly and avoid ponding." : isSandy ? "Sandy soil drains very quickly. Shorter, more frequent irrigation cycles are optimal." : "Loamy soil retains good balance of moisture and aeration.",
        suggestedAction: "Always perform the simple ball test: grab a handful of soil from 4 inches depth; if it holds form without crumbling, moisture is adequate.",
        waterSavingTip: input.irrigationMethod?.toLowerCase().includes("drip") ? "Drip irrigation saves 40-60% water compared to furrow flooding. Operate during early morning hours to minimize evaporation." : "Consider shifting to drip irrigation or mulching crop beds to reduce water evaporation by up to 50%."
      },
      hi: {
        titles: {
          irrigate_now: "\u0906\u091C \u0938\u093F\u0902\u091A\u093E\u0908 \u0915\u0940 \u0938\u0932\u093E\u0939 \u0926\u0940 \u091C\u093E\u0924\u0940 \u0939\u0948",
          irrigate_lightly: "\u0939\u0932\u094D\u0915\u0940 \u092F\u093E \u092E\u0927\u094D\u092F\u092E \u0938\u093F\u0902\u091A\u093E\u0908 \u0915\u0930\u0947\u0902",
          delay_irrigation: "\u0938\u093F\u0902\u091A\u093E\u0908 \u091F\u093E\u0932\u0947\u0902 \u2014 \u092C\u093E\u0930\u093F\u0936 \u0915\u0940 \u0938\u0902\u092D\u093E\u0935\u0928\u093E \u092F\u093E \u092A\u0930\u094D\u092F\u093E\u092A\u094D\u0924 \u0928\u092E\u0940",
          no_irrigation_needed: "\u0905\u092D\u0940 \u0938\u093F\u0902\u091A\u093E\u0908 \u0915\u0940 \u0906\u0935\u0936\u094D\u092F\u0915\u0924\u093E \u0928\u0939\u0940\u0902 \u0939\u0948"
        },
        reasons: {
          delay_irrigation: rainExpected ? "\u0906\u0928\u0947 \u0935\u093E\u0932\u0947 \u0938\u092E\u092F \u092E\u0947\u0902 \u092C\u093E\u0930\u093F\u0936 \u0915\u0940 \u0938\u0902\u092D\u093E\u0935\u0928\u093E \u092F\u093E \u0939\u093E\u0932\u093F\u092F\u093E \u0935\u0930\u094D\u0937\u093E \u0926\u0930\u094D\u091C \u0915\u0940 \u0917\u0908 \u0939\u0948\u0964" : "\u092E\u093F\u091F\u094D\u091F\u0940 \u092E\u0947\u0902 \u092A\u0930\u094D\u092F\u093E\u092A\u094D\u0924 \u0928\u092E\u0940 \u092C\u0928\u0940 \u0939\u0941\u0908 \u0939\u0948\u0964 \u0905\u0927\u093F\u0915 \u092A\u093E\u0928\u0940 \u0926\u0947\u0928\u0947 \u0938\u0947 \u091C\u0921\u093C \u0938\u0921\u093C\u0928 \u0939\u094B \u0938\u0915\u0924\u0940 \u0939\u0948\u0964",
          irrigate_now: isSoilDry ? "\u092E\u093F\u091F\u094D\u091F\u0940 \u092E\u0947\u0902 \u0928\u092E\u0940 \u0915\u092E \u0939\u0948, \u091C\u093F\u0938\u0938\u0947 \u092B\u0938\u0932 \u092E\u0947\u0902 \u0924\u0928\u093E\u0935 \u0906 \u0938\u0915\u0924\u093E \u0939\u0948\u0964" : "\u0905\u0927\u093F\u0915 \u0924\u093E\u092A\u092E\u093E\u0928 \u0915\u0947 \u0915\u093E\u0930\u0923 \u092A\u093E\u0928\u0940 \u0915\u0940 \u0916\u092A\u0924 \u092C\u0922\u093C \u0917\u0908 \u0939\u0948\u0964",
          irrigate_lightly: "\u092B\u0938\u0932 \u0915\u0940 \u0938\u093E\u092E\u093E\u0928\u094D\u092F \u0935\u0943\u0926\u094D\u0927\u093F \u0939\u0947\u0924\u0941 \u091C\u0921\u093C \u0915\u094D\u0937\u0947\u0924\u094D\u0930 \u092E\u0947\u0902 \u0938\u092E\u093E\u0928 \u0928\u092E\u0940 \u092C\u0928\u093E\u090F \u0930\u0916\u0947\u0902\u0964"
        },
        weatherInfluence: `\u092E\u094C\u0938\u092E \u092A\u0942\u0930\u094D\u0935\u093E\u0928\u0941\u092E\u093E\u0928: ${input.upcomingRainProbability || 0}% \u092C\u093E\u0930\u093F\u0936 \u0915\u0940 \u0938\u0902\u092D\u093E\u0935\u0928\u093E \u0914\u0930 \u0924\u093E\u092A\u092E\u093E\u0928 \u0932\u0917\u092D\u0917 ${input.temperature || 28}\xB0C \u0939\u0948\u0964`,
        soilConsiderations: isBlackSoil ? "\u0915\u093E\u0932\u0940/\u091A\u093F\u0915\u0928\u0940 \u092E\u093F\u091F\u094D\u091F\u0940 \u092E\u0947\u0902 \u092A\u093E\u0928\u0940 \u0938\u094B\u0916\u0928\u0947 \u0915\u0940 \u0915\u094D\u0937\u092E\u0924\u093E \u0905\u0927\u093F\u0915 \u0939\u094B\u0924\u0940 \u0939\u0948\u0964 \u091C\u0932\u092D\u0930\u093E\u0935 \u0928 \u0939\u094B\u0928\u0947 \u0926\u0947\u0902\u0964" : isSandy ? "\u092C\u0932\u0941\u0908 \u092E\u093F\u091F\u094D\u091F\u0940 \u0938\u0947 \u092A\u093E\u0928\u0940 \u0924\u0947\u091C\u0940 \u0938\u0947 \u0930\u093F\u0938 \u091C\u093E\u0924\u093E \u0939\u0948\u0964 \u0915\u092E \u092A\u093E\u0928\u0940 \u092C\u093E\u0930-\u092C\u093E\u0930 \u0926\u0947\u0928\u093E \u0932\u093E\u092D\u0926\u093E\u092F\u0915 \u0939\u0948\u0964" : "\u0926\u094B\u092E\u091F \u092E\u093F\u091F\u094D\u091F\u0940 \u092E\u0947\u0902 \u0928\u092E\u0940 \u0914\u0930 \u0939\u0935\u093E \u0915\u093E \u0938\u0902\u0924\u0941\u0932\u0928 \u0905\u091A\u094D\u091B\u093E \u0930\u0939\u0924\u093E \u0939\u0948\u0964",
        suggestedAction: "\u0916\u0947\u0924 \u092E\u0947\u0902 4 \u0907\u0902\u091A \u0917\u0939\u0930\u093E\u0908 \u0938\u0947 \u092E\u0941\u091F\u094D\u0920\u0940 \u092D\u0930 \u092E\u093F\u091F\u094D\u091F\u0940 \u0932\u0947\u0915\u0930 \u0932\u0921\u094D\u0921\u0942 \u092C\u0928\u093E\u0915\u0930 \u0926\u0947\u0916\u0947\u0902; \u092F\u0926\u093F \u0932\u0921\u094D\u0921\u0942 \u0906\u0938\u093E\u0928\u0940 \u0938\u0947 \u092C\u0928\u0924\u093E \u0939\u0948 \u0924\u094B \u0928\u092E\u0940 \u092A\u0930\u094D\u092F\u093E\u092A\u094D\u0924 \u0939\u0948\u0964",
        waterSavingTip: input.irrigationMethod?.toLowerCase().includes("drip") ? "\u0921\u094D\u0930\u093F\u092A \u0938\u093F\u0902\u091A\u093E\u0908 \u0938\u0947 40-60% \u092A\u093E\u0928\u0940 \u0915\u0940 \u092C\u091A\u0924 \u0939\u094B\u0924\u0940 \u0939\u0948\u0964 \u0935\u093E\u0937\u094D\u092A\u0940\u0915\u0930\u0923 \u0930\u094B\u0915\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0938\u0941\u092C\u0939 \u0915\u0947 \u0938\u092E\u092F \u0939\u0940 \u092A\u093E\u0928\u0940 \u091A\u0932\u093E\u090F\u0902\u0964" : "\u092A\u093E\u0928\u0940 \u0915\u0940 \u092C\u091A\u0924 \u0914\u0930 \u0928\u092E\u0940 \u092C\u0928\u093E\u090F \u0930\u0916\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u092E\u0947\u0921\u093C\u094B\u0902 \u092A\u0930 \u0938\u0942\u0916\u0940 \u0918\u093E\u0938 \u092F\u093E \u092E\u0932\u094D\u091A\u093F\u0902\u0917 \u0915\u093E \u0909\u092A\u092F\u094B\u0917 \u0915\u0930\u0947\u0902\u0964"
      },
      mr: {
        titles: {
          irrigate_now: "\u0906\u091C \u092A\u093E\u0923\u0940 \u0926\u0947\u0923\u094D\u092F\u093E\u091A\u0940 \u0936\u093F\u092B\u093E\u0930\u0938 \u0906\u0939\u0947",
          irrigate_lightly: "\u0939\u0932\u0915\u0947 \u0915\u093F\u0902\u0935\u093E \u092E\u0927\u094D\u092F\u092E \u092A\u093E\u0923\u0940 \u0926\u094D\u092F\u093E\u0935\u0947",
          delay_irrigation: "\u092A\u093E\u0923\u0940 \u0926\u0947\u0923\u0947 \u092A\u0941\u0922\u0947 \u0922\u0915\u0932\u093E \u2014 \u092A\u093E\u0935\u0938\u093E\u091A\u093E \u0905\u0902\u0926\u093E\u091C \u0915\u093F\u0902\u0935\u093E \u092A\u0941\u0930\u0947\u0938\u093E \u0913\u0932\u093E\u0935\u093E",
          no_irrigation_needed: "\u0938\u0927\u094D\u092F\u093E \u092A\u093E\u0923\u0940 \u0926\u0947\u0923\u094D\u092F\u093E\u091A\u0940 \u0906\u0935\u0936\u094D\u092F\u0915\u0924\u093E \u0928\u093E\u0939\u0940"
        },
        reasons: {
          delay_irrigation: rainExpected ? "\u092A\u093E\u0935\u0938\u093E\u091A\u093E \u0905\u0902\u0926\u093E\u091C \u0906\u0939\u0947 \u0915\u093F\u0902\u0935\u093E \u0928\u0941\u0915\u0924\u093E\u091A \u092A\u093E\u090A\u0938 \u091D\u093E\u0932\u093E \u0906\u0939\u0947. \u092A\u093E\u0923\u0940 \u0938\u093E\u091A\u0932\u094D\u092F\u093E\u0938 \u092E\u0941\u0933\u0947 \u0938\u0921\u0942 \u0936\u0915\u0924\u093E\u0924." : "\u091C\u092E\u093F\u0928\u0940\u0924 \u092A\u0941\u0930\u0947\u0938\u093E \u0913\u0932\u093E\u0935\u093E \u0906\u0939\u0947. \u0905\u0924\u093F \u092A\u093E\u0923\u094D\u092F\u093E\u092E\u0941\u0933\u0947 \u092A\u093F\u0915\u093E\u0932\u093E \u0905\u092A\u093E\u092F \u0939\u094B\u090A \u0936\u0915\u0924\u094B.",
          irrigate_now: isSoilDry ? "\u091C\u092E\u093F\u0928\u0940\u0924 \u0913\u0932\u093E\u0935\u093E \u0915\u092E\u0940 \u091D\u093E\u0932\u093E \u0905\u0938\u0942\u0928 \u092A\u093F\u0915\u093E\u0932\u093E \u092A\u093E\u0923\u094D\u092F\u093E\u091A\u0940 \u0924\u093E\u0924\u0921\u0940\u0928\u0947 \u0917\u0930\u091C \u0906\u0939\u0947." : "\u091C\u093E\u0938\u094D\u0924 \u0924\u093E\u092A\u092E\u093E\u0928\u093E\u092E\u0941\u0933\u0947 \u092C\u093E\u0937\u094D\u092A\u0940\u092D\u0935\u0928 \u0935\u093E\u0922\u0932\u0947 \u0906\u0939\u0947.",
          irrigate_lightly: "\u092A\u093F\u0915\u093E\u091A\u094D\u092F\u093E \u091A\u093E\u0902\u0917\u0932\u094D\u092F\u093E \u0935\u093E\u0922\u0940\u0938\u093E\u0920\u0940 \u092E\u0941\u0933\u093E\u0902\u091A\u094D\u092F\u093E \u092D\u093E\u0917\u093E\u0924 \u0939\u0932\u0915\u093E \u0913\u0932\u093E\u0935\u093E \u091F\u093F\u0915\u0935\u0942\u0928 \u0920\u0947\u0935\u093E."
        },
        weatherInfluence: `\u0939\u0935\u093E\u092E\u093E\u0928 \u0905\u0902\u0926\u093E\u091C: ${input.upcomingRainProbability || 0}% \u092A\u093E\u0935\u0938\u093E\u091A\u0940 \u0936\u0915\u094D\u092F\u0924\u093E \u0906\u0923\u093F \u0924\u093E\u092A\u092E\u093E\u0928 \u0938\u0941\u092E\u093E\u0930\u0947 ${input.temperature || 28}\xB0C \u0906\u0939\u0947.`,
        soilConsiderations: isBlackSoil ? "\u0915\u093E\u0933\u0940 \u0915\u093F\u0902\u0935\u093E \u091A\u093F\u0915\u0923\u092E\u093E\u0924\u0940 \u092A\u093E\u0923\u0940 \u091C\u093E\u0938\u094D\u0924 \u0935\u0947\u0933 \u0927\u0930\u0942\u0928 \u0920\u0947\u0935\u0924\u0947. \u0935\u093E\u092B\u094D\u092F\u093E\u0924 \u092A\u093E\u0923\u0940 \u0938\u093E\u091A\u0923\u093E\u0930 \u0928\u093E\u0939\u0940 \u092F\u093E\u091A\u0940 \u0915\u093E\u0933\u091C\u0940 \u0918\u094D\u092F\u093E." : isSandy ? "\u0939\u0932\u0915\u0940 \u0915\u093F\u0902\u0935\u093E \u0935\u093E\u0933\u0942\u092F\u0941\u0915\u094D\u0924 \u091C\u092E\u0940\u0928 \u0932\u0935\u0915\u0930 \u0915\u094B\u0930\u0921\u0940 \u0939\u094B\u0924\u0947. \u0915\u092E\u0940 \u092A\u094D\u0930\u092E\u093E\u0923\u093E\u0924 \u0935\u093E\u0930\u0902\u0935\u093E\u0930 \u092A\u093E\u0923\u0940 \u0926\u0947\u0923\u0947 \u092F\u094B\u0917\u094D\u092F \u0920\u0930\u0947\u0932." : "\u092E\u0927\u094D\u092F\u092E \u091C\u092E\u093F\u0928\u0940\u0924 \u0939\u0935\u093E \u0935 \u092A\u093E\u0923\u0940 \u0938\u0902\u0924\u0941\u0932\u0928 \u091A\u093E\u0902\u0917\u0932\u0947 \u0930\u093E\u0939\u0924\u0947.",
        suggestedAction: "\u091C\u092E\u093F\u0928\u0940\u0924\u0940\u0932 \u096A \u0907\u0902\u091A \u0916\u094B\u0932\u0940\u0935\u0930\u0940\u0932 \u092E\u093E\u0924\u0940 \u0939\u093E\u0924\u093E\u0924 \u0918\u0947\u090A\u0928 \u0932\u093E\u0921\u0942 \u0935\u0933\u0942\u0928 \u092A\u0939\u093E; \u092E\u093E\u0924\u0940\u091A\u093E \u0917\u094B\u0933\u093E \u091D\u093E\u0932\u093E \u0924\u0930 \u0913\u0932\u093E\u0935\u093E \u092A\u0941\u0930\u0947\u0938\u093E \u0906\u0939\u0947.",
        waterSavingTip: input.irrigationMethod?.toLowerCase().includes("drip") ? "\u0920\u093F\u092C\u0915 \u0938\u093F\u0902\u091A\u0928\u093E\u092E\u0941\u0933\u0947 \u096A\u0966-\u096C\u0966% \u092A\u093E\u0923\u094D\u092F\u093E\u091A\u0940 \u092C\u091A\u0924 \u0939\u094B\u0924\u0947. \u0909\u0928\u094D\u0939\u093E\u091A\u094D\u092F\u093E \u0935\u0947\u0933\u0947\u0924 \u0928 \u091A\u093E\u0932\u0935\u0924\u093E \u0938\u0915\u093E\u0933\u0940 \u0932\u0935\u0915\u0930 \u0920\u093F\u092C\u0915 \u091A\u093E\u0932\u0942 \u0915\u0930\u093E." : "\u092C\u093E\u0937\u094D\u092A\u0940\u092D\u0935\u0928 \u0930\u094B\u0916\u0923\u094D\u092F\u093E\u0938\u093E\u0920\u0940 \u0906\u0923\u093F \u092A\u093E\u0923\u0940 \u0935\u093E\u091A\u0935\u0923\u094D\u092F\u093E\u0938\u093E\u0920\u0940 \u092A\u093F\u0915\u093E\u091A\u094D\u092F\u093E \u0913\u0933\u0940\u0924 \u092A\u093E\u0932\u093E\u092A\u093E\u091A\u094B\u0933\u094D\u092F\u093E\u091A\u0947 \u0906\u091A\u094D\u091B\u093E\u0926\u0928 (\u092E\u0932\u094D\u091A\u093F\u0902\u0917) \u0915\u0930\u093E."
      }
    };
    const t = messages[lang] || messages.en;
    return {
      status,
      title: t.titles[status],
      recommendation: status === "delay_irrigation" ? t.titles.delay_irrigation : status === "irrigate_now" ? t.titles.irrigate_now : t.titles.irrigate_lightly,
      reason: t.reasons[status],
      weatherInfluence: t.weatherInfluence,
      soilConsiderations: t.soilConsiderations,
      suggestedAction: t.suggestedAction,
      waterSavingTip: t.waterSavingTip
    };
  }
};

// src/routes/irrigation.ts
var irrigationRouter = (0, import_express6.Router)();
irrigationRouter.post("/calculate", optionalAuth, async (req, res) => {
  try {
    const {
      cropName,
      growthStage,
      soilType,
      irrigationMethod,
      recentRainfallMm,
      upcomingRainProbability,
      temperature,
      soilMoistureLevel,
      language
    } = req.body;
    const lang = ["en", "hi", "mr"].includes(language) ? language : req.user?.preferredLanguage || "en";
    let rainProb = upcomingRainProbability;
    let temp = temperature;
    if (rainProb === void 0 || temp === void 0) {
      const weather = await WeatherService.getLiveWeather(req.user?.district || "Pune");
      if (rainProb === void 0) rainProb = weather.rainProbability;
      if (temp === void 0) temp = weather.temperature;
    }
    const recommendation = IrrigationService.calculateRecommendation({
      cropName: cropName || "General Crop",
      growthStage,
      soilType: soilType || "Medium Black Soil",
      irrigationMethod: irrigationMethod || "Drip Irrigation",
      recentRainfallMm: Number(recentRainfallMm || 0),
      upcomingRainProbability: Number(rainProb || 0),
      temperature: Number(temp || 28),
      soilMoistureLevel,
      language: lang
    });
    res.json({
      success: true,
      recommendation
    });
  } catch (err) {
    console.error("Irrigation calculation error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to calculate irrigation advisory."
    });
  }
});

// src/routes/advisor.ts
var import_express7 = require("express");
var advisorRouter = (0, import_express7.Router)();
advisorRouter.get("/daily", optionalAuth, async (req, res) => {
  try {
    const lang = req.user?.preferredLanguage || req.query.lang || "en";
    const district = req.user?.district || req.query.location || "Pune";
    const weather = await WeatherService.getLiveWeather(district);
    const crops = req.user?.id ? db.crops.findByUserId(req.user.id) : [];
    const advisories = {
      en: {
        farmingAdvice: weather.rainProbability > 50 ? "Rain showers are forecasted. Hold off on foliar fertilizer application and clear field water outlets." : "Favorable clear conditions. Ideal day for field scouting, intercultural weeding, and organic maintenance.",
        irrigationTip: weather.agriculturalImpact.irrigationAdvice.en,
        diseaseWarning: weather.agriculturalImpact.fungalDiseaseRisk === "high" ? "Elevated risk of fungal blights due to high moisture. Scout lower leaves and apply organic bio-agents." : "Low to moderate disease pressure today.",
        sprayTip: weather.agriculturalImpact.spraySuitability.reason.en,
        weatherSummary: `${weather.condition}, ${weather.temperature}\xB0C with ${weather.rainProbability}% chance of rain.`
      },
      hi: {
        farmingAdvice: weather.rainProbability > 50 ? "\u092C\u093E\u0930\u093F\u0936 \u0915\u0940 \u0938\u0902\u092D\u093E\u0935\u0928\u093E \u0939\u0948\u0964 \u092A\u0924\u094D\u0924\u093F\u092F\u094B\u0902 \u092A\u0930 \u091B\u093F\u0921\u093C\u0915\u093E\u0935 \u0930\u094B\u0915\u0947\u0902 \u0914\u0930 \u0916\u0947\u0924 \u0938\u0947 \u091C\u0932 \u0928\u093F\u0915\u093E\u0938\u0940 \u0915\u0947 \u0930\u093E\u0938\u094D\u0924\u0947 \u0938\u093E\u092B \u0930\u0916\u0947\u0902\u0964" : "\u092E\u094C\u0938\u092E \u0916\u0941\u0932\u093E \u0930\u0939\u0947\u0917\u093E\u0964 \u0916\u0947\u0924 \u0915\u0940 \u0928\u093F\u0917\u0930\u093E\u0928\u0940, \u0928\u093F\u0930\u093E\u0908-\u0917\u0941\u0921\u093C\u093E\u0908 \u090F\u0935\u0902 \u091C\u0948\u0935\u093F\u0915 \u0926\u0947\u0916\u092D\u093E\u0932 \u0915\u0947 \u0932\u093F\u090F \u0909\u0924\u094D\u0924\u092E \u0938\u092E\u092F \u0939\u0948\u0964",
        irrigationTip: weather.agriculturalImpact.irrigationAdvice.hi,
        diseaseWarning: weather.agriculturalImpact.fungalDiseaseRisk === "high" ? "\u0905\u0927\u093F\u0915 \u0928\u092E\u0940 \u0915\u0947 \u0915\u093E\u0930\u0923 \u092B\u092B\u0942\u0902\u0926 \u091C\u0928\u093F\u0924 \u0930\u094B\u0917\u094B\u0902 \u0915\u093E \u0916\u0924\u0930\u093E \u0905\u0927\u093F\u0915 \u0939\u0948\u0964 \u092A\u0924\u094D\u0924\u093F\u092F\u094B\u0902 \u0915\u0947 \u0928\u093F\u091A\u0932\u0947 \u092D\u093E\u0917 \u0915\u0940 \u091C\u093E\u0902\u091A \u0915\u0930\u0947\u0902\u0964" : "\u0906\u091C \u0930\u094B\u0917\u094B\u0902 \u0915\u093E \u0916\u0924\u0930\u093E \u0938\u093E\u092E\u093E\u0928\u094D\u092F \u0938\u0947 \u0915\u092E \u0939\u0948\u0964",
        sprayTip: weather.agriculturalImpact.spraySuitability.reason.hi,
        weatherSummary: `${weather.condition}, \u0924\u093E\u092A\u092E\u093E\u0928 ${weather.temperature}\xB0C \u0914\u0930 ${weather.rainProbability}% \u092C\u093E\u0930\u093F\u0936 \u0915\u0940 \u0938\u0902\u092D\u093E\u0935\u0928\u093E\u0964`
      },
      mr: {
        farmingAdvice: weather.rainProbability > 50 ? "\u092A\u093E\u0935\u0938\u093E\u091A\u093E \u0905\u0902\u0926\u093E\u091C \u0906\u0939\u0947. \u0916\u0924\u0947 \u0915\u093F\u0902\u0935\u093E \u092B\u0935\u093E\u0930\u0923\u0940 \u0926\u0947\u0923\u0947 \u091F\u093E\u0933\u093E \u0906\u0923\u093F \u0936\u0947\u0924\u093E\u0924\u0940\u0932 \u092A\u093E\u0923\u094D\u092F\u093E\u091A\u093E \u0928\u093F\u091A\u0930\u093E \u092F\u094B\u0917\u094D\u092F \u0930\u093E\u0939\u0940\u0932 \u092F\u093E\u091A\u0940 \u0916\u093E\u0924\u094D\u0930\u0940 \u0915\u0930\u093E." : "\u0939\u0935\u093E\u092E\u093E\u0928 \u0905\u0928\u0941\u0915\u0942\u0932 \u0906\u0939\u0947. \u092A\u093F\u0915\u093E\u091A\u0940 \u092A\u093E\u0939\u0923\u0940, \u0916\u0941\u0930\u092A\u0923\u0940 \u0906\u0923\u093F \u0938\u0947\u0902\u0926\u094D\u0930\u093F\u092F \u0916\u0924\u093E\u0902\u091A\u094D\u092F\u093E \u0935\u093E\u092A\u0930\u093E\u0938\u093E\u0920\u0940 \u0909\u0924\u094D\u0924\u092E \u0926\u093F\u0935\u0938 \u0906\u0939\u0947.",
        irrigationTip: weather.agriculturalImpact.irrigationAdvice.mr,
        diseaseWarning: weather.agriculturalImpact.fungalDiseaseRisk === "high" ? "\u091C\u093E\u0938\u094D\u0924 \u0906\u0930\u094D\u0926\u094D\u0930\u0924\u0947\u092E\u0941\u0933\u0947 \u0915\u0930\u092A\u093E \u0915\u093F\u0902\u0935\u093E \u092C\u0941\u0930\u0936\u0940\u091C\u0928\u094D\u092F \u0930\u094B\u0917\u093E\u0902\u091A\u093E \u092A\u094D\u0930\u093E\u0926\u0941\u0930\u094D\u092D\u093E\u0935 \u0935\u093E\u0922\u0942 \u0936\u0915\u0924\u094B. \u091F\u094D\u0930\u093E\u092F\u0915\u094B\u0921\u0930\u094D\u092E\u093E\u091A\u093E \u092A\u094D\u0930\u0924\u093F\u092C\u0902\u0927\u093E\u0924\u094D\u092E\u0915 \u0935\u093E\u092A\u0930 \u0915\u0930\u093E." : "\u0906\u091C \u0930\u094B\u0917\u093E\u0902\u091A\u093E \u092A\u094D\u0930\u093E\u0926\u0941\u0930\u094D\u092D\u093E\u0935 \u0935\u093E\u0922\u0923\u094D\u092F\u093E\u091A\u093E \u0927\u094B\u0915\u093E \u0915\u092E\u0940 \u0906\u0939\u0947.",
        sprayTip: weather.agriculturalImpact.spraySuitability.reason.mr,
        weatherSummary: `${weather.condition}, \u0924\u093E\u092A\u092E\u093E\u0928 ${weather.temperature}\xB0C \u0906\u0923\u093F ${weather.rainProbability}% \u092A\u093E\u0935\u0938\u093E\u091A\u0940 \u0936\u0915\u094D\u092F\u0924\u093E.`
      }
    };
    const selectedAdvisory = advisories[lang] || advisories.en;
    res.json({
      success: true,
      advisory: selectedAdvisory,
      weather,
      cropCount: crops.length
    });
  } catch (err) {
    console.error("Daily advisory error:", err);
    res.status(500).json({ success: false, message: "Could not generate daily advisory." });
  }
});
advisorRouter.post("/chat", optionalAuth, async (req, res) => {
  try {
    const { message, history = [], language, location, crop } = req.body;
    if (!message || typeof message !== "string") {
      res.status(400).json({ success: false, message: "Message content is required." });
      return;
    }
    const lang = ["en", "hi", "mr"].includes(language) ? language : req.user?.preferredLanguage || "en";
    const userLocation = location || req.user?.district || "Maharashtra, India";
    const activeCrop = crop || (req.user?.id ? db.crops.findByUserId(req.user.id).map((c) => c.cropName).join(", ") : "Crops");
    const context = {
      location: userLocation,
      crop: activeCrop,
      weather: "Live farm context"
    };
    const result = await AIService.chat(message, history, context, lang);
    res.json({
      success: true,
      reply: result.response,
      providerUsed: result.providerUsed
    });
  } catch (err) {
    console.error("Chat endpoint error:", err);
    res.status(500).json({
      success: false,
      message: "AI Assistant could not respond at this moment. Please try again."
    });
  }
});

// src/routes/alerts.ts
var import_express8 = require("express");

// src/services/alerts/alertService.ts
var import_uuid4 = require("uuid");
var AlertService = class {
  static generateAlertsForWeatherAndCrops(weather, crops, lang = "en") {
    const alerts = [];
    const now = (/* @__PURE__ */ new Date()).toISOString();
    if (weather.rainProbability >= 60 || weather.rainfallMm > 5) {
      alerts.push({
        id: (0, import_uuid4.v4)(),
        type: "rain",
        severity: weather.rainProbability >= 80 ? "critical" : "warning",
        title: lang === "mr" ? "\u{1F327}\uFE0F \u092A\u093E\u0935\u0938\u093E\u091A\u093E \u0907\u0936\u093E\u0930\u093E" : lang === "hi" ? "\u{1F327}\uFE0F \u092D\u093E\u0930\u0940 \u092C\u093E\u0930\u093F\u0936 \u0915\u0940 \u091A\u0947\u0924\u093E\u0935\u0928\u0940" : "\u{1F327}\uFE0F Rain Alert",
        message: lang === "mr" ? `\u092A\u0941\u0922\u0940\u0932 \u0968\u096A \u0924\u093E\u0938\u093E\u0902\u0924 ${weather.rainProbability}% \u092A\u093E\u0935\u0938\u093E\u091A\u0940 \u0936\u0915\u094D\u092F\u0924\u093E \u0906\u0939\u0947. \u0936\u0947\u0924\u093E\u0924 \u092A\u093E\u0923\u0940 \u0938\u093E\u091A\u0942 \u0928\u092F\u0947 \u092E\u094D\u0939\u0923\u0942\u0928 \u0928\u093F\u091A\u0930\u093E \u0935\u094D\u092F\u0935\u0938\u094D\u0925\u093E \u0924\u092A\u093E\u0938\u093E \u0906\u0923\u093F \u0930\u093E\u0938\u093E\u092F\u0928\u093F\u0915 \u092B\u0935\u093E\u0930\u0923\u0940 \u091F\u093E\u0933\u093E.` : lang === "hi" ? `\u0905\u0917\u0932\u0947 24 \u0918\u0902\u091F\u094B\u0902 \u092E\u0947\u0902 ${weather.rainProbability}% \u092C\u093E\u0930\u093F\u0936 \u0915\u0940 \u0938\u0902\u092D\u093E\u0935\u0928\u093E \u0939\u0948\u0964 \u091C\u0932 \u0928\u093F\u0915\u093E\u0938\u0940 \u0915\u0940 \u0935\u094D\u092F\u0935\u0938\u094D\u0925\u093E \u0915\u0930\u0947\u0902 \u0914\u0930 \u0915\u0940\u091F\u0928\u093E\u0936\u0915 \u091B\u093F\u0921\u093C\u0915\u093E\u0935 \u0938\u094D\u0925\u0917\u093F\u0924 \u0930\u0916\u0947\u0902\u0964` : `${weather.rainProbability}% chance of rain forecast. Ensure proper drainage in fields and hold off on pesticide or foliar sprays.`,
        date: now,
        read: false
      });
    }
    if (weather.temperature >= 36) {
      alerts.push({
        id: (0, import_uuid4.v4)(),
        type: "heat",
        severity: "warning",
        title: lang === "mr" ? "\u{1F525} \u0924\u0940\u0935\u094D\u0930 \u0909\u0937\u094D\u0923\u0924\u0947\u091A\u093E \u0907\u0936\u093E\u0930\u093E" : lang === "hi" ? "\u{1F525} \u0905\u0924\u094D\u092F\u0927\u093F\u0915 \u0917\u0930\u094D\u092E\u0940 \u0915\u0940 \u091A\u0947\u0924\u093E\u0935\u0928\u0940" : "\u{1F525} High Heat Advisory",
        message: lang === "mr" ? `\u0924\u093E\u092A\u092E\u093E\u0928 ${weather.temperature}\xB0C \u0935\u0930 \u092A\u094B\u0939\u094B\u091A\u0932\u0947 \u0906\u0939\u0947. \u092A\u093F\u0915\u093E\u0902\u092E\u0927\u0940\u0932 \u0913\u0932\u093E\u0935\u093E \u091F\u093F\u0915\u0935\u0923\u094D\u092F\u093E\u0938\u093E\u0920\u0940 \u0939\u0932\u0915\u0947 \u092A\u093E\u0923\u0940 \u0926\u094D\u092F\u093E\u0935\u0947 \u0935 \u0926\u0941\u092A\u093E\u0930\u091A\u094D\u092F\u093E \u0915\u0921\u0915 \u0909\u0928\u094D\u0939\u093E\u0924 \u092B\u0935\u093E\u0930\u0923\u0940 \u0915\u0930\u0942 \u0928\u092F\u0947.` : lang === "hi" ? `\u0924\u093E\u092A\u092E\u093E\u0928 ${weather.temperature}\xB0C \u0924\u0915 \u092A\u0939\u0941\u0902\u091A \u0917\u092F\u093E \u0939\u0948\u0964 \u092A\u094C\u0927\u094B\u0902 \u0915\u094B \u0928\u092E\u0940 \u0915\u0947 \u0924\u0928\u093E\u0935 \u0938\u0947 \u092C\u091A\u093E\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0938\u0941\u092C\u0939 \u092F\u093E \u0936\u093E\u092E \u0915\u094B \u0938\u093F\u0902\u091A\u093E\u0908 \u0915\u0930\u0947\u0902\u0964` : `Temperature has reached ${weather.temperature}\xB0C. Maintain soil moisture through light irrigation and avoid midday applications.`,
        date: now,
        read: false
      });
    }
    if (weather.humidity >= 78 && weather.temperature >= 20 && weather.temperature <= 30) {
      const cropListStr = crops.map((c) => c.cropName).join(", ") || "Tomato, Chilli, Cotton";
      alerts.push({
        id: (0, import_uuid4.v4)(),
        type: "disease",
        severity: "warning",
        title: lang === "mr" ? "\u{1F9A0} \u092C\u0941\u0930\u0936\u0940\u091C\u0928\u094D\u092F \u0930\u094B\u0917\u093E\u091A\u093E \u0927\u094B\u0915\u093E" : lang === "hi" ? "\u{1F9A0} \u092B\u092B\u0942\u0902\u0926 \u091C\u0928\u093F\u0924 \u0930\u094B\u0917 \u0915\u093E \u091C\u094B\u0916\u093F\u092E" : "\u{1F9A0} Fungal Disease Risk Alert",
        message: lang === "mr" ? `\u0939\u0935\u0947\u0924 \u0906\u0930\u094D\u0926\u094D\u0930\u0924\u093E (${weather.humidity}%) \u091C\u093E\u0938\u094D\u0924 \u0905\u0938\u0932\u094D\u092F\u093E\u0928\u0947 \u0915\u0930\u092A\u093E \u0915\u093F\u0902\u0935\u093E \u0924\u093E\u0902\u092C\u0947\u0930\u093E \u0930\u094B\u0917\u093E\u091A\u093E \u092A\u094D\u0930\u093E\u0926\u0941\u0930\u094D\u092D\u093E\u0935 \u0935\u093E\u0922\u0942 \u0936\u0915\u0924\u094B (${cropListStr}). \u091D\u093E\u0921\u093E\u0902\u091A\u0940 \u092A\u093E\u0939\u0923\u0940 \u0915\u0930\u093E \u0935 \u0938\u0947\u0902\u0926\u094D\u0930\u093F\u092F \u091F\u094D\u0930\u093E\u092F\u0915\u094B\u0921\u0930\u094D\u092E\u093E \u0915\u093F\u0902\u0935\u093E \u0924\u093E\u0915 \u092B\u0935\u093E\u0930\u0923\u0940\u091A\u093E \u0935\u093F\u091A\u093E\u0930 \u0915\u0930\u093E.` : lang === "hi" ? `\u0939\u0935\u093E \u092E\u0947\u0902 \u0905\u0927\u093F\u0915 \u0928\u092E\u0940 (${weather.humidity}%) \u0915\u0947 \u0915\u093E\u0930\u0923 \u092B\u092B\u0942\u0902\u0926 \u091C\u0928\u093F\u0924 \u0930\u094B\u0917\u094B\u0902 (\u091C\u0948\u0938\u0947 \u091D\u0941\u0932\u0938\u093E) \u0915\u093E \u0916\u0924\u0930\u093E \u092C\u0922\u093C \u0917\u092F\u093E \u0939\u0948 (${cropListStr})\u0964 \u091C\u0948\u0935\u093F\u0915 \u091F\u094D\u0930\u093E\u0907\u0915\u094B\u0921\u0930\u094D\u092E\u093E \u0915\u093E \u091B\u093F\u0921\u093C\u0915\u093E\u0935 \u0909\u092A\u092F\u094B\u0917\u0940 \u0930\u0939\u0947\u0917\u093E\u0964` : `High humidity (${weather.humidity}%) creates favorable conditions for fungal blights and rots in ${cropListStr}. Inspect lower leaves and consider preventative organic biocontrol.`,
        date: now,
        read: false
      });
    }
    if (weather.agriculturalImpact.spraySuitability.status === "poor") {
      alerts.push({
        id: (0, import_uuid4.v4)(),
        type: "pest",
        severity: "info",
        title: lang === "mr" ? "\u26A0\uFE0F \u0906\u091C \u092B\u0935\u093E\u0930\u0923\u0940 \u091F\u093E\u0933\u093E" : lang === "hi" ? "\u26A0\uFE0F \u0906\u091C \u091B\u093F\u0921\u093C\u0915\u093E\u0935 \u0928 \u0915\u0930\u0947\u0902" : "\u26A0\uFE0F Spraying Not Recommended Today",
        message: weather.agriculturalImpact.spraySuitability.reason[lang] || weather.agriculturalImpact.spraySuitability.reason.en,
        date: now,
        read: false
      });
    }
    return alerts;
  }
};

// src/routes/alerts.ts
var alertsRouter = (0, import_express8.Router)();
alertsRouter.get("/", optionalAuth, async (req, res) => {
  try {
    const lang = req.user?.preferredLanguage || req.query.lang || "en";
    const district = req.user?.district || req.query.location || "Pune";
    const weather = await WeatherService.getLiveWeather(district);
    const crops = req.user?.id ? db.crops.findByUserId(req.user.id) : [{ cropName: "General Crops" }];
    const generatedAlerts = AlertService.generateAlertsForWeatherAndCrops(weather, crops, lang);
    const storedAlerts = db.alerts.findByUserId(req.user?.id);
    const combined = [...generatedAlerts, ...storedAlerts];
    res.json({
      success: true,
      alerts: combined
    });
  } catch (err) {
    console.error("Alerts error:", err);
    res.status(500).json({ success: false, message: "Could not fetch alerts." });
  }
});
alertsRouter.put("/:id/read", (req, res) => {
  const { id } = req.params;
  db.alerts.markAsRead(id);
  res.json({ success: true, message: "Alert marked as read." });
});

// src/app.ts
var app = (0, import_express9.default)();
var allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5000",
  "http://127.0.0.1:5000",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://192.168.1.21:5173",
  "http://192.168.1.21:5000",
  "capacitor://localhost",
  "http://localhost",
  "https://localhost"
];
app.use((0, import_cors.default)({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app") || config.clientUrl && origin === config.clientUrl || /^https?:\/\/([a-zA-Z0-9-]+\.)*vercel\.app(:[0-9]+)?$/.test(origin) || /^http:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+)(:\d+)?$/.test(origin) || /^capacitor:\/\/localhost(:[0-9]+)?$/.test(origin) || /^https?:\/\/localhost(:[0-9]+)?$/.test(origin)) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(import_express9.default.json({ limit: "15mb" }));
app.use(import_express9.default.urlencoded({ extended: true, limit: "15mb" }));
app.use((req, _res, next) => {
  if (!req.url.startsWith("/api") && !req.url.startsWith("/uploads")) {
    req.url = `/api${req.url.startsWith("/") ? req.url : `/${req.url}`}`;
  }
  next();
});
var sendApiInfo = (_req, res) => {
  res.json({
    status: "ok",
    app: "KrishiMitra API",
    aiMode: config.aiMode,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
};
var sendHealthCheck = (_req, res) => {
  res.json({
    status: "ok",
    app: "KrishiMitra AI Farming Assistant Backend",
    aiMode: config.aiMode,
    geminiConfigured: Boolean(config.geminiApiKey),
    openaiConfigured: Boolean(config.openaiApiKey),
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
};
app.get("/api", sendApiInfo);
app.get("/api/", sendApiInfo);
app.get("/api/health", sendHealthCheck);
app.get("/health", sendHealthCheck);
app.use("/uploads", import_express9.default.static(config.uploadDir));
app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/crops", cropsRouter);
app.use("/api/disease", diseaseRouter);
app.use("/api/weather", weatherRouter);
app.use("/api/irrigation", irrigationRouter);
app.use("/api/advisor", advisorRouter);
app.use("/api/alerts", alertsRouter);
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl || req.url}`
  });
});
app.use((err, _req, res, _next) => {
  console.error("Unhandled Server Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Something went wrong. Please try again shortly."
  });
});
var app_default = app;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  app
});
module.exports = app_default; module.exports.default = app_default; module.exports.app = app_default;
